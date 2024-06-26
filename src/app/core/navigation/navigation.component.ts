import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule],
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
}
