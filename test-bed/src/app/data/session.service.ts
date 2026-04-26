import { Injectable, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from './db';
import { CaseResult, CaseStatus, Session } from './types';

function uid(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Wraps Dexie operations on sessions and results.
 * The home page reads `sessions$` to render the list; case execution
 * reads/writes results.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /**
   * Sessions sorted newest-first. Backed by Dexie liveQuery so it
   * updates automatically when records change.
   */
  readonly sessions = signal<Session[]>([]);

  /**
   * All case results across all sessions. Used by the landing page to
   * render per-session result counts. Backed by Dexie liveQuery so
   * it updates automatically.
   */
  readonly allResults = signal<CaseResult[]>([]);

  constructor() {
    liveQuery(() =>
      db.sessions.orderBy('updated_at').reverse().toArray(),
    ).subscribe(rows => this.sessions.set(rows));
    liveQuery(() => db.results.toArray()).subscribe(rows =>
      this.allResults.set(rows),
    );
  }

  async createSession(input: {
    name: string;
    fixtureId: string;
    selectedRoles: string[];
    selectedFlows?: string[];
    storyId?: string;
  }): Promise<Session> {
    const session: Session = {
      id: uid(),
      name: input.name,
      created_at: nowIso(),
      updated_at: nowIso(),
      fixture_id: input.fixtureId,
      language: 'en-US',
      selected_roles: input.selectedRoles,
      selected_flows: input.selectedFlows ?? [],
      story_id: input.storyId,
      branch_choices: {},
      tutorial_completed: false,
      current_case_id: null,
    };
    await db.sessions.put(session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return db.sessions.get(id);
  }

  async touchSession(id: string, patch: Partial<Session> = {}): Promise<void> {
    const current = await db.sessions.get(id);
    if (!current) return;
    await db.sessions.put({ ...current, ...patch, updated_at: nowIso() });
  }

  async deleteSession(id: string): Promise<void> {
    await db.transaction('rw', db.sessions, db.results, async () => {
      await db.sessions.delete(id);
      await db.results.where('session_id').equals(id).delete();
    });
  }

  async resultsForSession(sessionId: string): Promise<CaseResult[]> {
    return db.results.where('session_id').equals(sessionId).toArray();
  }

  async recordResult(input: {
    sessionId: string;
    caseId: string;
    status: CaseStatus;
    failureNote?: string;
  }): Promise<CaseResult> {
    const existing = await db.results
      .where('[session_id+case_id]')
      .equals([input.sessionId, input.caseId])
      .first();
    const result: CaseResult = {
      id: existing?.id ?? uid(),
      session_id: input.sessionId,
      case_id: input.caseId,
      status: input.status,
      started_at: existing?.started_at ?? nowIso(),
      completed_at: nowIso(),
      failure_note: input.failureNote,
    };
    await db.results.put(result);
    await this.touchSession(input.sessionId, { current_case_id: input.caseId });
    return result;
  }

  /** Stamp completed_at on the session if not already set. Idempotent. */
  async markCompleted(sessionId: string): Promise<void> {
    const session = await db.sessions.get(sessionId);
    if (!session || session.completed_at) return;
    await db.sessions.put({
      ...session,
      completed_at: nowIso(),
      updated_at: nowIso(),
    });
  }

  /** Build a JSON export of the session and its results. */
  async buildExport(sessionId: string): Promise<{
    session: Session;
    results: CaseResult[];
    exported_at: string;
    library_version: string;
  } | null> {
    const session = await db.sessions.get(sessionId);
    if (!session) return null;
    const results = await this.resultsForSession(sessionId);
    return {
      session,
      results,
      exported_at: nowIso(),
      library_version: '0.1.0',
    };
  }

  /** Trigger a browser download of the session's JSON export. */
  async downloadExport(sessionId: string): Promise<void> {
    const payload = await this.buildExport(sessionId);
    if (!payload) return;
    const safeName = payload.session.name
      .replace(/[^a-z0-9_-]+/gi, '_')
      .toLowerCase()
      .slice(0, 60);
    const filename = `qb-test-${safeName}-${payload.session.id.slice(0, 8)}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
