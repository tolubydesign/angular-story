import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { falsy } from '@models/tree.model';
import { URLParameters } from '@helpers/parameter';
import StoryEditor from '@lib/story-editor';
import { Plot } from '@models/plot';
import { Falsy, Subscription } from 'rxjs';
import { PlotService } from '@services/plot/plot.service';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})

export class EditingComponent implements OnInit, OnDestroy {

  parameterId: string | falsy;
  parameters = new URLParameters(this.activatedRoute);
  builder: StoryEditor | undefined = undefined;
  board: Plot | {} = {};
  plot: Plot | undefined = undefined;
  hierarchySubscriber: Subscription | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private plotService: PlotService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getParameters();
    this.initialization();
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this.hierarchySubscriber?.unsubscribe()
  }

  async initialization(): Promise<StoryEditor | Error | null | undefined> {
    await this.parameters.getParametersID()
    this.parameterId = this.parameters.parameterId;

    this.hierarchySubscriber = this.plotService.storyBehaviorSubject.subscribe((plot: Plot | Falsy) => {
      if (plot && plot.content) this.plot = plot;
    });

    if (this.parameterId) {
      this.builder = new StoryEditor(this.parameterId);
      // TODO: find better location for function.
      this.updateGraph();
      return
    }

    return new Error("Parameter id could not be captured.");
  }

  /**
   * @description Get id from url. Page route
   * @return {Promise<void>}
   */
  async getParameters(): Promise<void> {

  }

  updateGraph() {
    if (this.builder && this.builder.board) {
      console.log("updateGraph", this.builder.board);
      return this.board = this.builder.board;
    }

    return new Error(`Story Editor data isn't available.`)
  }
}
