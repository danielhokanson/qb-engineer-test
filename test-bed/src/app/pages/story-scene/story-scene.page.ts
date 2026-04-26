import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../data/catalog.service';
import { StoryService, FlatScene } from '../../data/story.service';
import { SessionService } from '../../data/session.service';
import { Case, CaseStatus, Session } from '../../data/types';

@Component({
  selector: 'app-story-scene',
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../case/case.page.css', './story-scene.page.css'],
  template: `
    <main class="page">
      @if (story(); as st) {
        <nav class="breadcrumbs">
          <a routerLink="/">Home</a>
          <span class="sep">/</span>
          <a routerLink="/stories">Stories</a>
          <span class="sep">/</span>
          <a [routerLink]="['/stories', st.id]">{{ st.name }}</a>
          <span class="sep">/</span>
          <span class="current">Scene {{ sceneIndex() + 1 }}</span>
        </nav>
      }

      @if (currentFlatScene(); as fs) {
        <header class="story-context">
          <div class="story-context-row">
            <span class="label-mono">{{ story()?.name }}</span>
            <span class="scene-progress">
              Scene {{ fs.index + 1 }} of {{ totalScenes() }}
              · Chapter {{ fs.chapter_index + 1 }} ({{ fs.chapter_title }})
            </span>
          </div>
          @if (fs.is_handoff || fs.index === 0) {
            <aside class="handoff-banner">
              <span class="label-mono">role handoff</span>
              <p class="handoff-text">
                Sign in (or stay signed in) as
                <strong>{{ fs.scene.role }}</strong> for this scene.
                @if (fs.chapter_intro) {
                  <br />{{ fs.chapter_intro }}
                }
              </p>
            </aside>
          }
        </header>
      }

      @if (caseDef(); as c) {
        <header class="head">
          <div class="head-top">
            <span class="case-id">{{ c.id }}</span>
            <span class="role-pill">{{ currentFlatScene()?.scene?.role }}</span>
            @if (existingStatus(); as st) {
              <span class="case-status status-{{ st }}">
                {{ statusLabel(st) }}
              </span>
            }
          </div>
          <h1 class="title">{{ c.title }}</h1>
          <p class="goal">{{ c.goal }}</p>
        </header>

        <section class="block">
          <div class="block-head">
            <span class="label-mono">preconditions</span>
            <span class="block-sub">Before you start, confirm these are true.</span>
          </div>
          <ul class="precondition-list">
            @for (p of c.preconditions; track p) {
              <li>{{ p }}</li>
            }
          </ul>
        </section>

        <section class="block">
          <div class="block-head">
            <span class="label-mono">steps</span>
            <span class="block-sub">Do the action, then check the expected result.</span>
          </div>
          <ol class="step-list">
            @for (step of c.steps; track step.n) {
              <li class="step">
                <div class="step-number">{{ step.n }}</div>
                <div class="step-body">
                  <div class="step-action">
                    <div class="step-eyebrow">Action</div>
                    <div class="step-text">{{ step.action }}</div>
                  </div>
                  <div class="step-expected">
                    <div class="step-eyebrow">Expected</div>
                    <div class="step-text">{{ step.expected }}</div>
                  </div>
                  @if (step.notes) {
                    <div class="step-notes">{{ step.notes }}</div>
                  }
                </div>
              </li>
            }
          </ol>
        </section>

        <section class="block summary-block">
          <div class="summary-row">
            <div class="summary-col">
              <div class="step-eyebrow">Expected overall</div>
              <div class="summary-text">{{ c.expected_overall }}</div>
            </div>
            <div class="summary-col">
              <div class="step-eyebrow">Pass criteria</div>
              <div class="summary-text accent">{{ c.pass_criteria }}</div>
            </div>
          </div>
        </section>

        <section class="block result-block">
          <div class="block-head">
            <span class="label-mono">record your result</span>
          </div>
          <div class="result-row">
            <button type="button" class="result-btn pass"
              [class.active]="resultChoice() === 'pass'"
              (click)="resultChoice.set('pass')">Passed</button>
            <button type="button" class="result-btn fail"
              [class.active]="resultChoice() === 'fail'"
              (click)="resultChoice.set('fail')">Failed</button>
            <button type="button" class="result-btn blocked"
              [class.active]="resultChoice() === 'blocked'"
              (click)="resultChoice.set('blocked')">Blocked</button>
          </div>
          @if (resultChoice() === 'fail' || resultChoice() === 'blocked') {
            <div class="note-row">
              <label class="note-label" for="result-note">
                What happened? Be specific.
              </label>
              <textarea id="result-note" class="input-field note-input" rows="4"
                [formControl]="noteControl"
                placeholder="e.g. After clicking Save, the page showed a blank white screen for 30 seconds."></textarea>
            </div>
          }
          <div class="story-nav">
            <a [routerLink]="['/stories', storyId()]" class="btn-secondary">
              Back to story overview
            </a>
            <div class="story-nav-right">
              @if (sceneIndex() > 0) {
                <a [routerLink]="['/stories', storyId(), 'scene', sceneIndex() - 1]"
                   class="btn-ghost">
                  ← Previous
                </a>
              }
              <button type="button" class="btn-primary"
                [disabled]="!canSubmit()"
                (click)="submit()">
                Record &amp; continue
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      } @else {
        <div class="loading">Loading scene…</div>
      }
    </main>
  `,
})
export class StoryScenePage {
  readonly storyId = input.required<string>();
  readonly sceneIndex = input.required<number, string>({
    transform: v => Number(v),
  });

  protected readonly storySvc = inject(StoryService);
  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);

  readonly resultChoice = signal<CaseStatus | null>(null);
  readonly noteControl = new FormControl<string>('', { nonNullable: true });

  private readonly noteValue = toSignal(this.noteControl.valueChanges, {
    initialValue: this.noteControl.value,
  });

  readonly story = computed(() => this.storySvc.storyById(this.storyId()));

  readonly flatScenes = computed(() => {
    const st = this.story();
    return st ? this.storySvc.flatten(st) : [];
  });

  readonly totalScenes = computed(() => this.flatScenes().length);

  readonly currentFlatScene = computed<FlatScene | undefined>(() => {
    return this.flatScenes()[this.sceneIndex()];
  });

  readonly caseDef = computed<Case | undefined>(() => {
    const fs = this.currentFlatScene();
    if (!fs) return undefined;
    return this.catalog.caseById(fs.scene.case);
  });

  readonly activeSession = computed<Session | undefined>(() => {
    const sid = this.storyId();
    return this.sessionSvc.sessions().find(
      s => s.story_id === sid && !s.completed_at,
    );
  });

  readonly existingStatus = computed<CaseStatus | null>(() => {
    const sess = this.activeSession();
    const fs = this.currentFlatScene();
    if (!sess || !fs) return null;
    const r = this.sessionSvc.allResults().find(
      x => x.session_id === sess.id && x.case_id === fs.scene.case,
    );
    return r?.status ?? null;
  });

  readonly canSubmit = computed(() => {
    const choice = this.resultChoice();
    if (!choice) return false;
    if (choice === 'pass') return true;
    return (this.noteValue() ?? '').trim().length > 0;
  });

  constructor() {
    void this.storySvc.load();
    void this.catalog.load();

    // When the route changes, prefill the note from any existing result.
    effect(() => {
      const existing = this.existingStatus();
      this.resultChoice.set(null);
      this.noteControl.setValue('');
      // No-op subscription; the note prefill is intentionally skipped here
      // — the tester re-confirms each scene rather than seeing prior notes
      // baked in.
      void existing;
    });
  }

  statusLabel(s: CaseStatus): string {
    switch (s) {
      case 'pass': return 'Previously passed';
      case 'fail': return 'Previously failed';
      case 'blocked': return 'Previously blocked';
      default: return 'Not started';
    }
  }

  /** Lazily create the story session on first result, then record. */
  async submit(): Promise<void> {
    const choice = this.resultChoice();
    const fs = this.currentFlatScene();
    const st = this.story();
    if (!choice || !fs || !st || !this.canSubmit()) return;

    let session = this.activeSession();
    if (!session) {
      session = await this.sessionSvc.createSession({
        name: `${st.name} — ${new Date().toLocaleDateString()}`,
        fixtureId:
          this.catalog.fixtures()[0]?.id ?? 'cascade-components-mid',
        selectedRoles: [],
        selectedFlows: [],
        storyId: st.id,
      });
    }

    const note = choice === 'pass' ? undefined : this.noteControl.value.trim();
    await this.sessionSvc.recordResult({
      sessionId: session.id,
      caseId: fs.scene.case,
      status: choice,
      failureNote: note,
    });

    // Advance to next scene if any, otherwise back to overview.
    const next = this.sceneIndex() + 1;
    if (next < this.totalScenes()) {
      await this.router.navigate(['/stories', this.storyId(), 'scene', next]);
    } else {
      await this.router.navigate(['/stories', this.storyId()]);
    }
  }
}
