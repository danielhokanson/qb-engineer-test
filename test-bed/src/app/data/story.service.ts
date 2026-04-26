import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Story, StoryScene } from './types';

/** A flat scene with its chapter context, useful for indexing. */
export interface FlatScene {
  story_id: string;
  /** 0-based index of this scene across the entire story. */
  index: number;
  chapter_index: number;
  chapter_title: string;
  chapter_intro?: string;
  scene: StoryScene;
  /** True if the role differs from the scene immediately before this one
   * (or this is the first scene of a new chapter). Used to surface the
   * logout/login handoff banner. */
  is_handoff: boolean;
}

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly http = inject(HttpClient);

  private readonly _stories = signal<Story[]>([]);
  private readonly _loaded = signal(false);

  readonly stories = this._stories.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    try {
      const data = await firstValueFrom(
        this.http.get<Story[]>('assets/data/stories.json'),
      );
      this._stories.set(data);
    } catch {
      // Stories file is optional; missing is not an error.
      this._stories.set([]);
    }
    this._loaded.set(true);
  }

  storyById(id: string): Story | undefined {
    return this._stories().find(s => s.id === id);
  }

  /** Flatten all scenes in a story into an indexed array, computing handoff
   * markers at chapter boundaries and role transitions. */
  flatten(story: Story): FlatScene[] {
    const out: FlatScene[] = [];
    let prevRole: string | undefined;
    let runningIndex = 0;
    story.chapters.forEach((chapter, ci) => {
      chapter.scenes.forEach((scene, si) => {
        const isFirstSceneOfChapter = si === 0;
        const roleChanged = scene.role !== prevRole;
        out.push({
          story_id: story.id,
          index: runningIndex,
          chapter_index: ci,
          chapter_title: chapter.title,
          chapter_intro: chapter.intro,
          scene,
          is_handoff: isFirstSceneOfChapter && roleChanged,
        });
        prevRole = scene.role;
        runningIndex++;
      });
    });
    return out;
  }
}
