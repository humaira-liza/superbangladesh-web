import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {

  @Output()
  categoryClick =
    new EventEmitter<any>();

  categories: any[] = [];

  expandedMain:
    number | null = null;

  expandedSub:
    number | null = null;

  selectedId = 0;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.http
      .get<any[]>(
  'https://superbangladesh-api-1.onrender.com/api/categories/tree'
)
      .subscribe({

        next: (res) => {

          const order = [

            'Food',

             'Baby Care',

              'Home & Kitchen',

            'Health & Wellness',

            'Stationery & Office',

            'Toys & Sports',

             'Beauty & MakeUp'

          ];

          this.categories =
            (res || []).sort(

              (a: any, b: any) =>

                order.indexOf(a.name) -
                order.indexOf(b.name)
            );

          console.log(
            'CATEGORY TREE:',
            this.categories
          );
        },

        error: (err) => {

          console.error(err);

          this.categories = [];
        }
      });
  }

  // ======================
  // ALL PRODUCTS
  // ======================

  onAll(): void {

    this.selectedId = 0;

    this.expandedMain = null;
    this.expandedSub = null;

    this.categoryClick.emit({

      id: 0,
      level: 'all'
    });
  }

  // ======================
  // MAIN CATEGORY
  // ======================

  onMain(cat: any): void {
    console.log('MAIN CLICK', cat);

    this.selectedId = cat.id;

    this.expandedMain =
      this.expandedMain === cat.id
        ? null
        : cat.id;

    this.expandedSub = null;

    this.categoryClick.emit({

      ...cat,

      level: 'main'
    });
  }

  // ======================
  // SUB CATEGORY
  // ======================

onSub(
  sub: any,
  parent: any
): void {

  this.selectedId = sub.id;

  this.expandedSub =
    this.expandedSub === sub.id
      ? null
      : sub.id;

  // child category থাকলে expand হবে
  if (sub.children?.length > 0) {
    return;
  }

  // child না থাকলে product দেখাবে
  this.categoryClick.emit({
    ...sub,
    parentName: parent?.name,
    level: 'sub'
  });
}

  // ======================
  // CHILD CATEGORY
  // ======================

  onChild(
    child: any,
    sub: any,
    main: any
  ): void {

    this.selectedId = child.id;

    this.categoryClick.emit({

      ...child,

      parentName:
        sub?.name,

      mainName:
        main?.name,

      level: 'child'
    });
  }

  // ======================
  // HANDLES
  // ======================

  handleAll(
    event: Event
  ): void {

    event.stopPropagation();

    this.onAll();
  }

  handleMain(
    cat: any,
    event: Event
  ): void {

    event.stopPropagation();

    this.onMain(cat);
  }

  handleSub(
    sub: any,
    parent: any,
    event: Event
  ): void {

    event.stopPropagation();

    this.onSub(

      sub,
      parent
    );
  }

  handleChild(
    child: any,
    sub: any,
    main: any,
    event: Event
  ): void {

    event.stopPropagation();

    this.onChild(
      child,
      sub,
      main
    );
  }
}