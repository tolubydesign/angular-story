import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent implements OnInit {

  @Input() optionSetOne: string;

  @Input() optionSetTwo: string;

  @Output() optionSetEmitted = new EventEmitter<string>();

  optionSet(value: string) {
    this.optionSetEmitted.emit(value);
  }

  constructor() { }

  ngOnInit() {
  }

}
