import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeachersComponent } from './view-teachers.component';

describe('ViewTeachersComponent', () => {
  let component: ViewTeachersComponent;
  let fixture: ComponentFixture<ViewTeachersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTeachersComponent]
    });
    fixture = TestBed.createComponent(ViewTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
