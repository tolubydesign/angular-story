import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
    selector: 'app-home',
    imports: [RouterLink, MatButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) {
    this.isLoggedIn = this.userService.isLoggedIn();
  }
}
