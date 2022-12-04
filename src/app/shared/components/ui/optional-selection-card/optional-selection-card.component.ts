import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Plot } from '@models/plot';
import { falsy } from '@models/tree.model';

@Component({
  selector: 'app-optional-selection-card',
  templateUrl: './optional-selection-card.component.html',
  styleUrls: ['./optional-selection-card.component.scss']
})
export class OptionalSelectionCardComponent implements OnInit {

  @Input() listing: Plot[] = []; // decorate the property with @Input()
  @Input() primaryText: falsy | string = null; 
  @Input() secondaryText: falsy | string = null; 

  @Output() PrimaryClick = new EventEmitter<string>();
  @Output() SecondaryClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onPrimaryClick(item: Plot) {
    this.PrimaryClick.emit(item.id)
  }

  onSecondaryClick(item: Plot) {
    this.SecondaryClick.emit(item.id)
  }

}
