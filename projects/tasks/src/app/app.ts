import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; // Import RouterLink and RouterOutlet
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true, // Add standalone: true
  imports: [RouterOutlet, RouterLink], // Add RouterOutlet and RouterLink here
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  themeService = inject(ThemeService);
}
