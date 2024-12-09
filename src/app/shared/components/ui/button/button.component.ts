import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-button",
    templateUrl: "./button.component.html",
    styleUrls: ["./button.component.scss"],
    standalone: false
})
export class ButtonComponent implements OnInit {
  @Input() optionSetOne: string | undefined;

  @Input() optionSetTwo: string | undefined;

  @Output() optionSetEmitted = new EventEmitter<string>();

  optionSet(value: string) {
    this.optionSetEmitted.emit(value);
  }

  constructor() {}

  ngOnInit() {}
}
