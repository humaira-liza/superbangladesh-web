import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPurchase } from './admin-purchase';

describe('AdminPurchase', () => {
  let component: AdminPurchase;
  let fixture: ComponentFixture<AdminPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPurchase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
