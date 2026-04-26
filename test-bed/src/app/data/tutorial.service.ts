import { Injectable, computed, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TutorialResult } from './db';
import { CaseStatus } from './types';

/**
 * Tutorial progress is per-tester (per-browser), not per-session.
 * Stored in its own Dexie table so it never mixes with real test results.
 */
@Injectable({ providedIn: 'root' })
export class TutorialService {
  /** All recorded tutorial results across all tutorial cases. */
  readonly results = signal<TutorialResult[]>([]);

  constructor() {
    liveQuery(() => db.tutorialResults.toArray()).subscribe(rows =>
      this.results.set(rows),
    );
  }

  /** True once at least one tutorial case has a recorded result. */
  readonly started = computed(() => this.results().length > 0);

  /** True only when every supplied case id has a non-pending result.
   * The tutorial case list is supplied by the caller because the catalog
   * service owns it. */
  isCompleteFor(tutorialCaseIds: string[]): boolean {
    if (tutorialCaseIds.length === 0) return false;
    const recorded = new Set(this.results().map(r => r.case_id));
    return tutorialCaseIds.every(id => recorded.has(id));
  }

  statusFor(caseId: string): CaseStatus {
    const r = this.results().find(x => x.case_id === caseId);
    return r?.status ?? 'pending';
  }

  async record(input: {
    caseId: string;
    status: CaseStatus;
    failureNote?: string;
  }): Promise<void> {
    await db.tutorialResults.put({
      case_id: input.caseId,
      status: input.status,
      failure_note: input.failureNote,
      completed_at: new Date().toISOString(),
    });
  }

  async reset(): Promise<void> {
    await db.tutorialResults.clear();
  }
}
