import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {routes} from './app.routes';
import {UiButtonComponent} from './components/button/button.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiButtonComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly routes = routes;
  readonly router = inject(Router);
}
