import {afterRenderEffect, Component, inject, signal} from '@angular/core';
import {environment} from '../../environments/environments';
import {User} from './model';
import {MatProgressBar} from '@angular/material/progress-bar';
import {HttpClient} from '@angular/common/http';
import {z as zod} from 'zod';
import {smartHttpResource} from '../utils/smart-http-resource';

const USERS_URL = environment.usersURL;

const UsersSchema = zod.array(
  zod.object({
    id: zod.number(),
    name: zod.string(),
  })
)

@Component({
  imports: [MatProgressBar],
  standalone: true,
  selector: 'app-user-search',
  template: `
    <fieldset>
      <legend>Users Search</legend>
      <input (input)="query.set($any($event.target).value)" type="search" placeholder="Search...">
    </fieldset>
    @if (users.isLoading()) {
      <mat-progress-bar mode="query"/>
    }
    @if (users.error()) {
      <div class="error">{{ users.error() }}</div>
    }
    <section class="actions">
      <button (click)="users.reload()">Reload</button>
      <button (click)="addUser()">Add User</button>
      <button (click)="users.set([])">Clear</button>
    </section>
    <ul>
      @for (user of users.value(); track user.id) {
        <li>{{ user.name }}</li>
      } @empty {
        <li class="no-data">Nothing to show</li>
      }
    </ul>
  `,
})
export class UserSearchComponent {
  query = signal("");
  readonly #httpClient = inject(HttpClient);

  isLoadingEffect = afterRenderEffect({
    read: () => this.users.isLoading(),
    write: () => {
      console.log(this.users.isLoading());
    }
  })

  users = smartHttpResource<User[], { searchTerm: string }>({
    params: () => ({searchTerm: this.query()}),
    loader: ({searchTerm}) => this.#httpClient.get<User[]>(`${USERS_URL}?name_like=${searchTerm}`),
    retryOptions: {maxRetry: 3, delayMs: 5000}
  });


  addUser() {
    const id = Math.floor(Math.random() * 10000);
    const user: User = {id, name: `User ${id}`};
    this.users.update((users) => users ? [user, ...users] : [user]);
  }
}

