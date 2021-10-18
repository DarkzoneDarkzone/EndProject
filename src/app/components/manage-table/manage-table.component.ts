import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.css']
})
export class ManageTableComponent implements OnInit {
  imgPath= "Resources/Images/ยำแซลม่อน.jpeg"
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
  }

  public showImages = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
}
