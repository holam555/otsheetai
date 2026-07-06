import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProfiles, addProfile, deleteProfile, setActiveProfileId, getActiveProfileId,
  loadTemplateConfig, saveTemplateConfig,
  addHistory, loadHistory, countPrints,
  diffConfig, encodeConfig, decodeConfig,
} from '@/lib/persistence';
import { defaultConfig } from '@/lib/defaultConfig';
import { WorksheetConfig } from '@/lib/shapes';

beforeEach(() => localStorage.clear());

describe('profiles', () => {
  it('adds, lists and makes the new profile active', () => {
    const a = addProfile({ name: 'Ana', ageBand: '3-4', interests: ['animals'] });
    addProfile({ name: 'Ben', ageBand: '7-8' });
    expect(loadProfiles().map((p) => p.name)).toEqual(['Ana', 'Ben']);
    expect(getActiveProfileId()).not.toBe(a.id); // Ben (last added) is active
  });

  it('deleting the active profile reassigns active to a remaining one', () => {
    const a = addProfile({ name: 'Ana', ageBand: '3-4' });
    const b = addProfile({ name: 'Ben', ageBand: '7-8' });
    setActiveProfileId(b.id);
    deleteProfile(b.id);
    expect(loadProfiles().map((p) => p.name)).toEqual(['Ana']);
    expect(getActiveProfileId()).toBe(a.id);
  });

  it('migrates the v1 single-name profile', () => {
    localStorage.setItem('otsheet:profile:v1', JSON.stringify({ childName: 'Cara' }));
    const profiles = loadProfiles();
    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toBe('Cara');
    expect(getActiveProfileId()).toBe(profiles[0].id);
  });
});

describe('per-profile template config', () => {
  it('keeps each profile’s customization separate', () => {
    saveTemplateConfig('p1', 'find-shapes', { ...defaultConfig, gridSize: 5 });
    saveTemplateConfig('p2', 'find-shapes', { ...defaultConfig, gridSize: 2 });
    expect(loadTemplateConfig('p1', 'find-shapes')?.gridSize).toBe(5);
    expect(loadTemplateConfig('p2', 'find-shapes')?.gridSize).toBe(2);
  });
});

describe('history', () => {
  it('records prints and counts by template + difficulty', () => {
    addHistory({ profileId: 'p1', templateId: 't', diff: { difficulty: 'easy' }, seed: 1, printedAt: '' });
    addHistory({ profileId: 'p1', templateId: 't', diff: { difficulty: 'easy' }, seed: 2, printedAt: '' });
    addHistory({ profileId: 'p1', templateId: 't', diff: { difficulty: 'hard' }, seed: 3, printedAt: '' });
    expect(loadHistory()).toHaveLength(3);
    expect(countPrints('p1', 't', 'easy')).toBe(2);
    expect(countPrints('p1', 't', 'hard')).toBe(1);
  });
});

describe('config diff codec (used by history + shareable links)', () => {
  const base = defaultConfig;

  it('diff captures only changed keys', () => {
    const changed: WorksheetConfig = { ...base, gridSize: 5, childName: 'Zöe' };
    const diff = diffConfig(changed, base);
    expect(diff).toEqual({ gridSize: 5, childName: 'Zöe' });
  });

  it('encode → decode round-trips a diff and seed (incl. unicode)', () => {
    const diff = { childName: 'Zöe 你好', difficulty: 'hard' as const };
    const encoded = encodeConfig(diff, 12345);
    // base64url: no +, /, or = padding
    expect(encoded).not.toMatch(/[+/=]/);
    const decoded = decodeConfig(encoded);
    expect(decoded).toEqual({ diff, seed: 12345 });
  });

  it('decode returns null on garbage', () => {
    expect(decodeConfig('not-valid-@@')).toBeNull();
  });
});
