import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DagreComponent } from "./dagre.component";

describe("DagreComponent", () => {
  let component: DagreComponent;
  let fixture: ComponentFixture<DagreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DagreComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DagreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
