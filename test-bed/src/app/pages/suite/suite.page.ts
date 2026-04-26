import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';
import { SuiteService } from '../../data/suite.service';
import { Case, Suite } from '../../data/types';

@Component({
  selector: 'app-suite',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Reuses the run page's case-card styles — same layout the runner uses
  // for phase-based runs.
  styleUrl: '../run/run.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <a routerLink="/suites">Suites</a>
        <span class="sep">/</span>
        <span class="current">{{ suite()?.title ?? '…' }}</span>
      </nav>

      @if (suite(); as s) {
        <header class="head">
          <div class="head-meta">
            <span class="label-mono">suite</span>
            <span class="meta-pill">{{ s.case_ids.length }} cases</span>
            @if (s.missing_case_ids.length > 0) {
              <span class="meta-pill">
                {{ s.missing_case_ids.length }} pending
              </span>
            }
          </div>
          <div class="head-row">
            <h1 class="title">{{ s.title }}</h1>
            @if (s.case_ids.length > 0) {
              <button
                type="button"
                class="btn-primary"
                (click)="startRun()">
                Start a run for this suite
                <span aria-hidden="true">→</span>
              </button>
            }
          </div>
          @if (s.description) {
            <p class="sub">{{ s.description }}</p>
          }
        </header>

        <section class="case-group">
          <div class="group-head">
            <h2 class="group-title">Cases in this suite</h2>
            <span class="group-sub">{{ s.case_ids.length }} authored</span>
          </div>
          @if (s.case_ids.length === 0) {
            <div class="surface-card empty-state">
              No cases authored yet for this suite.
            </div>
          } @else {
            <ul class="case-list">
              @for (c of suiteCases(); track c.id) {
                <li class="surface-card case-card">
                  <div class="case-card-link">
                    <div class="case-id-block">
                      <span class="case-id">{{ c.id }}</span>
                    </div>
                    <div class="case-title">{{ c.title }}</div>
                    <div class="case-goal">{{ c.goal }}</div>
                    <div class="case-meta">
                      <span>{{ c.roles.join(', ') }}</span>
                      @if (c.est_minutes; as min) {
                        <span>· ~{{ min }} min</span>
                      }
                    </div>
                  </div>
                </li>
              }
            </ul>
          }
        </section>

        @if (s.missing_case_ids.length > 0) {
          <section class="case-group">
            <div class="group-head">
              <h2 class="group-title">Planned but not yet authored</h2>
              <span class="group-sub">{{ s.missing_case_ids.length }} pending</span>
            </div>
            <div class="surface-card empty-state">
              <ul style="margin: 0; padding-left: 1.25rem;">
                @for (id of s.missing_case_ids; track id) {
                  <li>{{ id }}</li>
                }
              </ul>
            </div>
          </section>
        }
      } @else {
        <div class="loading">Loading suite…</div>
      }
    </main>
  `,
})
export class SuitePage {
  readonly suiteId = input.required<string>();

  private readonly suiteSvc = inject(SuiteService);
  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);

  readonly suite = signal<Suite | undefined>(undefined);

  readonly suiteCases = computed<Case[]>(() => {
    const s = this.suite();
    if (!s) return [];
    return s.case_ids
      .map(id => this.catalog.caseById(id))
      .filter((c): c is Case => Boolean(c));
  });

  constructor() {
    void this.catalog.load();
    void this.suiteSvc.load();

    effect(async () => {
      const id = this.suiteId();
      if (!id) return;
      await this.catalog.load();
      const s = await this.suiteSvc.getSuite(id);
      this.suite.set(s);
    });
  }

  async startRun(): Promise<void> {
    const s = this.suite();
    if (!s || s.case_ids.length === 0) return;
    const fixture = this.catalog.fixtures()[0];
    const session = await this.sessionSvc.createSession({
      name: s.title,
      fixtureId: fixture?.id ?? 'cascade-components-mid',
      selectedRoles: [],
      suiteId: s.id,
      selectedCaseIds: s.case_ids,
    });
    await this.router.navigate(['/run', session.id]);
  }
}
