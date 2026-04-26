import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.page').then(m => m.LandingPage),
  },
  {
    path: 'run/new',
    loadComponent: () =>
      import('./pages/new-run/new-run.page').then(m => m.NewRunPage),
  },
  {
    path: 'run/:sessionId',
    loadComponent: () =>
      import('./pages/run/run.page').then(m => m.RunPage),
  },
  {
    path: 'run/:sessionId/case/:caseId',
    loadComponent: () =>
      import('./pages/case/case.page').then(m => m.CasePage),
  },
  {
    path: 'practice',
    loadComponent: () =>
      import('./pages/practice/practice.page').then(m => m.PracticePage),
  },
  {
    path: 'tutorial',
    loadComponent: () =>
      import('./pages/tutorial/tutorial.page').then(m => m.TutorialPage),
  },
  {
    path: 'tutorial/case/:caseId',
    loadComponent: () =>
      import('./pages/tutorial-case/tutorial-case.page').then(
        m => m.TutorialCasePage,
      ),
  },
  {
    path: 'stories',
    loadComponent: () =>
      import('./pages/stories/stories.page').then(m => m.StoriesPage),
  },
  {
    path: 'stories/:storyId',
    loadComponent: () =>
      import('./pages/story/story.page').then(m => m.StoryPage),
  },
  {
    path: 'stories/:storyId/scene/:sceneIndex',
    loadComponent: () =>
      import('./pages/story-scene/story-scene.page').then(
        m => m.StoryScenePage,
      ),
  },
  { path: '**', redirectTo: '' },
];
