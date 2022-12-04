import { Component, OnInit, Input } from "@angular/core";
import { map } from "rxjs/operators";

@Component({
  selector: "app-narrative",
  templateUrl: "./narrative.component.html",
  styleUrls: ["./narrative.component.scss"],
})
export class NarrativeComponent implements OnInit {
  @Input() narrative: string | undefined;
  @Input() title: string | undefined;

  constructor() {}

  ngOnInit() {}
}
