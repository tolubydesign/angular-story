import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryChoiceSelectComponent } from './story-choice-select.component';

describe('StoryChoiceSelectComponent', () => {
  let component: StoryChoiceSelectComponent;
  let fixture: ComponentFixture<StoryChoiceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryChoiceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryChoiceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
