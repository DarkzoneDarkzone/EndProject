import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {
  @ViewChild('closebuttonCreateEmployee') closebuttonCreateEmployee: any;
  @ViewChild('closebuttonEditEmployee') closebuttonEditEmployee: any;

  formCreateEmployee: any;
  formEditEmployee: any;
  employeeFromApi: any;
  searchText: any;
  searchPosition: any;
  submitCreate: boolean = false;
  submitEdit: boolean = false;

  constructor(
    public fb: UntypedFormBuilder, 
    public callapi: EmployeeService,
    private spinner: NgxSpinnerService

  ){
    this.formCreateEmployee = this.fb.group({
      emp_Id: [null],
      emp_Name: [null, [Validators.required]],
      emp_Tel: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      position: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      status: null
    }),
      this.formEditEmployee = this.fb.group({
        emp_Id: null,
        emp_Name: [null, [Validators.required]],
        emp_Tel: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
        position: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        status: null
      })
  }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getEmployee()]).then((values) => {
      this.spinner.hide();
    });
  }

  patchValueFormEdit(data: employee) {
    this.formEditEmployee.patchValue({
      emp_Id: data.emp_Id,
      emp_Name: data.emp_Name,
      emp_Tel: data.emp_Tel,
      position: data.position,
      password: data.password,
      status: null
    })
  }

  getEmployee() {
    this.callapi.GetEmployee().subscribe(emp => {
      this.employeeFromApi = emp;
      this.employeeFromApi.reverse();
    })
  }


  createEmployee() {
    this.submitCreate = true;
    if (this.formCreateEmployee.valid) {
      this.callapi.CreateEmployee(this.formCreateEmployee.value).subscribe(emp => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มบัญชีสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getEmployee();
      })
      this.closeModalCreateEmployee();
    }
  }

  deleteEmployee(empId: string) {
    Swal.fire({
      position: 'top',
      text: "ต้องการลบข้อมูลนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callapi.DeleteEmployee(empId).subscribe(emp => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'ลบสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          })
          this.closeModalEditEmployee();
          this.getEmployee();
        })
      }
    })
  }

  GetEmpById(id: string) {
    this.callapi.GetEmployeeById(id).subscribe(emp => {
      this.patchValueFormEdit(emp);
    })
  }

  editEmployee() {
    this.submitEdit = true;
    if (this.formEditEmployee.valid) {
      this.callapi.EditEmployee(this.formEditEmployee.value.emp_Id, this.formEditEmployee.value).subscribe(emp => {
        this.getEmployee();
      })
      this.closeModalEditEmployee();
    }
  }

  closeModalCreateEmployee() {
    this.closebuttonCreateEmployee.nativeElement.click();
  }

  closeModalEditEmployee() {
    this.closebuttonEditEmployee.nativeElement.click();
  }

  get formValidCreate() {
    return this.formCreateEmployee.controls;
  }

  get formValidEdit() {
    return this.formEditEmployee.controls;
  }

  checkPositionFilter(position: string) {
    this.searchPosition = position;
  }
}
