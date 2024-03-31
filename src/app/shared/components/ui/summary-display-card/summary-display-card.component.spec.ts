import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDisplayCardComponent } from './summary-display-card.component';

describe('SummaryDisplayCardComponent', () => {
  let component: SummaryDisplayCardComponent;
  let fixture: ComponentFixture<SummaryDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryDisplayCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
