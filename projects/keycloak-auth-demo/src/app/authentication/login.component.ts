import {Component} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="w-[36rem] flex flex-col gap-5">
        <button (click)="login()">Login</button>
        <button (click)="register()">Register</button>
      </div>
    </div>
  `
})
export class LoginComponent {
  constructor(private keycloakService: KeycloakService) {
  }

  login() {
    this.keycloakService.login({
      redirectUri: window.location.origin + '/auth/callback',
      scope: 'openid profile email'
    }).then();
  }

  register() {
    this.keycloakService.register({
      redirectUri: window.location.origin + '/auth/callback',
      scope: 'openid profile email'
    }).then();
  }
}
