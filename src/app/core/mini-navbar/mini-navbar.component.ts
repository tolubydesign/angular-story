import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-mini-navbar',
  imports: [RouterLink, RouterModule, MatButtonModule],
  templateUrl: './mini-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    console.log('sign out');
  }
}
