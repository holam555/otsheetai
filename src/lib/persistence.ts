import { WorksheetConfig } from '@/lib/shapes';

/**
 * Client-side persistence (localStorage). Two stores:
 *
 * 1. Child profile — name (+ age later) shared across all templates, so a
 *    returning parent never re-types it. This is the seed of the per-child
 *    profile system described in ROADMAP.md; keep the key versioned so a
 *    future multi-child schema can migrate it.
 * 2. Per-template config — the last customization made on each template, so
 *    settings survive refresh. Stored as a full config but always merged over
 *    the current template defaults on load, so adding new config fields is
 *    backward-compatible.
 *
 * All access is try/caught: localStorage can throw in private browsing or
 * when storage is full, and a worksheet generator must never crash over that.
 */

const PROFILE_KEY = 'otsheet:profile:v1';
const templateKey = (templateId: string) => `otsheet:config:v1:${templateId}`;

export interface ChildProfile {
  childName: string;
}

export function loadProfile(): ChildProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.childName === 'string' ? { childName: parsed.childName } : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ChildProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage unavailable — persistence is best-effort */
  }
}

export function loadTemplateConfig(templateId: string): Partial<WorksheetConfig> | null {
  try {
    const raw = localStorage.getItem(templateKey(templateId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Partial<WorksheetConfig>) : null;
  } catch {
    return null;
  }
}

export function saveTemplateConfig(templateId: string, config: WorksheetConfig): void {
  try {
    localStorage.setItem(templateKey(templateId), JSON.stringify(config));
  } catch {
    /* best-effort */
  }
}

export function clearTemplateConfig(templateId: string): void {
  try {
    localStorage.removeItem(templateKey(templateId));
  } catch {
    /* best-effort */
  }
}
