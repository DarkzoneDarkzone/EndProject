import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FoodService } from 'src/app/services/food.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.css']
})
export class ManageFoodComponent implements OnInit {
  formCreateFood: any;
  submitCreate: boolean = false;
  showFood: any;

  constructor(public fb: FormBuilder, public http: HttpClient, public callapi: FoodService) { 
    this.formCreateFood = this.fb.group({
      food_id: null,
      name: null,
      type: null,
      price: null,
      imgPath: null
    })
  }

  ngOnInit(): void {
    this.getFood();
  }

  resetForm(){
    console.log(this.formCreateFood.value);
    this.message = null;
  }

  // for images 
  public message: any;
  public progress: any;
  public response: any =  { dbPath: ''};
  pathImg:any ;
  @Output() public onUploadFinished = new EventEmitter();

  public uploadFile = (files: any) => {
    if(files.length === 0){
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post('https://localhost:5001/api/Food/Upload', formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if(event.type === HttpEventType.Response){
        this.message = 'อัปโหลดรูปภาพสำเร็จ';
        this.onUploadFinished.emit(event.body);
        this.pathImg = event.body;
      }
    })
  }

  createFood(){
    this.submitCreate = true;
    console.log(this.formCreateFood.value);
    this.formCreateFood.value.imgPath = this.pathImg.dbPath;
    if (this.formCreateFood.valid) {
      this.callapi.CreateFood(this.formCreateFood.value).subscribe(food => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มอาหารสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getFood();
      })
      // this.closeModalCreateEmployee();
    }
  }

  getFood(){
    this.callapi.GetFood().subscribe(food => {
      this.showFood = food;
    })
  }

  public uploadFinished = (event: any) => {
    this.response = event;
  }

  public showImages = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }



}
