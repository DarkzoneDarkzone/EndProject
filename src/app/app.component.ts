import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ProjectCafe';
  status_login: any;
  formLogin: any;
  formRegister: any;
  formForLogin: Boolean = true
  constructor(public fb: FormBuilder, public callApi: EmployeeService) {
    this.formLogin = this.fb.group({
      username: "EMP00",
      password: "flook2201",
    })
    this.formRegister = this.fb.group({
      username: null,
      password: null,
    })
  }

  ngOnInit(): void {
    this.status_login = localStorage.getItem('statusLogin')
  }

  public onSignin(){
    this.callApi.CheckLogin(this.formLogin.value.username, this.formLogin.value.password).subscribe(e => {
      localStorage.setItem('statusLogin', 'yes')
      location.reload()
    })
  }

  public onRegister(){
    console.log(this.formRegister.value)
  }

  public changeForm(){
    // this.formForLogin = !this.formForLogin
  }
}
