import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-workspace',
  template: `
    <div class="flex items-center justify-center w-screen h-screen">
      <div class="flex flex-col items-center justify-center w-[36rem]">
        <h1 class="text-5xl pb-5">{{ workspace() }}</h1>
        <button (click)="router.navigate(['/login'])">login</button>
      </div>
    </div>`
})
export class WorkspaceComponent implements OnInit {
  readonly router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  workspace = signal("");

  ngOnInit(): void {
    this.#activatedRoute.paramMap.subscribe(params => {
      this.workspace.set(params.get("id") ?? '');
    });
  }
}
