import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-typefood',
  templateUrl: './manage-typefood.component.html',
  styleUrls: ['./manage-typefood.component.css']
})
export class ManageTypefoodComponent implements OnInit {
  @ViewChild('closebuttonEditTypeFood') closebuttonEditTypeFood: any;
  @ViewChild('closebuttonCreateTypeFood') closebuttonCreateTypeFood: any;

  @Output() public onUploadFinished = new EventEmitter();
  searchText: any
  typeData: any
  message: any
  pathImg: any
  img_edit: any
  img_add: any
  formType: any
  formTypeEdit: any
  submitCreate: boolean = false
  submitEdit: boolean = false
  constructor(
    public fb: UntypedFormBuilder,
    public http: HttpClient,
    public callapitype: TypeFoodService,
    private spinner: NgxSpinnerService
  ) {
    this.formType = this.fb.group({
      id: null,
      name: [null, Validators.required],
      imgPath: null,
      status: null
    })
    this.formTypeEdit = this.fb.group({
      id: null,
      name: [null, Validators.required],
      imgPath: null,
      status: null
    })
  }
  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getTypeData()]).then((values) => {
      this.spinner.hide();
    });
  }

  getTypeData() {
    this.callapitype.GetType().subscribe(tf => {
      this.typeData = tf;
    })
  }

  SetBeforeEdit(id: any) {
    this.typeData.forEach((element: any) => {
      if (element.id == id) {
        this.img_edit = element.imgPath
        this.formTypeEdit.patchValue({
          id: element.id,
          name: element.name,
          imgPath: element.imgPath,
          status: element.status
        })
      }
    });
  }

  setFormNull() {
    this.formType.value.imgPath = null;
    this.formTypeEdit.value.imgPath = null;
    this.message = null;
    this.submitCreate = false;
    this.submitEdit = false;
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

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

  createNewType() {
    this.formType.value.imgPath = this.img_add;
    this.submitCreate = true
    if (this.formType.value.name != null) {
      this.callapitype.CreateType(this.formType.value).subscribe(tf => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มประเภทสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.submitCreate = false
        this.img_edit = null
        this.img_add = null
        this.formType.reset()
        this.setFormNull()
        this.closeModalCreateTypeFood()
        this.getTypeData()
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

  editFood() {
    this.submitEdit = true;
    this.formTypeEdit.value.imgPath = this.img_edit;
    this.callapitype.EditType(this.formTypeEdit.value.id, this.formTypeEdit.value).subscribe(tf => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'แก้ไขประเภทอาหารสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.formTypeEdit.value.imgPath = null;
      this.formTypeEdit.reset()
      this.setFormNull()
      this.img_edit = null;
      this.img_add = null;
      this.message = null;
      this.message = "";
      this.getTypeData();
      this.closeModalEditTypeFood()
    })
  }

  get formValidType() {
    return this.formType.controls;
  }

  closeModalEditTypeFood() {
    this.closebuttonEditTypeFood.nativeElement.click();
  }

  closeModalCreateTypeFood() {
    this.closebuttonCreateTypeFood.nativeElement.click();
  }

  get formValidTypeEdit() {
    return this.formTypeEdit.controls;
  }
}
