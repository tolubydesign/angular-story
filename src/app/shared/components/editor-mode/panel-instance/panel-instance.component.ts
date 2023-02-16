import { PlotService } from '@services/plot/plot.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plot, PlotContent } from '@models/plot';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-panel-instance',
  templateUrl: './panel-instance.component.html',
  styleUrls: ['./panel-instance.component.scss']
})
export class PanelInstanceComponent {

  @Output() updateNodeContent: EventEmitter<any> = new EventEmitter();
  // @Output() newItemEvent = new EventEmitter<string>();

  // Form values
  // RESOURCE: https://angular.io/guide/forms-overview
  // contentIdControl = new FormControl<string | undefined>(undefined);

  // RESOURCE: https://angular.io/guide/reactive-forms
  form = new FormGroup({
    id: new FormControl<string | undefined>({ value: "", disabled: true }, Validators.required),
    name: new FormControl<string | undefined>("", Validators.required),
    description: new FormControl<string | undefined>("", Validators.required),
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
        this.loadFormContent(content)
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
    if (this.form && !this.form.valid) console.error("form not valid.");

    const mergedForm = {
      ...this.form.value,
      id: this.content?.id
    }
    this.updateNodeContent.emit(mergedForm);
    this.closePanel();
  }

  closePanel(): void {
    this.plotService.closeInstancePanel();
    this.content = undefined;
  }

  loadFormContent(content: PlotContent): void {
    // this.contentIdControl.setValue(this.content?.id);
    console.log("function call load form content", content)
    this.form.setValue({
      id: content?.id ? content.id : "",
      description: content?.description ? content.description : "",
      name: content?.name ? content.name : "",
    })
  }
}
