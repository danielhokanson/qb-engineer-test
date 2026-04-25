import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Case, Fixture } from './types';

/**
 * Loads compiled catalog data (cases, tutorial, fixture) from /assets/data/*.json.
 * Exposes signal-based state that components can derive from.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  private readonly _cases = signal<Case[]>([]);
  private readonly _tutorial = signal<Case[]>([]);
  private readonly _fixtures = signal<Fixture[]>([]);
  private readonly _loaded = signal(false);

  readonly cases = this._cases.asReadonly();
  readonly tutorial = this._tutorial.asReadonly();
  readonly fixtures = this._fixtures.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  /** Unique role names derived from the union of cases.roles. */
  readonly roles = computed(() => {
    const set = new Set<string>();
    for (const c of this._cases()) {
      for (const role of c.roles ?? []) {
        set.add(role);
      }
    }
    return [...set].sort();
  });

  /** Phase names present in the case set, in declared order. */
  readonly phases = computed(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const c of this._cases()) {
      const phase = c.phase ?? '';
      if (phase && !seen.has(phase)) {
        seen.add(phase);
        order.push(phase);
      }
    }
    return order;
  });

  async load(): Promise<void> {
    if (this._loaded()) return;
    const [cases, tutorial, fixture] = await Promise.all([
      firstValueFrom(this.http.get<Case[]>('assets/data/cases.json')),
      firstValueFrom(this.http.get<Case[]>('assets/data/tutorial.json')),
      firstValueFrom(this.http.get<Fixture>('assets/data/fixture.json')),
    ]);
    this._cases.set(cases);
    this._tutorial.set(tutorial);
    this._fixtures.set([fixture]);
    this._loaded.set(true);
  }

  caseById(id: string): Case | undefined {
    return this._cases().find(c => c.id === id) ?? this._tutorial().find(c => c.id === id);
  }

  /** Cases that match at least one of the supplied roles. */
  casesForRoles(roles: string[]): Case[] {
    if (roles.length === 0) return [];
    const wanted = new Set(roles);
    return this._cases().filter(c => c.roles.some(r => wanted.has(r)));
  }
}
