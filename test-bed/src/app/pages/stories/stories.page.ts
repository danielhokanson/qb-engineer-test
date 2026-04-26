import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { StoryService } from '../../data/story.service';
import { SessionService } from '../../data/session.service';

@Component({
  selector: 'app-stories',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './stories.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <span class="current">Stories</span>
      </nav>

      <header class="head">
        <span class="label-mono">stories</span>
        <h1 class="title">Guided end-to-end walk-throughs</h1>
        <p class="sub">
          Each story is an ordered narrative through the system, with
          explicit role handoffs. Run one to see how the whole app fits
          together — or jump in at any scene to test a specific part of
          the lifecycle in context.
        </p>
      </header>

      @if (!storySvc.loaded()) {
        <div class="loading">Loading stories…</div>
      } @else if (storySvc.stories().length === 0) {
        <div class="surface-card empty-state">
          No stories defined yet.
        </div>
      } @else {
        <ul class="story-list">
          @for (s of storiesWithMeta(); track s.id) {
            <li class="surface-card surface-card-hover story-card">
              <a [routerLink]="['/stories', s.id]" class="story-card-link">
                <div class="story-name">{{ s.name }}</div>
                @if (s.description) {
                  <p class="story-desc">{{ s.description }}</p>
                }
                <div class="story-meta">
                  <span class="meta-item">
                    <span class="meta-label">Scenes</span>
                    <span class="meta-value">{{ s.sceneCount }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-label">Roles</span>
                    <span class="meta-value">{{ s.roleCount }}</span>
                  </span>
                  @if (s.estimatedMinutes) {
                    <span class="meta-item">
                      <span class="meta-label">Est. time</span>
                      <span class="meta-value">~{{ s.estimatedMinutes }} min</span>
                    </span>
                  }
                  @if (s.activeSessionName) {
                    <span class="meta-item active">
                      <span class="meta-label">Active run</span>
                      <span class="meta-value">{{ s.activeSessionName }}</span>
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
export class StoriesPage {
  protected readonly storySvc = inject(StoryService);
  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);

  readonly storiesWithMeta = computed(() => {
    const sessions = this.sessionSvc.sessions();
    return this.storySvc.stories().map(story => {
      const flat = this.storySvc.flatten(story);
      const roles = new Set(flat.map(f => f.scene.role));
      const active = sessions.find(s => s.story_id === story.id && !s.completed_at);
      return {
        id: story.id,
        name: story.name,
        description: story.description,
        sceneCount: flat.length,
        roleCount: roles.size,
        estimatedMinutes: story.estimated_total_minutes,
        activeSessionName: active?.name,
      };
    });
  });

  constructor() {
    void this.storySvc.load();
    void this.catalog.load();
  }
}
