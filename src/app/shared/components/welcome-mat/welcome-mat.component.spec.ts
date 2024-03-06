import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMatComponent } from './welcome-mat.component';

describe('WelcomeMatComponent', () => {
  let component: WelcomeMatComponent;
  let fixture: ComponentFixture<WelcomeMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeMatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WelcomeMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
