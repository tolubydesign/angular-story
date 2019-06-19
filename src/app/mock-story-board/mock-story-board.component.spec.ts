import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStoryBoardComponent } from './mock-story-board.component';

describe('MockStoryBoardComponent', () => {
  let component: MockStoryBoardComponent;
  let fixture: ComponentFixture<MockStoryBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockStoryBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockStoryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
