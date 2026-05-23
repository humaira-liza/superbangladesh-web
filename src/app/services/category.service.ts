import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private API = 'http://superbangladesh-api-1.onrender.com/api/categories';

  constructor(private http: HttpClient) {}

  // 🔥 CATEGORY TREE
  getTree() {

    return this.http.get<any[]>(
      this.API + '/tree'
    );
  }

  // 🔥 MAIN CATEGORY
  getMain() {

    return this.http.get<any[]>(
      this.API
    );
  }

  // 🔥 CHILD CATEGORY
  getChildren(id: number) {

    return this.http.get<any[]>(
      `${this.API}/${id}/children`
    );
  }
}