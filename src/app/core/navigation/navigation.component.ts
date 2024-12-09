import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { removeUserSessionStorageCredentials } from "@shared/helpers/session.storage";

@Component({
    selector: 'app-navigation',
    imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, MatButtonModule, MatMenuModule],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  navigationLinkClassName = 'block cursor-pointer mb-2 rounded-full hover:bg-[#fff] z-10';

  constructor(
    private router: Router,
  ) { }

  redirect(path: string) {
    this.router.navigate([path])
  }

  logout() {
    removeUserSessionStorageCredentials();
    this.router.navigate(['/'])
  }
}
