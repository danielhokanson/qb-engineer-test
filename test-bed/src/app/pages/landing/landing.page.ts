import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../data/session.service';
import { Session } from '../../data/types';

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
                  <div class="run-name">{{ s.name }}</div>
                  <div class="run-meta">
                    <span class="meta-item">
                      <span class="meta-label">Roles</span>
                      <span class="meta-value">{{ rolesLabel(s) }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-label">Updated</span>
                      <span class="meta-value">{{ relTime(s.updated_at) }}</span>
                    </span>
                  </div>
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
  private readonly router = inject(Router);

  readonly sessions = this.sessionSvc.sessions;

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
