import { WorksheetConfig, EmojiTheme } from '@/lib/shapes';
import { AgeBand } from '@/lib/defaultConfig';

/**
 * Client-side persistence (localStorage), v2. Everything a returning family
 * relies on lives here so it survives refresh — and so a future backend
 * (ROADMAP Phase 4) can sync it. All records are keyed and versioned; all
 * access is try/caught because localStorage throws in private mode / when full,
 * and a worksheet generator must never crash over storage.
 *
 * Stores:
 *  - profiles         otsheet:profiles:v2       ChildProfile[]
 *  - active profile   otsheet:activeProfile:v2  profile id (string)
 *  - per-child config otsheet:config:v2:<pid>:<templateId>  Partial<WorksheetConfig>
 *  - print history    otsheet:history:v1        HistoryEntry[] (cap 200)
 *
 * Migrates the v1 single-name profile (otsheet:profile:v1 = { childName }).
 */

const PROFILES_KEY = 'otsheet:profiles:v2';
const ACTIVE_KEY = 'otsheet:activeProfile:v2';
const HISTORY_KEY = 'otsheet:history:v1';
const LEGACY_PROFILE_KEY = 'otsheet:profile:v1';
const HISTORY_CAP = 200;

/** Config bucket used when no child profile is selected. */
export const ANON_PROFILE_ID = 'anon';

const configKey = (profileId: string, templateId: string) => `otsheet:config:v2:${profileId}:${templateId}`;

export interface ChildProfile {
  id: string;
  name: string;
  ageBand: AgeBand;
  /** Preferred emoji themes — the first drives emoji-theme defaults. */
  interests: EmojiTheme[];
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  profileId: string;
  templateId: string;
  /** Config diff vs the template defaults (small); enough to reproduce. */
  diff: Partial<WorksheetConfig>;
  seed: number;
  printedAt: string;
}

// ---- low-level safe storage helpers ----
function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* best-effort */
  }
}
function removeRaw(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* best-effort */
  }
}
function readJSON<T>(key: string): T | null {
  const raw = readRaw(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return 'p-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---- profiles ----
function isValidProfile(p: unknown): p is ChildProfile {
  return !!p && typeof (p as ChildProfile).id === 'string' && typeof (p as ChildProfile).name === 'string';
}

export function loadProfiles(): ChildProfile[] {
  const list = readJSON<ChildProfile[]>(PROFILES_KEY);
  if (Array.isArray(list)) return list.filter(isValidProfile);

  // One-time migration from the v1 single-name profile.
  const legacy = readJSON<{ childName?: string }>(LEGACY_PROFILE_KEY);
  if (legacy?.childName) {
    const migrated: ChildProfile = {
      id: uuid(),
      name: legacy.childName,
      ageBand: '5-6',
      interests: [],
      createdAt: new Date().toISOString(),
    };
    saveProfiles([migrated]);
    setActiveProfileId(migrated.id);
    return [migrated];
  }
  return [];
}

export function saveProfiles(list: ChildProfile[]): void {
  writeRaw(PROFILES_KEY, JSON.stringify(list));
}

export function getActiveProfileId(): string | null {
  return readRaw(ACTIVE_KEY);
}
export function setActiveProfileId(id: string | null): void {
  if (id) writeRaw(ACTIVE_KEY, id);
  else removeRaw(ACTIVE_KEY);
}

export function getActiveProfile(): ChildProfile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  return loadProfiles().find((p) => p.id === id) ?? null;
}

export function addProfile(input: { name: string; ageBand: AgeBand; interests?: EmojiTheme[] }): ChildProfile {
  const profile: ChildProfile = {
    id: uuid(),
    name: input.name.trim(),
    ageBand: input.ageBand,
    interests: input.interests ?? [],
    createdAt: new Date().toISOString(),
  };
  const list = loadProfiles();
  saveProfiles([...list, profile]);
  setActiveProfileId(profile.id);
  return profile;
}

export function updateProfile(id: string, patch: Partial<Omit<ChildProfile, 'id' | 'createdAt'>>): void {
  const list = loadProfiles().map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveProfiles(list);
}

export function deleteProfile(id: string): void {
  const list = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(list);
  if (getActiveProfileId() === id) setActiveProfileId(list[0]?.id ?? null);
}

// ---- per-child, per-template config ----
export function loadTemplateConfig(profileId: string, templateId: string): Partial<WorksheetConfig> | null {
  const parsed = readJSON<Partial<WorksheetConfig>>(configKey(profileId, templateId));
  return parsed && typeof parsed === 'object' ? parsed : null;
}
export function saveTemplateConfig(profileId: string, templateId: string, config: WorksheetConfig): void {
  writeRaw(configKey(profileId, templateId), JSON.stringify(config));
}
export function clearTemplateConfig(profileId: string, templateId: string): void {
  removeRaw(configKey(profileId, templateId));
}

// ---- print history ----
export function loadHistory(): HistoryEntry[] {
  const list = readJSON<HistoryEntry[]>(HISTORY_KEY);
  return Array.isArray(list) ? list : [];
}
export function addHistory(entry: Omit<HistoryEntry, 'id'>): void {
  const list = loadHistory();
  const next: HistoryEntry[] = [{ id: uuid(), ...entry }, ...list].slice(0, HISTORY_CAP);
  writeRaw(HISTORY_KEY, JSON.stringify(next));
}
/** How many times this profile printed this template at a given difficulty. */
export function countPrints(profileId: string, templateId: string, difficulty?: string): number {
  return loadHistory().filter(
    (h) =>
      h.profileId === profileId &&
      h.templateId === templateId &&
      (difficulty === undefined || h.diff.difficulty === difficulty || (!('difficulty' in h.diff) && difficulty === undefined))
  ).length;
}

// ---- config diff codec (shared by history + shareable URLs) ----

/** Keys of `config` whose value differs from `base`, compared structurally. */
export function diffConfig(config: WorksheetConfig, base: WorksheetConfig): Partial<WorksheetConfig> {
  const out: Partial<WorksheetConfig> = {};
  (Object.keys(config) as (keyof WorksheetConfig)[]).forEach((k) => {
    if (JSON.stringify(config[k]) !== JSON.stringify(base[k])) {
      (out as Record<string, unknown>)[k] = config[k];
    }
  });
  return out;
}

// UTF-8 safe base64url so unicode names/instructions survive the round trip.
function toBase64Url(s: string): string {
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(b64)));
}

export function encodeConfig(diff: Partial<WorksheetConfig>, seed: number): string {
  return toBase64Url(JSON.stringify({ c: diff, s: seed }));
}
export function decodeConfig(encoded: string): { diff: Partial<WorksheetConfig>; seed: number } | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== 'object' || typeof parsed.c !== 'object') return null;
    return { diff: parsed.c as Partial<WorksheetConfig>, seed: typeof parsed.s === 'number' ? parsed.s : 0 };
  } catch {
    return null;
  }
}
