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
  localDialogue: string;

  constructor(
    private storyService: StoryService
  ) { }

  ngOnInit() {
    this.storyService.currentStoryPosition = 0;
  }

  getStory() {
    this.storyService.componentData().pipe(
      map(res => res)
    ).subscribe(
      data => {
        console.log('--', { data });
      },
      error => {
        console.log(error);
      },
      () => console.log('got information')
    );
  }

  onShowDialogue() {
    this.getStory();
  }

}
