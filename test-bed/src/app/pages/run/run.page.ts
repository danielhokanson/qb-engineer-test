import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';
import { Case, CaseStatus, Session } from '../../data/types';

@Component({
  selector: 'app-run',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './run.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">All runs</a>
        <span class="sep">/</span>
        <span class="current">{{ session()?.name ?? '…' }}</span>
      </nav>

      @if (session(); as s) {
        <header class="head">
          <div class="head-meta">
            <span class="label-mono">test run</span>
            <span class="meta-pill">{{ scopeLabel() }}</span>
            @if (s.completed_at) {
              <span class="meta-pill complete">Complete</span>
            }
          </div>
          <div class="head-row">
            <h1 class="title">{{ s.name }}</h1>
            @if (totalRecorded() > 0) {
              <button
                type="button"
                class="btn-secondary"
                (click)="exportResults()"
                title="Download a JSON file with this run's results">
                Export results
              </button>
            }
          </div>
          <div class="run-stats">
            <span class="stat">
              <span class="stat-label">Roles</span>
              <span class="stat-value">{{ s.selected_roles.join(', ') || '—' }}</span>
            </span>
            @if (s.selected_flows && s.selected_flows.length > 0) {
              <span class="stat">
                <span class="stat-label">Flows</span>
                <span class="stat-value">{{ s.selected_flows.join(', ') }}</span>
              </span>
            }
            <span class="stat">
              <span class="stat-label">Pass</span>
              <span class="stat-value pass">{{ counts().pass }}</span>
            </span>
            <span class="stat">
              <span class="stat-label">Fail</span>
              <span class="stat-value fail">{{ counts().fail }}</span>
            </span>
            <span class="stat">
              <span class="stat-label">Blocked</span>
              <span class="stat-value blocked">{{ counts().blocked }}</span>
            </span>
            <span class="stat">
              <span class="stat-label">Pending</span>
              <span class="stat-value">{{ counts().pending }}</span>
            </span>
          </div>
        </header>

        @if (isComplete()) {
          <section class="completion-banner">
            <div class="completion-head">
              <span class="completion-eyebrow">Run complete</span>
              <h2 class="completion-title">
                You ran every case in this session.
              </h2>
              <p class="completion-sub">
                Export your results to send to the maintainer, or head back to
                pick up another run.
              </p>
            </div>
            <div class="completion-stats">
              <span class="completion-stat pass">
                <span class="completion-num">{{ counts().pass }}</span>
                <span class="completion-cap">passed</span>
              </span>
              <span class="completion-stat fail">
                <span class="completion-num">{{ counts().fail }}</span>
                <span class="completion-cap">failed</span>
              </span>
              <span class="completion-stat blocked">
                <span class="completion-num">{{ counts().blocked }}</span>
                <span class="completion-cap">blocked</span>
              </span>
            </div>
            <div class="completion-actions">
              <button type="button" class="btn-primary" (click)="exportResults()">
                Export results
              </button>
              <a routerLink="/" class="btn-secondary">
                Back to all runs
              </a>
            </div>
          </section>
        }

        <section class="case-group">
          <div class="group-head">
            <h2 class="group-title">Cases for your roles</h2>
            <span class="group-sub">{{ filteredCases().length }} cases</span>
          </div>
          @if (filteredCases().length === 0) {
            <div class="surface-card empty-state">
              No cases match the selected roles. Either add cases tagged with
              these roles, or
              <a [routerLink]="['/']">start a new run</a> with different roles.
            </div>
          } @else {
            <ul class="case-list">
              @for (c of filteredCases(); track c.id) {
                <li class="surface-card surface-card-hover case-card">
                  <a [routerLink]="['/run', s.id, 'case', c.id]" class="case-card-link">
                    <div class="case-id-block">
                      <span class="case-id">{{ c.id }}</span>
                      <span class="case-status status-{{ statusFor(c.id) }}">
                        {{ statusLabel(statusFor(c.id)) }}
                      </span>
                    </div>
                    <div class="case-title">{{ c.title }}</div>
                    <div class="case-goal">{{ c.goal }}</div>
                    <div class="case-meta">
                      <span>{{ c.roles.join(', ') }}</span>
                      @if (c.est_minutes; as min) {
                        <span>· ~{{ min }} min</span>
                      }
                    </div>
                  </a>
                </li>
              }
            </ul>
          }
        </section>
      } @else {
        <div class="loading">Loading run…</div>
      }
    </main>
  `,
})
export class RunPage {
  readonly sessionId = input.required<string>();

  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);

  readonly session = signal<Session | undefined>(undefined);

  /** Results filtered to this session, sourced from the live signal in
   * SessionService so they update automatically when the case page records
   * a new result. */
  readonly results = computed(() => {
    const id = this.sessionId();
    return this.sessionSvc.allResults().filter(r => r.session_id === id);
  });

  readonly filteredCases = computed<Case[]>(() => {
    const s = this.session();
    if (!s) return [];
    // Suite-scoped sessions filter by an explicit list of case IDs and
    // ignore role/flow filtering.
    if (s.selected_case_ids && s.selected_case_ids.length > 0) {
      return s.selected_case_ids
        .map(id => this.catalog.caseById(id))
        .filter((c): c is Case => Boolean(c));
    }
    return this.catalog.casesForRolesAndFlows(
      s.selected_roles,
      s.selected_flows ?? [],
    );
  });

  readonly scopeLabel = computed(() => {
    const s = this.session();
    if (!s) return '';
    if (s.suite_id) return `suite · ${s.suite_id}`;
    if (s.selected_roles.length === 0) return 'no roles';
    if (s.selected_roles.length === 1) return s.selected_roles[0];
    return `${s.selected_roles.length} roles`;
  });

  readonly counts = computed(() => {
    const cases = this.filteredCases();
    const map = new Map(this.results().map(r => [r.case_id, r.status]));
    let pass = 0, fail = 0, blocked = 0, pending = 0;
    for (const c of cases) {
      const s = map.get(c.id) ?? 'pending';
      if (s === 'pass') pass++;
      else if (s === 'fail') fail++;
      else if (s === 'blocked') blocked++;
      else pending++;
    }
    return { pass, fail, blocked, pending };
  });

  readonly totalRecorded = computed(() => {
    const c = this.counts();
    return c.pass + c.fail + c.blocked;
  });

  readonly isComplete = computed(() => {
    const c = this.counts();
    return c.pending === 0 && c.pass + c.fail + c.blocked > 0;
  });

  constructor() {
    void this.catalog.load();

    // Load the session whenever the route id changes.
    effect(async () => {
      const id = this.sessionId();
      if (!id) return;
      const session = await this.sessionSvc.getSession(id);
      this.session.set(session);
    });

    // When this run becomes complete (and the catalog has loaded so counts
    // are meaningful), stamp completed_at on the session if not already set.
    effect(async () => {
      const id = this.sessionId();
      const session = this.session();
      const complete = this.isComplete();
      if (!id || !session || !this.catalog.loaded()) return;
      if (complete && !session.completed_at) {
        await this.sessionSvc.markCompleted(id);
        // Re-read to reflect the new timestamp in the UI.
        const updated = await this.sessionSvc.getSession(id);
        this.session.set(updated);
      }
    });
  }

  statusFor(caseId: string): CaseStatus {
    return this.results().find(r => r.case_id === caseId)?.status ?? 'pending';
  }

  statusLabel(s: CaseStatus): string {
    switch (s) {
      case 'pass': return 'Passed';
      case 'fail': return 'Failed';
      case 'blocked': return 'Blocked';
      default: return 'Not started';
    }
  }

  async exportResults(): Promise<void> {
    await this.sessionSvc.downloadExport(this.sessionId());
  }
}
