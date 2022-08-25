import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChefComponent } from './order-chef.component';

describe('OrderChefComponent', () => {
  let component: OrderChefComponent;
  let fixture: ComponentFixture<OrderChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
