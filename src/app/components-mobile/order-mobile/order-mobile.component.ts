import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.css']
})
export class OrderMobileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
}
