import { PlotService } from '@services/plot/plot.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plot, PlotContent } from '@models/plot';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-node-form',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.scss']
})
export class NodeFormComponent {

  @Output() updateNodeContent: EventEmitter<any> = new EventEmitter();
  @Output() addNodeContent: EventEmitter<any> = new EventEmitter();

  /**
   * Form values
   * @see {@link https://angular.io/guide/reactive-forms}
   * @see {@link https://angular.io/guide/forms-overview}
   * @example contentIdControl = new FormControl<string | undefined>(undefined);
   */
  form = new FormGroup({
    id: new FormControl<string | undefined>({ value: "", disabled: true }, Validators.required),
    name: new FormControl<string | undefined>("", Validators.required),
    description: new FormControl<string | undefined>("", Validators.required),
  });

  // SUBSCRIBER.
  subscriber: Subscription | undefined = undefined;
  instanceContent: PlotContent | undefined = undefined;
  // instanceType: PlotInstanceType | undefined = undefined;
  instanceParentId: string | undefined = undefined

  constructor(
    private plotService: PlotService,
  ) { }

  ngOnInit(): void {
    // listen to behavior subject.
    this.subscriber = this.plotService.$instanceEditSubject
      .subscribe((content: { instance: PlotContent, parentInstanceId?: string } | undefined) => {
        if (content?.instance) {
          this.instanceContent = content.instance;
          // this.instanceType = content.type
          this.instanceParentId = content.parentInstanceId;
          this.loadFormContent(content.instance);

        }
      })

    this.form.statusChanges.subscribe((value) => {
      // console.log('[panel instance comp] form status changes subscriber', value);
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
      id: this.instanceContent?.id
    }

    console.log('function call on submit', this.form, this.instanceParentId);

    if (this.instanceParentId) {
      this.addNodeContent.emit({ form: mergedForm, parentNodeId: this.instanceParentId })
    } else {
      this.updateNodeContent.emit({ form: mergedForm });
    }

    this.closePanel();
  }

  closePanel(): void {
    this.plotService.closeInstancePanel();
    this.instanceContent = undefined;
  }

  loadFormContent(content: PlotContent): void {
    // this.contentIdControl.setValue(this.content?.id);
    // console.log("function call load form content", content)
    this.form.setValue({
      id: content?.id ? content.id : "",
      description: content?.description ? content.description : "",
      name: content?.name ? content.name : "",
    })
  }
}
