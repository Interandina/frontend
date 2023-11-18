import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ServicesComponent } from '../app/Services';
import Swal from'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hidePass = true;
  Logueado = false;
  title = 'InterAndinaApp';
  ErrorLogin = false;
  mensajeLogin: string = "";
  VievCPass= false;
  VievResetPass= false;
  frmLogin = new FormGroup({
    email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    password: new FormControl('', Validators.required)
  });

  constructor(private servicio: ServicesComponent, private router: Router) {}

  ngOnInit(): void {
    if(sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined)
    {
      this.Logueado = true;
    }
    else
    {
      let paramresetpass = new URLSearchParams(window.location.search).get('val');
      if(paramresetpass != null && paramresetpass != undefined)
      {
        this.VievResetPass = true;
        //this.router.navigate(['/resetPassword'], {skipLocationChange: true});
      }

    }
  }
  /**
   * Método que realizar el Login
   * @param result The result.
   */
  Login(result:any) {
    this.ErrorLogin = false;
    this. mensajeLogin=""
    if(this.frmLogin.valid)
    {
      this.servicio.SendPOSTWParamObs('users/login', this.frmLogin.value).then((rta: any) => {
        try
        {
          this.Logueado = false;
          this.ErrorLogin = true;
          this.mensajeLogin = "";
          if(rta == undefined)
          {
            Swal.fire("Error", "Ha ocurrido un error inesperado!", 'error');
          }
          else
          {
            if(rta.success)
            {
              sessionStorage.setItem('cccccc', JSON.stringify(rta.data));
              sessionStorage.setItem('formats', JSON.stringify(rta.formats.decimal.replace('"', '').replace('"', '')));
              // console.log(JSON.stringify(sessionStorage.getItem('formats')));
              this.Logueado = true;
              this.ErrorLogin = false;
            }
            else
            {
              this.mensajeLogin = rta.message;
            }
          }
        }
        catch{
          Swal.fire("Error de autenticación", "Ha ocurrido un error inesperado!", "error");
        }
      });
    }
  }

  changePass():void{
    this.VievCPass = true;
    //window.location.href = '/change_password';
    this.router.navigate(['/change_password'], {skipLocationChange: true});
    
  }
  // getErrorMessage() {
  //   return this.frmLogin.controls.email.hasError('required') ? 'You must enter a valueddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd' : ''
  // }

}
