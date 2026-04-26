import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Suite, SuiteSummary } from './types';

/**
 * Loads the suite index (assets/data/suites/index.json) and individual
 * suite manifests on demand. Each suite is a curated set of case IDs the
 * runner can scope a session to (permissions matrix, reports, edge cases,
 * etc.).
 */
@Injectable({ providedIn: 'root' })
export class SuiteService {
  private readonly http = inject(HttpClient);

  private readonly _index = signal<SuiteSummary[]>([]);
  private readonly _loaded = signal(false);
  private readonly _detail = new Map<string, Suite>();

  readonly index = this._index.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    try {
      const data = await firstValueFrom(
        this.http.get<SuiteSummary[]>('assets/data/suites/index.json'),
      );
      this._index.set(data);
    } catch {
      // No suites available; treat as empty (suites/ may not exist yet).
      this._index.set([]);
    }
    this._loaded.set(true);
  }

  /** Fetch a full suite manifest by directory name. Cached after first load. */
  async getSuite(directory: string): Promise<Suite | undefined> {
    const cached = this._detail.get(directory);
    if (cached) return cached;
    try {
      const data = await firstValueFrom(
        this.http.get<Suite>(`assets/data/suites/${directory}.json`),
      );
      this._detail.set(directory, data);
      return data;
    } catch {
      return undefined;
    }
  }
}
