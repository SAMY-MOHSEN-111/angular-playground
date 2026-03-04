import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  standalone: true,
  selector: 'app-onboarding',
  template: `
    <h2>Create your organization</h2>
    <input #name placeholder="Organization name"/>
    <button (click)="create(name.value)">Create</button>
  `
})
export class OnboardingComponent {
  readonly #router = inject(Router);
  readonly #keycloak = inject(Keycloak);

  async create(orgName: string) {
    console.log("Creating:", orgName);
     const refreshed = await this.#keycloak.updateToken();
     if(refreshed){
       console.log("Token was successfully refreshed");
       console.log("New Token: ", this.#keycloak.tokenParsed);
     } else {
       console.log("Token is still valid");
     }

    await this.#router.navigate(['/dashboard']);
  }
}
