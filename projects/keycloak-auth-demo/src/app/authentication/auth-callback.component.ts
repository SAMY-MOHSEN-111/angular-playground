import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `
    <div class="p-10"><h1>Signing you in...</h1></div>`
})
export class AuthCallbackComponent implements OnInit {

  constructor(private keycloakService: KeycloakService, private router: Router) {
  }

  async ngOnInit() {
    const isLoggedIn = this.keycloakService.isLoggedIn();
    if (isLoggedIn) {
      const token = this.keycloakService.getKeycloakInstance().tokenParsed as any;
      const selectedOrg = token?.['selected_org'];
      let allOrgs = token?.['organization'] || []; // note it is organizations but it is organization for demo
      allOrgs = JSON.parse(allOrgs);
      console.log(allOrgs);
      console.log("access_token: ", token);
      if (allOrgs.length === 0) {
        await this.router.navigate(['/onboarding']);
      } else if (selectedOrg) {
        await this.router.navigate([`/workspace/${selectedOrg}`]);
      } else {
        await this.router.navigate(['/login']);
      }
    } else {
      await this.router.navigate(['/login']);
    }
  }
}
