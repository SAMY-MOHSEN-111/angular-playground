import { Component } from '@angular/core';
import {UiButtonComponent} from './components/button/button.component';
import {UiLeadingIconComponent} from './components/icon/leading-icon.component';
import {UiTrailingIconComponent} from './components/icon/trailing-icon.component';


@Component({
  selector: 'app-root',
  imports: [UiButtonComponent, UiLeadingIconComponent, UiTrailingIconComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
}
