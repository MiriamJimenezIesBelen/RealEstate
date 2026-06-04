import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img
            class="brand-logo"
            src="/assets/logo.jfif"
            alt="logo">
        </header>
      </a>

      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css']
})
export class AppComponent {}
