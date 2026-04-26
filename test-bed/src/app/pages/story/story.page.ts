import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../data/catalog.service';
import { StoryService, FlatScene } from '../../data/story.service';
import { SessionService } from '../../data/session.service';
import { CaseStatus, Session } from '../../data/types';

@Component({
  selector: 'app-story',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './story.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <a routerLink="/stories">Stories</a>
        <span class="sep">/</span>
        <span class="current">{{ story()?.name ?? '…' }}</span>
      </nav>

      @if (story(); as st) {
        <header class="head">
          <span class="label-mono">story</span>
          <h1 class="title">{{ st.name }}</h1>
          @if (st.description) {
            <p class="sub">{{ st.description }}</p>
          }
          <div class="actions">
            @if (activeSession(); as sess) {
              <a [routerLink]="['/stories', st.id, 'scene', firstUnfinishedIndex()]" class="btn-primary">
                Resume {{ sess.name }}
                <span aria-hidden="true">→</span>
              </a>
              <button type="button" class="btn-secondary" (click)="startFresh()">
                Start a fresh run of this story
              </button>
            } @else {
              <a [routerLink]="['/stories', st.id, 'scene', 0]" class="btn-primary">
                Start at scene 1
                <span aria-hidden="true">→</span>
              </a>
            }
          </div>
        </header>

        @for (chapter of st.chapters; track $index; let ci = $index) {
          <section class="chapter">
            <div class="chapter-head">
              <span class="chapter-num">Chapter {{ ci + 1 }}</span>
              <h2 class="chapter-title">{{ chapter.title }}</h2>
            </div>
            @if (chapter.intro) {
              <p class="chapter-intro">{{ chapter.intro }}</p>
            }
            <ul class="scene-list">
              @for (scene of chapter.scenes; track $index; let si = $index) {
                <li class="surface-card surface-card-hover scene-card">
                  <a
                    [routerLink]="['/stories', st.id, 'scene', sceneIndexFor(ci, si)]"
                    class="scene-link">
                    <div class="scene-num">{{ sceneIndexFor(ci, si) + 1 }}</div>
                    <div class="scene-body">
                      <div class="scene-meta-row">
                        <span class="scene-case-id">{{ scene.case }}</span>
                        <span class="scene-role-pill">{{ scene.role }}</span>
                        <span class="case-status status-{{ statusFor(scene.case) }}">
                          {{ statusLabel(statusFor(scene.case)) }}
                        </span>
                      </div>
                      <div class="scene-title">{{ caseTitle(scene.case) }}</div>
                      @if (scene.note) {
                        <div class="scene-note">{{ scene.note }}</div>
                      }
                    </div>
                  </a>
                </li>
              }
            </ul>
          </section>
        }
      } @else if (storySvc.loaded()) {
        <div class="surface-card empty-state">
          Story not found.
        </div>
      } @else {
        <div class="loading">Loading story…</div>
      }
    </main>
  `,
})
export class StoryPage {
  readonly storyId = input.required<string>();

  protected readonly storySvc = inject(StoryService);
  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);

  readonly story = computed(() => this.storySvc.storyById(this.storyId()));

  /** Most-recent in-progress session for this story, if any. */
  readonly activeSession = computed<Session | undefined>(() => {
    const sid = this.storyId();
    return this.sessionSvc.sessions().find(
      s => s.story_id === sid && !s.completed_at,
    );
  });

  /** Cumulative scene index for a given (chapter, scene) position. */
  sceneIndexFor(ci: number, si: number): number {
    const st = this.story();
    if (!st) return 0;
    let n = 0;
    for (let c = 0; c < ci; c++) n += st.chapters[c].scenes.length;
    return n + si;
  }

  caseTitle(caseId: string): string {
    return this.catalog.caseById(caseId)?.title ?? caseId;
  }

  statusFor(caseId: string): CaseStatus {
    const sess = this.activeSession();
    if (!sess) return 'pending';
    const r = this.sessionSvc.allResults().find(
      x => x.session_id === sess.id && x.case_id === caseId,
    );
    return r?.status ?? 'pending';
  }

  statusLabel(s: CaseStatus): string {
    switch (s) {
      case 'pass': return 'Passed';
      case 'fail': return 'Failed';
      case 'blocked': return 'Blocked';
      default: return 'Not started';
    }
  }

  /** Index of the first scene whose case has no recorded result. */
  firstUnfinishedIndex(): number {
    const st = this.story();
    if (!st) return 0;
    const flat = this.storySvc.flatten(st);
    const sess = this.activeSession();
    if (!sess) return 0;
    const recorded = new Set(
      this.sessionSvc.allResults()
        .filter(r => r.session_id === sess.id)
        .map(r => r.case_id),
    );
    const idx = flat.findIndex(f => !recorded.has(f.scene.case));
    return idx === -1 ? 0 : idx;
  }

  async startFresh(): Promise<void> {
    const ok = confirm(
      'Start a fresh run of this story? Your current run is preserved but will fall out of "active" status.',
    );
    if (!ok) return;
    const st = this.story();
    if (!st) return;
    const session = await this.sessionSvc.createSession({
      name: `${st.name} — ${new Date().toLocaleDateString()}`,
      fixtureId: this.catalog.fixtures()[0]?.id ?? 'cascade-components-mid',
      selectedRoles: [],
      selectedFlows: [],
      storyId: st.id,
    });
    await this.router.navigate(['/stories', st.id, 'scene', 0]);
  }

  constructor() {
    void this.storySvc.load();
    void this.catalog.load();
  }
}
