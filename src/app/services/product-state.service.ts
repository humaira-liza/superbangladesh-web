import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductStateService {

  private searchSubject = new BehaviorSubject<string>('');
  private categorySubject = new BehaviorSubject<number>(0);

  search$ = this.searchSubject.asObservable();
  category$ = this.categorySubject.asObservable();

  private mobileSearchSubject =
  new BehaviorSubject<boolean>(false);

mobileSearch$ =
  this.mobileSearchSubject.asObservable();

setMobileSearch(value: boolean) {
  this.mobileSearchSubject.next(value);
}

  setSearch(value: string) {
    this.searchSubject.next(value);
  }

  setCategory(value: number) {
    this.categorySubject.next(value);
  }
}