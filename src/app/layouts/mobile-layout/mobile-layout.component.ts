import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mobile-layout',
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.css'],
})
export class MobileLayoutComponent implements OnInit {
  subscription: any
  dataPassed: any
  constructor(public ds: DataService) {}

  ngOnInit(): void {
    this.subscription = this.ds.getData().subscribe(x => {
      this.dataPassed = x;
    });
    this.ds.sendData(0);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
