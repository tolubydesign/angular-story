import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelInstanceComponent } from './panel-instance.component';

describe('PanelInstanceComponent', () => {
  let component: PanelInstanceComponent;
  let fixture: ComponentFixture<PanelInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
