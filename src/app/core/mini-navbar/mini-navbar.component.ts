import { CommonModule, NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-mini-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule, MatButtonModule, NgClass],
  templateUrl: './mini-navbar.component.html',
  styleUrl: './mini-navbar.component.scss',
})
export class MiniNavbarComponent implements OnInit {
  path: string | null = null;
  isLoggedIn: boolean = false;
  constructor(private router: Router, private userService: UserService) {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  ngOnInit() {
    this.path = this.router.url;
    console.log('path', this.path);
  }

  signOut() {
    console.log('sign out')
  }
}
