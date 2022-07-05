import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ProjectCafe';
  status_login: any;
  position: any;
  formLogin: any;
  formRegister: any;
  formForLogin: Boolean = true
  

  constructor(public fb: FormBuilder, public callApi: EmployeeService, private router: Router) {
    this.formLogin = this.fb.group({
      username: "EMP00",
      password: "12341234",
    })
    this.formRegister = this.fb.group({
      username: null,
      password: null,
    })
  }

  ngOnInit(): void {
    this.status_login = localStorage.getItem('statusLogin')
    this.position = localStorage.getItem('position')
  }


  public onSignin(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    this.callApi.CheckLogin(this.formLogin.value.username, this.formLogin.value.password).subscribe((e: any) => {
      if(e){
        Toast.fire({
          icon: 'success',
          title: 'Login success.',
          showConfirmButton: false,
          timer: 1500
        }).then(event => {
          localStorage.setItem('statusLogin', 'yes')
          localStorage.setItem('position', e.position)
          if(e.position == "manager"){
            location.href = '/income'
          }
        })
      } else {
        Toast.fire({
          icon: 'warning',
          title: 'Please try again.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  public onSignOut(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: 'Logout success.',
      showConfirmButton: false,
      timer: 1500
    }).then(e => {
      localStorage.clear()
      location.href = '/'
    })
  }

  public onRegister(){
    console.log(this.formRegister.value)
  }

  public changeForm(){
    // this.formForLogin = !this.formForLogin
  }
}
