import { CommonModule, NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mini-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule, MatButtonModule, NgClass],
  templateUrl: './mini-navbar.component.html',
  styleUrl: './mini-navbar.component.scss',
})
export class MiniNavbarComponent implements OnInit {
  path: string | null = null;
  constructor(private router: Router) {}

  ngOnInit() {
    this.path = this.router.url;
    console.log('path', this.path);
  }
}
