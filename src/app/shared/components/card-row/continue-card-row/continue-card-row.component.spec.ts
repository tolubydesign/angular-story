import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueCardRowComponent } from './continue-card-row.component';

describe('ContinueCardRowComponent', () => {
  let component: ContinueCardRowComponent;
  let fixture: ComponentFixture<ContinueCardRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinueCardRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContinueCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
