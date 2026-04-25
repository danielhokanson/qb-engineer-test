import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PracticeAppComponent } from '../../shared/practice-app/practice-app.component';

/**
 * Standalone Practice App page. Tutorial cases link here with target="_blank"
 * so the tester opens it in a separate tab — mirroring the real testing flow
 * where they'd have the application under test open in another tab.
 */
@Component({
  selector: 'app-practice-page',
  imports: [PracticeAppComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './practice.page.css',
  template: `
    <main class="page">
      <header class="head">
        <span class="label-mono">tutorial · practice app</span>
        <h1 class="title">Practice App</h1>
        <p class="sub">
          A small, self-contained interface for tutorial cases. Nothing you do
          here affects anything outside this tab. Switch back to the test
          runner tab when you're done with each step to record your result.
        </p>
      </header>

      <app-practice-app />
    </main>
  `,
})
export class PracticePage {}
