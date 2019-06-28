import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../services/story.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mock-story-board',
  templateUrl: './mock-story-board.component.html',
  styleUrls: ['./mock-story-board.component.scss']
})
export class MockStoryBoardComponent implements OnInit {

  @Input() dialogue: string;
  localDialogue: string;

  constructor(
    private storyService: StoryService
  ) { }

  ngOnInit() {
    this.storyService.currentStoryPosition = 1;
  }

  getStory() {
    this.storyService.getLocalDialogue()
    .pipe(
      map(res => res)
    )
    .subscribe(
      data => {
        console.log(data[0].story);
        data.forEach(value =>
          this.localDialogue = value.story,
          // console.log('local dialogue', this.localDialogue)
        );
      },
      error => console.log(error),
      () => console.log('story lines collected'));
  }

  onShowDialogue() {
    this.getStory();
  }
}
