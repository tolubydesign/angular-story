import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { falsy } from '@models/tree.model';
import { URLParameters } from '@helpers/parameter';
import StoryEditor from '@lib/story-editor';
import { Plot } from '@models/plot';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})

export class EditingComponent {

  parameterId: string | falsy;
  parameters = new URLParameters(this.activatedRoute);
  builder: StoryEditor | undefined = undefined;
  board: Plot | {} = {};

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getParameters();
    this.initialization();

  }

  async initialization(): Promise<StoryEditor | Error | null | undefined> {
    await this.parameters.getParametersID()
    this.parameterId = this.parameters.parameterId;

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
