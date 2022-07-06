import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallServiceComponent } from './call-service.component';

describe('CallServiceComponent', () => {
  let component: CallServiceComponent;
  let fixture: ComponentFixture<CallServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
