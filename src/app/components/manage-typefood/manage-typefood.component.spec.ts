import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTypefoodComponent } from './manage-typefood.component';

describe('ManageTypefoodComponent', () => {
  let component: ManageTypefoodComponent;
  let fixture: ComponentFixture<ManageTypefoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTypefoodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTypefoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
