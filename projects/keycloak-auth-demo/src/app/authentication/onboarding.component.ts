import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

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
  constructor(private keycloakService: KeycloakService, private router: Router) {}

  async create(orgName: string) {
    console.log("Creating:", orgName);

    // 1. Logic to call your backend to save the org...

    // 2. IMPORTANT: Force a token refresh so the new claim appears
    await this.keycloakService.updateToken(-1);

    await this.router.navigate(['/dashboard']);
  }
}
