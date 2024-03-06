import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalSelectionCardComponent } from './optional-selection-card.component';

describe('OptionalSelectionCardComponent', () => {
  let component: OptionalSelectionCardComponent;
  let fixture: ComponentFixture<OptionalSelectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OptionalSelectionCardComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalSelectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
