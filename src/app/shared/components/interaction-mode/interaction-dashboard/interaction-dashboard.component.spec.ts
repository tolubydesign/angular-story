import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDashboardComponent } from './interaction-dashboard.component';

describe('InteractionDashboardComponent', () => {
  let component: InteractionDashboardComponent;
  let fixture: ComponentFixture<InteractionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InteractionDashboardComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
