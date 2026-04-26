import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { TutorialService } from '../../data/tutorial.service';
import { CaseStatus } from '../../data/types';

@Component({
  selector: 'app-tutorial',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tutorial.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Tutorial</span>
      </nav>

      <header class="head">
        <span class="label-mono">tutorial</span>
        <h1 class="title">Learn how to read and run a test case</h1>
        <p class="sub">
          A short walk-through that teaches the language of test cases, how
          to record results honestly, and how the runner remembers your
          progress. The cases here use a built-in Practice App — nothing
          you do affects anything outside this tab.
        </p>
        <p class="sub">
          You only need to do this once per browser. Your tutorial progress
          is separate from any real test runs.
        </p>
      </header>

      @if (catalog.loaded() && tutorialCases().length === 0) {
        <div class="surface-card empty-state">
          No tutorial cases are defined.
        </div>
      } @else if (!catalog.loaded()) {
        <div class="loading">Loading tutorial…</div>
      } @else {
        <section class="case-group">
          <div class="group-head">
            <h2 class="group-title">Tutorial cases</h2>
            <span class="group-sub">{{ tutorialCases().length }} cases · ~{{ totalMinutes() }} min</span>
          </div>
          <ul class="case-list">
            @for (c of tutorialCases(); track c.id) {
              <li class="surface-card surface-card-hover case-card">
                <a [routerLink]="['/tutorial/case', c.id]" class="case-card-link">
                  <div class="case-id-block">
                    <span class="case-id">{{ c.id }}</span>
                    <span class="case-status status-{{ statusFor(c.id) }}">
                      {{ statusLabel(statusFor(c.id)) }}
                    </span>
                  </div>
                  <div class="case-title">{{ c.title }}</div>
                  <div class="case-goal">{{ c.goal }}</div>
                  @if (c.est_minutes; as min) {
                    <div class="case-meta">~{{ min }} min</div>
                  }
                </a>
              </li>
            }
          </ul>
        </section>

        @if (allComplete()) {
          <div class="completion-banner">
            <span class="completion-eyebrow">Tutorial complete</span>
            <p class="completion-body">
              You've worked through every tutorial case. Real test runs are
              ready when you are.
            </p>
            <div class="completion-actions">
              <a routerLink="/run/new" class="btn-primary">Start a real test run</a>
              <button type="button" class="btn-secondary" (click)="reset()">
                Reset tutorial progress
              </button>
            </div>
          </div>
        }
      }
    </main>
  `,
})
export class TutorialPage {
  protected readonly catalog = inject(CatalogService);
  private readonly tutorial = inject(TutorialService);

  readonly tutorialCases = computed(() => this.catalog.tutorial());

  readonly totalMinutes = computed(() => {
    return this.tutorialCases().reduce((sum, c) => sum + (c.est_minutes ?? 0), 0);
  });

  readonly allComplete = computed(() =>
    this.tutorial.isCompleteFor(this.tutorialCases().map(c => c.id)),
  );

  constructor() {
    void this.catalog.load();
  }

  statusFor(caseId: string): CaseStatus {
    return this.tutorial.statusFor(caseId);
  }

  statusLabel(s: CaseStatus): string {
    switch (s) {
      case 'pass': return 'Passed';
      case 'fail': return 'Failed';
      case 'blocked': return 'Blocked';
      default: return 'Not started';
    }
  }

  async reset(): Promise<void> {
    const ok = confirm(
      'Reset tutorial progress? Your real test runs are not affected.',
    );
    if (!ok) return;
    await this.tutorial.reset();
  }
}
