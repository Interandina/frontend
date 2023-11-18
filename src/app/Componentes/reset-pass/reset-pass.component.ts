import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { ConfirmPasswordValidator } from '../functions/ConfirmPasswordValidator';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  token:string = "";
  FormRPass;
  //back:string = "";
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    this.FormRPass = fb.group({
      password: new FormControl('', Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*([^a-zA-Z\d\s]))(?=.*?[0-9]).{8,}$/)),
      confirmPassword: new FormControl('', Validators.required)}, { validators: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }
  ngOnInit(): void {
    //this.back = window.location.href.includes("resetClientPassword") ?  'users/' : 'clients/';
    this.token = new URLSearchParams(window.location.search).get('val');
  }

  Cancelrp():void{
    window.location.href="/";
  }

  ResetPass(result:any):void{
    if(this.FormRPass.valid)
    {
      try
      { 
        // console.log(this.FormRPass.value);
        // console.log(this.token);

        this.servicio.SendPUTWParamObsRP( 'users/', this.FormRPass.value, this.token).then((rta: ResponseM2) => {
          if(rta.success)
          {
            Swal.fire({
              title: (rta.success ? "Contraseña Creada" :"Error de  Creación"),
              text: rta.message,
              showCancelButton: false,
              cancelButtonText:'Cancelar',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2780e3',
            }).then((resultado) => {
              if (resultado.isConfirmed) {
                this.Cancelrp();
              }
            });
          }
          else
            Swal.fire("Advertencia", rta.message, "warning");
        });
      }
      catch{
        Swal.fire("Error de autenticación", "Ha ocurrido un error inesperado!", "error");
      }
    }
  }
}
