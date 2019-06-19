import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStoryCharactersComponent } from './mock-story-characters.component';

describe('MockStoryCharactersComponent', () => {
  let component: MockStoryCharactersComponent;
  let fixture: ComponentFixture<MockStoryCharactersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockStoryCharactersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockStoryCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
