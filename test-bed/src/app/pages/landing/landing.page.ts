import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';
import { StoryService } from '../../data/story.service';
import { TutorialService } from '../../data/tutorial.service';
import { CaseResult, Session } from '../../data/types';

interface SessionCounts {
  pass: number;
  fail: number;
  blocked: number;
  total: number;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './landing.page.css',
  template: `
    <main class="page">
      <section class="hero">
        <div class="label-mono">qb-engineer · test bed</div>
        <h1 class="hero-title">Manual test runs for the qb-engineer ERP.</h1>
        <p class="hero-sub">
          Pick up a run you started earlier, or create a new one. Each run is
          stored in this browser only — close the tab and your progress will be
          waiting next time.
        </p>
        <div class="hero-actions">
          <a routerLink="/run/new" class="btn-primary">
            Start a new test run
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section class="entry-cards">
        <a routerLink="/tutorial" class="surface-card surface-card-hover entry-card">
          <div class="entry-text">
            <span class="label-mono">tutorial</span>
            <div class="entry-title">
              {{ tutorialAllComplete() ? 'Review the tutorial' : 'Take the tutorial first' }}
            </div>
            <div class="entry-body">
              @if (tutorialAllComplete()) {
                Tutorial complete. Open it any time to review or reset.
              } @else if (tutorialStarted()) {
                You started the tutorial — finish it before doing real runs.
              } @else {
                A short walk-through of how to read cases and record
                results. Built around a fake practice app — nothing you
                do affects real test data.
              }
            </div>
          </div>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>

        <a routerLink="/stories" class="surface-card surface-card-hover entry-card">
          <div class="entry-text">
            <span class="label-mono">stories</span>
            <div class="entry-title">Walk through a guided narrative</div>
            <div class="entry-body">
              An ordered tour of the system from empty database through to
              cash applied, with explicit role handoffs at every chapter.
              Jump in at any scene if you only want to test a piece.
            </div>
          </div>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>
      </section>

      <section class="runs">
        <div class="runs-head">
          <h2 class="section-title">Your runs</h2>
          <span class="runs-count">{{ sessions().length }} saved</span>
        </div>

        @if (sessions().length === 0) {
          <div class="surface-card empty-state">
            <div class="empty-title">No runs yet.</div>
            <div class="empty-body">
              When you create a run, it lives here so you can resume it later.
            </div>
          </div>
        } @else {
          <ul class="run-list">
            @for (s of sessions(); track s.id) {
              <li class="surface-card surface-card-hover run-card">
                <button
                  class="run-card-main"
                  type="button"
                  (click)="open(s)">
                  <div class="run-name-row">
                    <span class="run-name">{{ s.name }}</span>
                    @if (s.completed_at) {
                      <span class="run-badge complete">Complete</span>
                    }
                  </div>
                  <div class="run-meta">
                    <span class="meta-item">
                      <span class="meta-label">Roles</span>
                      <span class="meta-value">{{ rolesLabel(s) }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-label">
                        {{ s.completed_at ? 'Completed' : 'Updated' }}
                      </span>
                      <span class="meta-value">
                        {{ relTime(s.completed_at ?? s.updated_at) }}
                      </span>
                    </span>
                  </div>
                  @if (countsFor(s.id); as c) {
                    @if (c.total > 0) {
                      <div class="result-row" aria-label="Result counts">
                        <span class="result-pill pass" [class.zero]="c.pass === 0">
                          <span class="pill-num">{{ c.pass }}</span>
                          <span class="pill-label">pass</span>
                        </span>
                        <span class="result-pill fail" [class.zero]="c.fail === 0">
                          <span class="pill-num">{{ c.fail }}</span>
                          <span class="pill-label">fail</span>
                        </span>
                        <span
                          class="result-pill blocked"
                          [class.zero]="c.blocked === 0">
                          <span class="pill-num">{{ c.blocked }}</span>
                          <span class="pill-label">blocked</span>
                        </span>
                      </div>
                    }
                  }
                </button>
                <button
                  class="btn-ghost run-delete"
                  type="button"
                  (click)="delete(s)"
                  [attr.aria-label]="'Delete run ' + s.name">
                  Delete
                </button>
              </li>
            }
          </ul>
        }
      </section>
    </main>
  `,
})
export class LandingPage {
  private readonly sessionSvc = inject(SessionService);
  private readonly catalog = inject(CatalogService);
  private readonly tutorial = inject(TutorialService);
  private readonly router = inject(Router);

  /** Regular role-based runs only — story sessions surface under /stories. */
  readonly sessions = computed(() =>
    this.sessionSvc.sessions().filter(s => !s.story_id),
  );
  private readonly allResults = this.sessionSvc.allResults;

  readonly tutorialStarted = this.tutorial.started;
  readonly tutorialAllComplete = computed(() =>
    this.tutorial.isCompleteFor(this.catalog.tutorial().map(c => c.id)),
  );

  constructor() {
    void this.catalog.load();
  }

  /** Per-session counts indexed by session id. */
  private readonly countsBySession = computed<Map<string, SessionCounts>>(() => {
    const map = new Map<string, SessionCounts>();
    for (const r of this.allResults()) {
      const c = map.get(r.session_id) ?? { pass: 0, fail: 0, blocked: 0, total: 0 };
      if (r.status === 'pass') c.pass++;
      else if (r.status === 'fail') c.fail++;
      else if (r.status === 'blocked') c.blocked++;
      c.total = c.pass + c.fail + c.blocked;
      map.set(r.session_id, c);
    }
    return map;
  });

  countsFor(sessionId: string): SessionCounts {
    return (
      this.countsBySession().get(sessionId) ?? {
        pass: 0,
        fail: 0,
        blocked: 0,
        total: 0,
      }
    );
  }

  rolesLabel(s: Session): string {
    if (!s.selected_roles?.length) return '—';
    return s.selected_roles.join(', ');
  }

  relTime(iso: string): string {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d ago`;
    return new Date(iso).toLocaleDateString();
  }

  open(s: Session): void {
    this.router.navigate(['/run', s.id]);
  }

  async delete(s: Session): Promise<void> {
    const ok = confirm(`Delete run "${s.name}"? This cannot be undone.`);
    if (!ok) return;
    await this.sessionSvc.deleteSession(s.id);
  }
}
