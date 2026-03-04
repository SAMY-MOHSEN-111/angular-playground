import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `
    <div class="p-10"><h1>Signing you in...</h1></div>`
})
export class AuthCallbackComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #keycloak = inject(Keycloak);

  async ngOnInit() {
    const isLoggedIn = this.#keycloak.authenticated;
    if (isLoggedIn) {
      console.log(this.#keycloak.token);
      const token = this.#keycloak.tokenParsed as any;
      const selectedOrg = token?.['selected_org'];
      console.log("access_token: ", token);
      let allOrgs = token?.['organizations'] || "[]";
      console.log(allOrgs);
      allOrgs = JSON.parse(allOrgs);
      console.log(allOrgs);
      if (allOrgs.length === 0) {
        await this.#router.navigate(['/onboarding']);
      } else if (selectedOrg) {
        await this.#router.navigate([`/workspace/${selectedOrg}`]);
      } else {
        await this.#router.navigate(['/login']);
      }
    } else {
      await this.#router.navigate(['/login']);
    }
  }
}
