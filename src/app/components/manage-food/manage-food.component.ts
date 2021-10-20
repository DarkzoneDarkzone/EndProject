import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { food } from 'src/app/models/food';
import { typeFood } from 'src/app/models/typefood';
import { FoodService } from 'src/app/services/food.service';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.css']
})
export class ManageFoodComponent implements OnInit {
  @ViewChild('closebuttonCreateFood') closebuttonCreateFood: any;
  @ViewChild('closebuttonEditFood') closebuttonEditFood: any;

  formCreateFood: any;
  formEditFood: any;
  formForReset: any;
  formType: any;
  submitCreate: boolean = false;
  submitEdit: boolean = false;
  showFood: any;
  searchText: any;
  typeData: any;
  statusType: boolean = false;
  filterFood: any;
  formTypeStatus: boolean = false;

  constructor(public fb: FormBuilder, public http: HttpClient, public callapi: FoodService, public callapitype: TypeFoodService) { 
    this.formCreateFood = this.fb.group({
      food_id: [null],
      name: [null,[Validators.required]],
      type: [null,[Validators.required]],
      price: [null,[Validators.required, Validators.pattern('[0-9]*')]],
      imgPath: null,
      status: null
    }),
    this.formEditFood = this.fb.group({
      food_id: null,
      name: [null,[Validators.required]],
      type: [null,[Validators.required]],
      price: [null,[Validators.required, Validators.pattern('[0-9]*')]],
      imgPath: null,
      status: null
    }),
    this.formForReset = this.fb.group({
      food_id: null,
      name: [null,[Validators.required]],
      type: [null,[Validators.required]],
      price: [null,[Validators.required, Validators.pattern('[0-9]*')]],
      imgPath: null,
      status: null
    }),
    this.formType = this.fb.group({
      id: null,
      name: null
    })
  }

  ngOnInit(): void {
    this.getFood();
    this.getTypeData();
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
    this.http.post(`${environment.apiUrl}Food/Upload`, formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if(event.type === HttpEventType.Response){
        this.message = 'อัปโหลดรูปภาพสำเร็จ';
        this.onUploadFinished.emit(event.body);
        this.pathImg = event.body;
        this.formEditFood.value.imgPath = this.pathImg.dbPath;
        this.formCreateFood.value.imgPath = this.pathImg.dbPath;
      }
    })
  }

  createFood(){
    this.submitCreate = true;
    this.checkTypeInDb(this.formCreateFood.value.type); 
    this.formCreateFood.value.status = true;
    if (this.formCreateFood.valid) {
      this.callapi.CreateFood(this.formCreateFood.value).subscribe(food => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มอาหารสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.setFormCreate(this.formForReset.value);
        this.formCreateFood.value.imgPath = null;
        this.formEditFood.value.imgPath = null;
        this.message = null;
        this.formTypeStatus = false;
        this.getFood();
        this.getTypeData();
      })
      this.closeModalCreateFood();
    }
  }

  closeModalCreateFood(){
    this.closebuttonCreateFood.nativeElement.click();
  }

  closeModalEditFood(){
    this.closebuttonEditFood.nativeElement.click();
  }

  GetBeforeEdit(id: string){
    this.callapi.GetFoodById(id).subscribe( food =>{
      this.setFormEdit(food);
    })
  }

  editFood(){
    this.submitEdit = true;
    this.callapi.EditFood(this.formEditFood.value.food_id, this.formEditFood.value).subscribe(food => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'แก้ไขอาหารสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.formCreateFood.value.imgPath = null;
      this.formEditFood.value.imgPath = null;
      this.message = null;
      this.getFood();
      this.getTypeData();
    })
    this.closeModalEditFood();
  }

  setFormEdit(data: food){
    this.formEditFood.patchValue({
      food_id: data.food_id,
      name: data.name,
      type: data.type,
      price: data.price,
      imgPath: data.imgPath,
      status: data.status
    })
  }

  setFormCreate(data: any){
    this.formCreateFood.patchValue({
      food_id: data.food_id,
      name: data.name,
      type: data.type,
      price: data.price,
      imgPath: data.imgPath,
      status: data.status
    })
  }

  getFood(){
    this.callapi.GetFood().subscribe(food => {
      this.showFood = food;
    })
  }

  getFoodById(id: string){
    this.callapi.GetFoodById(id)
  }

  public uploadFinished = (event: any) => {
    this.response = event;
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

  getTypeData(){
    this.callapitype.GetType().subscribe( tf => {
      this.typeData = tf;
    })
  }

  filterType(type: string){
    this.filterFood = type;
  }

  setFormNull()
  {
  this.formEditFood.value.imgPath = null;
  this.formCreateFood.value.imgPath = null;
  }

  get formValidCreate() {
    return this.formCreateFood.controls;
  }
  get formValidEdit() {
    return this.formEditFood.controls;
  }
  chageFormType(status: boolean){
    this.formTypeStatus = status;    
  }
  checkTypeInDb(type: string){
    for(let i = 0; i < this.typeData.length ; i++){
      if(this.typeData[i].name != type){
        this.formType.value.name = type;
      }
    }
    this.callapitype.CreateType(this.formType.value).subscribe(tf => {})
  }
}
