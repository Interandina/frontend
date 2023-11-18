import { Component, Input, ViewChild } from '@angular/core';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { ParamModelReq, ParamModelRes, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { CompositeMensajeFields } from '../functions/FnGenericas';

@Component({
  selector: 'app-param-form',
  templateUrl: './param-form.component.html',
  styleUrls: ['./param-form.component.css']
})
export class ParamFormComponent {
  FormParam;
  titlebGoE ="Guardar";
  @Input() modelEditar: object;
  EsEdicion = false;
  @ViewChild('FormP', {static: false}) FormP: NgForm;
  
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    this.FormParam = fb.group({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      inactive: new FormControl(false, Validators.required)
    });
      
  }

  ngOnInit(): void {
    if(this.modelEditar != undefined){
      this.EsEdicion = true;
      this.titlebGoE = "Editar"
      this.servicio.SendGetWOutPObsHeaderAut('parameters/'+(this.modelEditar as ParamModelReq).id).then((rta: any) => {
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
              let dataform: ParamModelRes = rta.data;
              dataform.inactive = rta.data.inactive == "true" ? true : false;
              //console.log(dataform);
              this.FormParam.setValue(dataform);
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

  GuardarEditarParam(result:any):void{
    this.pGuardarEditarParam(this.EsEdicion, ((this.EsEdicion ? "Editar " : "Registrar ") +  "Parámetro"));
  }

  private pGuardarEditarParam(_edicion: boolean, _title:string)
  {
    if(this.FormParam.valid)
    {
      let dataform: ParamModelReq = this.FormParam.value;
      dataform.inactive = (this.FormParam.get("inactive")!.value == false ? "false" : "true");
      //this.FormParam.get("inactive")?.setValue(this.FormUser.get("inactive")!.value == false).toString());
      // this.FormParam.value.inactive == true ? "true" : "false"
      Swal.fire({
        title: _title,
        text: "¿Desea " + (_edicion ? "editar" : "guardar") + " el parámetro?",
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
              this.servicio.SendPOSTWParamObs('parameters/', dataform, true).then((rta: ResponseM2) => {
                // Swal.fire( rta.success ? "Registro Guardado" : rta.error == '01' ? "Error de registro" : "Advertencia", rta.message, rta.success ? "success" : rta.error == '01' ? 'warning' : 'error');
                Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                if(rta.success)
                {
                  this.clearForm();
                }
              });
            }
            else{
              this.servicio.SendPUTWParamObs('parameters/' +this.FormParam.get("id")?.value, dataform, true).then((rta: ResponseM2) => {
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
            Swal.fire("Error al guardar o editar parámetro", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });
    }
  }

  private clearForm(){
    this.FormP.resetForm();
    this.FormParam.controls["id"]?.setValue(0);
    this.FormParam.controls["inactive"]?.setValue(false);
  }

}
