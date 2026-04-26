import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Case, Fixture, OptionalModule } from './types';

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
  private readonly _modules = signal<OptionalModule[]>([]);
  private readonly _loaded = signal(false);

  readonly cases = this._cases.asReadonly();
  readonly tutorial = this._tutorial.asReadonly();
  readonly fixtures = this._fixtures.asReadonly();
  readonly modules = this._modules.asReadonly();
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

  /** Unique flow ids derived from the union of cases.flows. */
  readonly flows = computed(() => {
    const set = new Set<string>();
    for (const c of this._cases()) {
      for (const flow of c.flows ?? []) {
        set.add(flow);
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
    const [cases, tutorial, fixture, modules] = await Promise.all([
      firstValueFrom(this.http.get<Case[]>('assets/data/cases.json')),
      firstValueFrom(this.http.get<Case[]>('assets/data/tutorial.json')),
      firstValueFrom(this.http.get<Fixture>('assets/data/fixture.json')),
      firstValueFrom(
        this.http.get<OptionalModule[]>('assets/data/modules.json'),
      ),
    ]);
    this._cases.set(cases);
    this._tutorial.set(tutorial);
    this._fixtures.set([fixture]);
    this._modules.set(modules);
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

  /** Cases that match the role filter and (if any flows specified) at
   * least one of the supplied flows. Empty `flows` means "no flow filter." */
  casesForRolesAndFlows(roles: string[], flows: string[]): Case[] {
    const byRole = this.casesForRoles(roles);
    if (flows.length === 0) return byRole;
    const wantedFlows = new Set(flows);
    return byRole.filter(c =>
      (c.flows ?? []).some(f => wantedFlows.has(f)),
    );
  }

  /** Count cases matching a single role (for badges in pickers). */
  caseCountForRole(role: string): number {
    return this._cases().filter(c => (c.roles ?? []).includes(role)).length;
  }

  /** Count cases matching a single flow within an optional role filter. */
  caseCountForFlow(flow: string, withinRoles: string[] = []): number {
    const pool = withinRoles.length === 0 ? this._cases() : this.casesForRoles(withinRoles);
    return pool.filter(c => (c.flows ?? []).includes(flow)).length;
  }

  /** Drop cases tagged with an `optional_module` that the session hasn't
   * enabled. Cases with no `optional_module` field are always kept.
   * Centralizing this here keeps templates from ever seeing a case the
   * tester opted out of. */
  filterByEnabledModules<T extends { optional_module?: string }>(
    cases: T[],
    enabledModules: string[] | undefined,
  ): T[] {
    const enabled = new Set(enabledModules ?? []);
    return cases.filter(c => {
      const mod = c.optional_module;
      if (!mod) return true;
      return enabled.has(mod);
    });
  }
}
