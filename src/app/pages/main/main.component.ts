import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { WelcomeMatComponent } from '@components/welcome-mat/welcome-mat.component';
import { ContinueCardRowComponent } from '@components/card-row/continue-card-row/continue-card-row.component';
import { DraftCardRowComponent } from '@components/card-row/draft-card-row/draft-card-row.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule, WelcomeMatComponent, ContinueCardRowComponent, DraftCardRowComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
