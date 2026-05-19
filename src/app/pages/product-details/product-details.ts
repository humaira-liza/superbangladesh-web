import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
selector:'app-product-details',
standalone:true,
templateUrl:'./product-details.html'
})

export class ProductDetails{

id:any;

constructor(private route:ActivatedRoute){

this.id = this.route.snapshot.params['id'];

}

}