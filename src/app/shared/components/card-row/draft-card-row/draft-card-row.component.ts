
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SummaryDisplayCardComponent } from '@components/ui/summary-display-card/summary-display-card.component';
import { Plot } from '@models/plot';

@Component({
  selector: 'app-draft-card-row',
  imports: [SummaryDisplayCardComponent, MatButtonModule],
  templateUrl: './draft-card-row.component.html',
  styleUrl: './draft-card-row.component.scss',
})
export class DraftCardRowComponent {
  content = input<Plot[]>([]);
  constructor() {}

  loadMore() {
    console.log('loading more...');
  }
}
