import {APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {KeycloakService} from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'myrealm',
        clientId: 'angular'
      },
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
