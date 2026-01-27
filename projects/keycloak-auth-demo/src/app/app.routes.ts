import {Routes} from '@angular/router';
import {AuthCallbackComponent} from './authentication/auth-callback.component';
import {OnboardingComponent} from './authentication/onboarding.component';
import {LoginComponent} from './authentication/login.component';
import {WorkspaceComponent} from './authentication/workspace.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'onboarding',
    component: OnboardingComponent
  },
  {
    path: 'workspace/:id',
    component: WorkspaceComponent,
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  }
];
