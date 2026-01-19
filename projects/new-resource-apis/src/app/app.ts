import { Component, signal } from '@angular/core';
import {UserSearchComponent} from './user-search/user-search.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [UserSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
