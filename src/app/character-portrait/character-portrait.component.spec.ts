import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPortraitComponent } from './character-portrait.component';

describe('CharacterPortraitComponent', () => {
  let component: CharacterPortraitComponent;
  let fixture: ComponentFixture<CharacterPortraitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterPortraitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
