import Dexie, { Table } from 'dexie';
import { CaseResult, CaseStatus, Session } from './types';

/** Tutorial results live in their own table: they're per-tester (per-browser),
 * not per-session. A tester does the tutorial once. */
export interface TutorialResult {
  case_id: string;
  status: CaseStatus;
  failure_note?: string;
  completed_at: string;
}

export class TestBedDb extends Dexie {
  sessions!: Table<Session, string>;
  results!: Table<CaseResult, string>;
  tutorialResults!: Table<TutorialResult, string>;

  constructor() {
    super('qb-engineer-test-bed');
    this.version(1).stores({
      sessions: 'id, name, created_at, updated_at',
      results: 'id, session_id, case_id, status, [session_id+case_id]',
    });
    // v2: split tutorial results into their own table.
    this.version(2).stores({
      sessions: 'id, name, created_at, updated_at',
      results: 'id, session_id, case_id, status, [session_id+case_id]',
      tutorialResults: 'case_id, status, completed_at',
    });
  }
}

export const db = new TestBedDb();
