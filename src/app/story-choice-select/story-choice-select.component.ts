import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../services/story.service';

@Component({
  selector: 'app-story-choice-select',
  templateUrl: './story-choice-select.component.html',
  styleUrls: ['./story-choice-select.component.scss']
})
export class StoryChoiceSelectComponent implements OnInit {

  @Input() choice: string;

  constructor() { }

  ngOnInit() {
  }

}
