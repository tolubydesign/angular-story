import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent implements OnInit {
  private _option = '';
  private _optionOne = '';
  // private _optionTwo = '';

  @Input()
  set optionOne(optionOne: string) {
    this._optionOne = optionOne || '';
  }
  get optionOne(): string { return this._optionOne; }

  // @Input()
  // set optionTwo(optionTwo: string) {
  //   this._optionTwo = optionTwo || '';
  // }
  // get optionTwo(): string { return this._optionTwo; }

  @Input()
  set option(option: string) {
    this._option = option || '';
  }
  get option(): string { return this._option; }

  onOption(a: any, b: any) {
    console.log('click event');
    console.log({a});
    console.log({b});
  }

  // @Input('optionOne') setOptionOne: string;
  // @Input('optionTwo') setOptionTwo: string;

  response = 'response';
  constructor() { }

  ngOnInit() {
  }

}
