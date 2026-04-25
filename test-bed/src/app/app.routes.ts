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
  { path: '**', redirectTo: '' },
];
