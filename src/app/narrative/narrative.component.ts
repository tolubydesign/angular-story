import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../services/story.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-narrative',
  templateUrl: './narrative.component.html',
  styleUrls: ['./narrative.component.scss']
})
export class NarrativeComponent implements OnInit {

  @Input() narrative: string;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }
}
