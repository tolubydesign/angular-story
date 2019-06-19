import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStoryDashboardComponent } from './mock-story-dashboard.component';

describe('MockStoryDashboardComponent', () => {
  let component: MockStoryDashboardComponent;
  let fixture: ComponentFixture<MockStoryDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockStoryDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockStoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
