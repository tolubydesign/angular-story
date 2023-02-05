import { PlotService } from '@services/plot/plot.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plot, PlotContent } from '@models/plot';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-panel-instance',
  templateUrl: './panel-instance.component.html',
  styleUrls: ['./panel-instance.component.scss']
})
export class PanelInstanceComponent {

  // Form values
  // RESOURCE: https://angular.io/guide/forms-overview
  // contentIdControl = new FormControl<string | undefined>(undefined);

  // RESOURCE: https://angular.io/guide/reactive-forms
  form = new FormGroup({
    id: new FormControl<string | undefined>({ value: '', disabled: true }, Validators.required),
    name: new FormControl<string | undefined>(""),
    description: new FormControl<string | undefined>(""),

    // first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    // last: new FormControl('Drew', Validators.required)
  });

  // SUBSCRIBER.
  subscriber: Subscription | undefined = undefined;
  content: PlotContent | undefined = undefined;
  constructor(
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    // listen to behavior subject.
    this.subscriber = this.plotService.instanceEditSubject.subscribe((content: PlotContent | undefined) => {
      if (content) {
        this.content = content;
        console.log("content", content)
        this.loadFormContent()
      }
    })

    this.form.statusChanges.subscribe((value) => {
      console.log(value);
      return
    });
  }

  ngOnDestroy(): void {
    // UNSUBSCRIBE
    this.subscriber?.unsubscribe()
  }

  onSubmit(): void {
    console.log("form values", this.form.value, this.form.valid)
  }

  closePanel(): void {
    this.plotService.closeInstancePanel();
    this.content = undefined;
  }

  loadFormContent(): void {
    // this.contentIdControl.setValue(this.content?.id);
    const content = this.content

    this.form.setValue({
      description: content?.description ? content.description : "",
      id: content?.id ? content.id : "",
      name: content?.name ? content.name : ""
    })
  }
}
