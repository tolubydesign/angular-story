import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  imports: [MatCard],
  selector: 'app-character-portrait',
  templateUrl: './character-portrait.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./character-portrait.component.scss'],
})
export class CharacterPortraitComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
