import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-summary-display-card',
    imports: [MatButtonModule, MatCardModule],
    templateUrl: './summary-display-card.component.html',
    styleUrl: './summary-display-card.component.scss'
})
export class SummaryDisplayCardComponent {
  // @Input({required: true}) imageUrl: string = '';
  // @Input({required: true}) imageAlt: string = '';
  @Input({required: true}) title: string = '';
  @Input({required: true}) description: string = '';
  // @Input({required: true}) content: string = '';
  // published = input()
  @Input({required: true}) contentType: 'draft' | 'continuation' = 'continuation'

  edit() {
    console.log('edit clicked')
  }

  delete() {
    console.log('delete clicked')
  }
}
