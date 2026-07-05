import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopMore } from './shop-more';

describe('ShopMore', () => {
  let component: ShopMore;
  let fixture: ComponentFixture<ShopMore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopMore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopMore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
