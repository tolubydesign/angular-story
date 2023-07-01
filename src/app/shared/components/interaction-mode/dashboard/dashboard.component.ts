import { Component, OnInit } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { StoryService } from "@services/story/story.service";
import { MockStoryStructure } from "@models/mock-story-structure";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  narrativePosition: number | null = null;
  narrative: string | undefined;
  title: string | undefined;

  /* reader choices that can be picked */
  choices: any;
  decisions: any[] | null = null;
  summaries: any[] | null = null;

  getStorySubscription: Subscription | null = null;
  narrativeSubscription: Subscription | null = null;

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this.getStorySubscription?.unsubscribe();
    this.narrativeSubscription?.unsubscribe();
  }

  getStory(): void {
    this.getStorySubscription = this.storyService.getStory().subscribe(
      (story: MockStoryStructure[]) => {
        console.log("story", story);
      },
      (error: any) => {
        console.log("an error has occurred", error);
      },
      () => {
        this.setCurrentStoryPosition();
        this.setDialogue();
        this.updateStory();
      }
    );
  }

  loopingCount(total: number) {
    return new Array(total);
  }

  setCurrentStoryPosition() {
    this.narrativeSubscription =
      this.storyService.currentStoryPosition$.subscribe(
        (res: number) => {
          this.narrativePosition = res;
        },
        (error: Error) => {
          console.warn(error);
        }
      );
  }

  // updateDialogue(): void {
  //   this.updateStory();
  // }

  /* an action a reader has decide to pick */
  makeChoice(action: number): void {
    this.storyService.updateNarrative(action);
    // this.updateDialogue();
    this.updateStory();
    this.setDialogue();
  }

  /* set or update the current story options the reader can decide on picking */
  updateStory(): void {
    let narrative: MockStoryStructure[] | null =
      this.storyService.fullNarrative.getValue();
    if (this.narrativePosition && narrative) {
      // this.decisions = narrative[this.narrativePosition].options.decisions;
      // this.summaries = narrative[this.narrativePosition].options.summary;
    }

    this.assignReaderOptions(this.decisions, this.summaries);
  }

  setDialogue(): void {
    let narrative: MockStoryStructure[] | null =
      this.storyService.fullNarrative.getValue();
    if (this.narrativePosition && narrative) {
      this.narrative = narrative[this.narrativePosition].story;
      this.title = narrative[this.narrativePosition].title;
    }
  }

  assignReaderOptions(decisions: any, summary: any) {
    this.choices = [];
    decisions.forEach((decisionsValue: number, index: string) => {
      this.choices.push({ decision: decisionsValue, summary: summary[index] });
    });
  }
}
