import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../services/story.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mock-story-board',
  templateUrl: './mock-story-board.component.html',
  styleUrls: ['./mock-story-board.component.scss']
})
export class MockStoryBoardComponent implements OnInit {

  @Input() narrative: string;
  localDialogue: string;

  constructor(
    private storyService: StoryService
  ) { }

  ngOnInit() {
    this.storyService.currentStoryPosition = 0;
  }

  getStory() {
    this.storyService.getLocalJsonStory().pipe(
      map( res => res )
    ).subscribe(
      data => {
        console.log({data});
      },
      error => {
        console.log(error);
      },
      () => console.log('got information')
    );
    // this.storyService.getLocalDialogue()
    // .pipe(
    //   map(res => res)
    // )
    // .subscribe(
    //   data => {
    //     console.log(data[0].story);
    //     data.forEach(value =>
    //       this.localDialogue = value.story,
    //     );
    //   },
    //   error => console.log(error),
    //   () => console.log('story lines collected'));
  }

  onShowDialogue() {
    this.getStory();
  }
}
