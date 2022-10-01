import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { food } from 'src/app/models/food';
import { FoodService } from 'src/app/services/food.service';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.css']
})
export class ManageFoodComponent implements OnInit {
  @ViewChild('closebuttonCreateFood') closebuttonCreateFood: any;
  @ViewChild('closebuttonEditFood') closebuttonEditFood: any;
  tid: any;
  formCreateFood: any;
  formEditFood: any;
  formType: any;
  submitCreate: boolean = false;
  submitEdit: boolean = false;
  showFood: any;
  searchText: any;
  typeData: any;
  statusType: boolean = false;
  filterFood: any;
  formTypeStatus: boolean = false;
  img_edit: any;
  img_add: any;

  constructor(
    public fb: UntypedFormBuilder,
    public http: HttpClient,
    public callapi: FoodService,
    public callapitype: TypeFoodService,
    private spinner: NgxSpinnerService
  ) {
    this.formCreateFood = this.fb.group({
      food_id: [null],
      name: [null, [Validators.required]],
      typeid: [null],
      type: [null],
      price: [0],
      imgPath: null,
      status: null,
      display: null,
      recommend: false,
      amount: 0
    }),
      this.formEditFood = this.fb.group({
        id: null,
        food_id: null,
        name: [null, [Validators.required]],
        typeid: [null],
        type: [null],
        price: [0],
        imgPath: null,
        status: null,
        display: null,
        recommend: null,
        amount: 0
      }),
      this.formType = this.fb.group({
        id: null,
        name: null,
        status: null
      })
  }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getFood(), this.getTypeData()]).then((values) => {
      this.spinner.hide();
    });
  }

  // for images
  public message: any;
  public progress: any;
  public response: any = { dbPath: '' };
  pathImg: any;
  @Output() public onUploadFinished = new EventEmitter();

  public uploadFile = (files: any) => {
    if (files.length == 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post(`${environment.apiUrl}Food/Upload`, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this.message = 'อัปโหลดรูปภาพสำเร็จ';
          this.onUploadFinished.emit(event.body);
          this.pathImg = event.body;
          this.img_edit = this.pathImg.dbPath;
          this.img_add = this.pathImg.dbPath;
        }
      })
  }

  createFood() {
    this.submitCreate = true;
    this.formCreateFood.value.display = true;
    this.formCreateFood.value.imgPath = this.img_add;
    if (this.formCreateFood.value.type == null && this.formCreateFood.value.typeid != null) {
      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].id == this.formCreateFood.value.typeid) {
          this.formCreateFood.value.type = this.typeData[i].name;
        }
      }
    }
    if (this.formCreateFood.value.type == null || this.formCreateFood.value.typeid == null) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'กรุณาเลือกประเภท',
        showConfirmButton: false,
        timer: 1000
      })
    } else if (this.formCreateFood.valid) {
      this.callapi.CreateFood(this.formCreateFood.value).subscribe(food => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มอาหารสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.setFormCreate();
        this.formCreateFood.value.imgPath = null;
        this.img_add = null;
        this.message = null;
        this.formTypeStatus = false;
        this.getFood();
        this.submitCreate = false;
        this.getTypeData();
      })
      this.closeModalCreateFood();
    }
  }

  closeModalCreateFood() {
    this.closebuttonCreateFood.nativeElement.click();
  }

  closeModalEditFood() {
    this.closebuttonEditFood.nativeElement.click();
  }

  GetBeforeEdit(id: string) {
    this.showFood.map((food: any) => {
      if (food.food_id == id) {
        this.setFormEdit(food);
        this.formEditFood.value.imgPath = food.imgPath;
        this.img_edit = food.imgPath;
      }
    })
  }

  editFood() {
    this.submitEdit = true;
    this.typeData.map((type: any) => {
      if (type.id == this.formEditFood.value.typeid) {
        this.formEditFood.value.type = type.name
      }
    })
    this.formEditFood.value.imgPath = this.img_edit;
    this.callapi.EditFood(this.formEditFood.value.food_id, this.formEditFood.value).subscribe(food => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'แก้ไขอาหารสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.formEditFood.value.imgPath = null;
      this.img_edit = null;
      this.message = null;
      this.getFood();
      this.getTypeData();
    })
    this.closeModalEditFood();
  }

  setFormEdit(data: food) {
    this.formEditFood.patchValue({
      id: data.id,
      food_id: data.food_id,
      name: data.name,
      type: data.type,
      typeid: data.typeid,
      price: data.price,
      status: data.status,
      display: data.display,
      amount: data.amount,
      recommend: data.recommend
    })
  }

  setFormCreate() {
    this.formCreateFood.patchValue({
      food_id: null,
      name: null,
      type: null,
      typeid: null,
      price: 0,
      imgPath: null,
      status: null,
      display: null,
      amount: 0
    })
  }

  getFood() {
    this.callapi.GetFood().subscribe(food => {
      this.showFood = food;
    })
  }

  public uploadFinished = (event: any) => {
    this.response = event;
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

  getTypeData() {
    this.callapitype.GetType().subscribe(tf => {
      this.typeData = tf;
    })
  }

  filterType(type: string) {
    this.filterFood = type;
  }

  setFormNull() {
    this.formEditFood.value.imgPath = null;
    this.formCreateFood.value.imgPath = null;
    this.message = null;
    this.submitCreate = false;
  }

  get formValidCreate() {
    return this.formCreateFood.controls;
  }

  get formValidEdit() {
    return this.formEditFood.controls;
  }

  changeFormType(status: boolean) {
    this.formTypeStatus = status;
  }

  createNewType(type: string) {
    this.formType.value.name = type;
    if (this.formType.value.name != null) {
      this.callapitype.CreateType(this.formType.value).subscribe(tf => {
        this.formCreateFood.value.typeid = tf.id;
        this.formCreateFood.value.type = tf.name;
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มประเภทสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
      })
    } else {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'กรุณากรอกประเภท',
        showConfirmButton: false,
        timer: 1000
      })
    }
  }
}
