import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mini-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet, RouterLinkActive, HttpClientModule, MatButtonModule],
  templateUrl: './mini-navbar.component.html',
  styleUrl: './mini-navbar.component.scss'
})
export class MiniNavbarComponent {

}
