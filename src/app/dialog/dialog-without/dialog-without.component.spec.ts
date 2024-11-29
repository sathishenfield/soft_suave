import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWithoutComponent } from './dialog-without.component';

describe('DialogWithoutComponent', () => {
  let component: DialogWithoutComponent;
  let fixture: ComponentFixture<DialogWithoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogWithoutComponent]
    });
    fixture = TestBed.createComponent(DialogWithoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
