import { Component, OnInit } from "@angular/core";
import { MatCard } from "@angular/material/card";

@Component({
  standalone: true,
  imports: [MatCard],
  selector: "app-character-portrait",
  templateUrl: "./character-portrait.component.html",
  styleUrls: ["./character-portrait.component.scss"],
})
export class CharacterPortraitComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
