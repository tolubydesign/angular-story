import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftCardRowComponent } from './draft-card-row.component';

describe('DraftCardRowComponent', () => {
  let component: DraftCardRowComponent;
  let fixture: ComponentFixture<DraftCardRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftCardRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DraftCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
