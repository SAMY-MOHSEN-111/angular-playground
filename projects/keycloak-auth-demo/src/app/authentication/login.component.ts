import {Component, inject} from '@angular/core';
import Keycloak from 'keycloak-js';

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
  readonly #keycloakService = inject(Keycloak);
  async login() {
    await this.#keycloakService.login({
      prompt: 'login',
      redirectUri: window.location.origin + '/auth/callback',
      scope: 'openid profile email'
    })
  }

  async register() {
    await this.#keycloakService.register({
      redirectUri: window.location.origin + '/auth/callback',
      scope: 'openid profile email'
    })
  }
}
