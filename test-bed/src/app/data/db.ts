import Dexie, { Table } from 'dexie';
import { CaseResult, Session } from './types';

export class TestBedDb extends Dexie {
  sessions!: Table<Session, string>;
  results!: Table<CaseResult, string>;

  constructor() {
    super('qb-engineer-test-bed');
    this.version(1).stores({
      sessions: 'id, name, created_at, updated_at',
      results: 'id, session_id, case_id, status, [session_id+case_id]',
    });
  }
}

export const db = new TestBedDb();
