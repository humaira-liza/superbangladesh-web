import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseManagement } from './purchase-management';

describe('PurchaseManagement', () => {
  let component: PurchaseManagement;
  let fixture: ComponentFixture<PurchaseManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
