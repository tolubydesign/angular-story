import { Component, input, OnInit } from '@angular/core';
import { SummaryDisplayCardComponent } from '@components/ui/summary-display-card/summary-display-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { StoriesService } from '@core/services/stories.service';
import { Subscription } from 'rxjs';
import { Plot } from '@models/plot';

@Component({
    selector: 'app-continue-card-row',
    imports: [SummaryDisplayCardComponent, NgFor, CommonModule],
    templateUrl: './continue-card-row.component.html',
    styleUrl: './continue-card-row.component.scss'
})
export class ContinueCardRowComponent {
  // Declare an input named 'value' with a default value of zero.
  content = input<Plot[]>([]);

  constructor(
  ) { }
}
