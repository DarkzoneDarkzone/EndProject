import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {


  formCreateEmployee: any;
  employeeFromApi: any;

  constructor(public fb: FormBuilder, public callapi : EmployeeService) {
    this.formCreateEmployee = this.fb.group({
      emp_Id: null,
      emp_Name: null,
      emp_Tel: null,
      position: null,
      password: null
    })
  }

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(){
    this.callapi.GetEmployee().subscribe(emp => {
      this.employeeFromApi = emp;
      console.log(emp);
      
    })
  }

}
