import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardHeader, MatCardModule } from '@angular/material/card';

// TODO: a better name for this component
// TODO: loading wait
@Component({
    selector: 'app-summary-display-card',
    imports: [MatButtonModule, MatCardModule, MatCardHeader],
    templateUrl: './summary-display-card.component.html',
    styleUrl: './summary-display-card.component.scss'
})
export class SummaryDisplayCardComponent {
  @Input({required: true}) imageUrl: string = '';
  @Input({required: true}) imageAlt: string = '';
  @Input({required: true}) title: string = '';
  @Input({required: true}) description: string = '';
  @Input({required: true}) content: string = '';
  @Input({required: true}) contentType: 'draft' | 'continuation' = 'continuation'

}
