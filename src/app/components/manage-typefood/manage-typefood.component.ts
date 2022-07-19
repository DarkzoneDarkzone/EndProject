import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() public onUploadFinished = new EventEmitter();
  searchText: any
  typeData: any
  message: any
  pathImg: any
  img_edit: any
  img_add: any
  formType: any
  submitCreate: boolean = false
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
   }
  ngOnInit(): void {
    this.getTypeData()
  }

  getTypeData(){
    this.callapitype.GetType().subscribe( tf => {
      this.typeData = tf;
    })
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

  public uploadFile = (files: any) => {
    if(files.length == 0){
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
        this.img_edit = this.pathImg.dbPath;
        this.img_add = this.pathImg.dbPath;
      }
    })
  }

  createNewType(){
    this.formType.value.imgPath = this.img_add;
    this.submitCreate = true
    if(this.formType.value.name != null){
      this.callapitype.CreateType(this.formType.value).subscribe(tf => {
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

  get formValidType() {
    return this.formType.controls;
  }
}
