import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-c-password',
  templateUrl: './c-password.component.html',
  styleUrls: ['./c-password.component.css']
})
export class CPasswordComponent {
  FormCPass;
  // breakpoint: number;
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    this.FormCPass = fb.group({
//      email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      user: new FormControl('', Validators.required)
    });
  }
  // ngOnInit(): void {
  //   console.log(window.innerWidth);
  //   this.breakpoint = (window.innerWidth <= 1600) ? 9 : 8;
  // }

  // onResize(event:any) {
  //   this.breakpoint = (event.target.innerWidth <= 1600) ? 9 : 8;
  // }

  Ccpass():void{
    window.location.reload();
  }

  SendEmail(result:any):void{
    if(this.FormCPass.valid)
    {
      try
      {
        this.servicio.SendPOSTWParamObs('users/forgotPassword/', this.FormCPass.value, true).then((rta: ResponseM2) => {
          if(rta.success)
          {
            Swal.fire({
              title: (rta.success ? "Correo Enviado" :"Error de  Envío"),
              text: rta.message,
              showCancelButton: false,
              cancelButtonText:'Cancelar',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2780e3',
            }).then((resultado) => {
              if (resultado.isConfirmed) {
                this.Ccpass();
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
