import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoginComponent} from './authentication/login.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
