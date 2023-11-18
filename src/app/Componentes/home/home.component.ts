import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ServicesComponent } from '../../Services';
import Swal from'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Logueado = false;
  ErrorLogin = false;
  mensajeLogin: string = "";
  frmLogin = new FormGroup({
    email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    password: new FormControl('', Validators.required)
  });

  constructor(private servicio: ServicesComponent) {}

  ngOnInit(): void {
    if(sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined)
    {
      this.Logueado = true;
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
          if(rta == undefined)
          {
            this.Logueado = false;
            this.ErrorLogin = true;
            this. mensajeLogin="¡Usuario o contraseña incorrectos!"

          }
          else
          {
            this.Logueado = true;
            sessionStorage.setItem('cccccc', JSON.stringify(rta));
          }
        }
        catch{
          Swal.fire("Error de autenticación", "Ha ocurrido un error inesperado!", "error");
        }
      });
    }
  }
}
