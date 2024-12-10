import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { WelcomeMatComponent } from '@components/welcome-mat/welcome-mat.component';
import { ContinueCardRowComponent } from '@components/card-row/continue-card-row/continue-card-row.component';
import { DraftCardRowComponent } from '@components/card-row/draft-card-row/draft-card-row.component';

@Component({
    selector: 'app-main',
    imports: [
        MatCardModule,
        CommonModule,
        RouterModule,
        WelcomeMatComponent,
        ContinueCardRowComponent,
        DraftCardRowComponent,
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {}
