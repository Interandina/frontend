import {Component, Inject, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from'sweetalert2';
import { Login, ResponseM } from 'src/app/modelos/Interfaces';
import { ServicesComponent } from '../../Services';
import { HttpErrorResponse } from '@angular/common/http';
/*import { environment } from 'src/environments/environment';
import { EventEmitter } from 'protractor';*/

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent {
  hidePass = true;
  rta: ResponseM = { coderror: "",  messageerror: "",  procesado: false, data: null };
  //userl = "";
  //@Output() newItemEvent = new EventEmitter();
  // @Output() userlogueado: EventEmitter = new EventEmitter();
  // user: string;

  frmLogin = new FormGroup({
    email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    //user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(public dialog: MatDialogRef<DialogLoginComponent>, private servicio: ServicesComponent) {}

  /*openDialog(): void {
    // const dialogRef = this.dialog.open(DialogLogin, {
    //   width: '250px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   data: this.frmLogin.controls['correo'].value;
    // });
  }*/

  onNoClick(data:any = null): void {
    if(data != null)
      this.dialog.close(data);
    else
      this.dialog.close();
  }
  
  /**
   * Método que realizar el Login
   * @param result The result.
   */
   Login(result:any) {
    if(this.frmLogin.valid)
    {

      /*this.servicio.SendPOSTWParamObs('users/login', this.frmLogin.value).then((resp) => {
        console.log("entro");
        console.log(resp);
      }, (error) => {
            console.error(error.error);
      });*/
      this.servicio.SendPOSTWParamObs('users/login', this.frmLogin.value).then((rta: any) => {
        if(rta != undefined)
        {
          alert("logueado");
        }
      });
      //console.log(this.prueba);
      //this.servicio.SendGet('books').subscribe((rta: ResponseM) => {
      /*this.servicio.SendPOSTWParamObs('users/login', this.frmLogin.value).then((rta: ResponseM) => {
        console.log("rta=>" + rta);
        /*if (rta.procesado) {
          // this.userlogueado.emit(this.user);
          //window.location.href="/"
          this.onNoClick(this.frmLogin.controls['correo'].value?.toString());
        }
        else
        {
          Swal.fire( rta.coderror == '01' ? "Error de autenticación" : "Advertencia", rta.messageerror, rta.coderror == '01' ? 'warning' : 'error');
        }
      });*/
    }
  }
}
