import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import Swal from 'sweetalert2';
import { CompositeMensajeFields, ConvertStringToDecimal } from '../functions/FnGenericas';
import { ResponseM2, UserModel } from 'src/app/modelos/Interfaces';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  FormUser;
  types_user_id:any[]=[];
  titlebGoE ="Guardar";
  //formatDecimal:string = "/^(?:99|\\d{1,2})(?:\\" + sessionStorage.getItem('formats')!.replace('"', '').replace('"', '') +"\\d{1,2})?$";
  //formatDecimal:string = "/^\\s*-?[1-9]\\d*(\\" + sessionStorage.getItem('formats')!.replace('"', '').replace('"', '') +"\\d{1,2})?\\s*$/";
  //formatDecimal:string = "/^\\s*-?[1-9]\\d*(\\" + sessionStorage.getItem('formats')!.replace('"', '').replace('"', '') +"\\
  //formatDecimal:string ="/^\\d+\\" + sessionStorage.getItem('formats')!.replace('"', '').replace('"', '') + "\\d{0,3}$/";
  //formatDecimal:string ="/^[0-9]?[0-9]?(\\"+sessionStorage.getItem('formats')!.replace('"', '').replace('"', '') +"[0-9][0-9]?)?$";
  // formatDecimal:string ="[0-9]?[0-9]?("+sessionStorage.getItem('formats')!.replace('"', '').replace('"', '')+"[0-9][0-9]?)?";
  //formatDecimal:string ="[0-9]?[0-9]?(\.[0-9][0-9]?)?";
  @Input() modelEditar: object;
  EsEdicion = false;
  @ViewChild('FormU', {static: false}) FormU: NgForm;
  
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    //console.log(sessionStorage.getItem('formats'));
    this.FormUser = fb.group({
      id: new FormControl(0),
      email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      type_document: new FormControl('', Validators.required),
      document: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      typeuserId: new FormControl('', Validators.required),
      inactive: new FormControl(false, Validators.required),
      comission: new FormControl(0.0)
      // comission: new FormControl(('0' + sessionStorage.getItem('formats')!.replaceAll('"', '')  + '00'), Validators.pattern(this.formatDecimal))
      // password: new FormControl('', Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*([^a-zA-Z\d\s]))(?=.*?[0-9]).{8,}$/)),
      // confirmPassword: new FormControl('', Validators.required)}, { validators: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    // console.log(this.formatDecimal);
    this.servicio.SendGetWOutPObsHeaderAut('typeusers/').then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          if(rta.success)
          {
            //console.log(rta.data);
            this.types_user_id = rta.data.filter((r:any)=>r.name!="Cliente");
          }
          else
            Swal.fire("Error", rta.message, "error");
        }
      }
      catch(e){
        console.log('Ha ocurrido un error inesperado. Motivo:', e);           
        throw e;
      }
    });

    if(this.modelEditar != undefined){
      this.EsEdicion = true;
      this.FormUser.controls['email'].disable();
      this.FormUser.controls['type_document'].disable();
      this.FormUser.controls['document'].disable();
      this.titlebGoE = "Editar"
      this.servicio.SendGetWOutPObsHeaderAut('users/'+(this.modelEditar as UserModel).id).then((rta: any) => {
        try
        {
          if(rta == undefined)
          {
            Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
          }
          else
          {
            if(rta.success)
            {
              //console.log(rta.data);
              this.FormUser.setValue(rta.data);
            }
            else
              Swal.fire("Error", rta.message, "error");
          }
        }
        catch(e){
          console.log('Ha ocurrido un error inesperado. Motivo:', e);           
          throw e;
        }
      });
    }
  }

  GuardarEditarUsuario(result:any):void{
    this.pGuardarEditarUsuario(this.EsEdicion, ((this.EsEdicion ? "Editar " : "Registrar ") +  "Usuario"));
  }

  private pGuardarEditarUsuario(_edicion: boolean, _title:string)
  {
    if(this.FormUser.valid)
    {
      if(this.FormUser.get("comission")?.value.toString().includes(","))
        this.FormUser.get("comission")?.setValue(parseFloat(this.FormUser.get("comission")?.value.toString().replace(",",".")));
      //this.FormUser.get("comission")?.setValue(parseFloat(this.FormUser.get("comission")?.value).toFixed(2));
      console.log(this.FormUser.get("type_document")?.value)
      if(this.FormUser.get("type_document")?.value.toString().toLocaleUpperCase() == "NA")
        Swal.fire("Campo requerido", "Debe seleccionar un tipo de documento para el usuario!", "warning");
      else if(this.FormUser.get("typeuserId")?.value.toString().toLocaleUpperCase() == "NA")
        Swal.fire("Campo requerido", "Debe seleccionar un tipo de usuario para el usuario!", "warning");
      else
      {
        //this.FormUser.get("comission")?.setValue(parseFloat(ConvertStringToDecimal(this.FormUser.get("comission")!.value).toString()));
        Swal.fire({
          title: _title,
          text: "¿Desea " + (_edicion ? "editar" : "guardar") + " el usuario?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: (_edicion ? 'Editar' : 'Guardar'),
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              if(!_edicion)
              {
                this.servicio.SendPOSTWParamObs('users/', this.FormUser.value, true).then((rta: ResponseM2) => {
                  Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                  if(rta.success)
                  {
                    this.clearForm();
                  }
                });
              }
              else{
                this.servicio.SendPUTWParamObs('users/' +this.FormUser.get("id")?.value, this.FormUser.value, true).then((rta: ResponseM2) => {
                  if(rta.success)
                  {
                    this.clearForm();
                    //Swal.fire( rta.success ? "Registro Editado" : rta.error == '01' ? "Error de registro" : "Advertencia", rta.message, rta.success ? "success" : rta.error == '01' ? 'warning' : 'error') }).then((result) => {
                    
                    Swal.fire({
                      title: (rta.success ? "Registro Editado" :"Error de  Edición"),
                      text: rta.message,
                      showCancelButton: false,
                      cancelButtonText:'Cancelar',
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#2780e3',
                    }).then((resultado) => {
                      if (resultado.isConfirmed) {
                        document.getElementById("btnClose")?.click();
                      }
                    });
                  }
                });
              }
            }
            catch{
              Swal.fire("Error al guardar o editar usuario", "Ha ocurrido un error inesperado!", "error");
            }
          } 
        });
      }
    }
  }

  private clearForm(){
    this.FormU.resetForm();
    this.FormUser.controls["id"]?.setValue(0);
    this.FormUser.controls["inactive"]?.setValue(false);
    // this.FormUser.controls["comission"]?.setValue(('0' + sessionStorage.getItem('formats')!.replaceAll('"', '')  + '00'));
    this.FormUser.controls["comission"]?.setValue(0.0);
  }
}

