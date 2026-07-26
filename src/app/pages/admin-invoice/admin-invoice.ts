import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-invoice.html',
  styleUrls: ['./admin-invoice.css']
})
export class AdminInvoice implements OnInit {

  order: any;

  API =
    'https://superbangladesh-api-1.onrender.com/api/orders';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.http
        .get(`${this.API}/${id}`)
        .subscribe(res => {

          this.order = res;

          console.log(this.order);

        });

    }

  }

}