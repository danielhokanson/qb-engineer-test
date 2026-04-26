import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuiteService } from '../../data/suite.service';

@Component({
  selector: 'app-suites',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Reuses the stories page styles — same card layout, no new CSS.
  styleUrl: '../stories/stories.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Suites</span>
      </nav>

      <header class="head">
        <span class="label-mono">suites</span>
        <h1 class="title">Cross-cutting test suites</h1>
        <p class="sub">
          Each suite is a curated set of cases that exercise one
          dimension of the system end-to-end — the permissions matrix,
          standard reports, edge cases, audit trail, concurrency, and
          more. Pick a suite to start a run scoped to its cases only.
        </p>
      </header>

      @if (!suiteSvc.loaded()) {
        <div class="loading">Loading suites…</div>
      } @else if (suites().length === 0) {
        <div class="surface-card empty-state">
          No suites defined yet.
        </div>
      } @else {
        <ul class="story-list">
          @for (s of suites(); track s.directory) {
            <li class="surface-card surface-card-hover story-card">
              <a [routerLink]="['/suites', s.directory]" class="story-card-link">
                <div class="story-name">{{ s.title }}</div>
                @if (s.description) {
                  <p class="story-desc">{{ s.description }}</p>
                }
                <div class="story-meta">
                  <span class="meta-item">
                    <span class="meta-label">Cases</span>
                    <span class="meta-value">{{ s.case_count }}</span>
                  </span>
                  @if (s.planned_count > s.case_count) {
                    <span class="meta-item">
                      <span class="meta-label">Planned</span>
                      <span class="meta-value">
                        {{ s.planned_count }} ({{ s.planned_count - s.case_count }} pending)
                      </span>
                    </span>
                  }
                  @if (s.estimated_total_minutes) {
                    <span class="meta-item">
                      <span class="meta-label">Est. time</span>
                      <span class="meta-value">~{{ s.estimated_total_minutes }} min</span>
                    </span>
                  }
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </main>
  `,
})
export class SuitesPage {
  protected readonly suiteSvc = inject(SuiteService);

  readonly suites = computed(() => this.suiteSvc.index());

  constructor() {
    void this.suiteSvc.load();
  }
}
