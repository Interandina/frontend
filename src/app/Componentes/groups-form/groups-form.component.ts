import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { GruposModel, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { CompositeMensajeFields } from '../functions/FnGenericas';

@Component({
  selector: 'app-groups-form',
  templateUrl: './groups-form.component.html',
  styleUrls: ['./groups-form.component.css']
})
export class GroupsFormComponent {
  FormGrupo;
  titlebGoE ="Guardar";
  formatDecimal:string ="[0-9]?[0-9]?(\.[0-9][0-9]?)?";
  @Input() modelEditar: object;
  EsEdicion = false;
  @ViewChild('FormGru', {static: false}) FormGru: NgForm;
  tarifas:any[]=[];
  
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    this.FormGrupo = fb.group({
      id: new FormControl(0),
      tag: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      taxId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    //No borrar para recuperar grupos y tipos de tarifas
    this.servicio.SendGetWOutPObsHeaderAut('taxes/').then((rta: any) => {
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
            this.tarifas = rta.data;
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
      this.FormGrupo.controls['tag'].disable();
      this.titlebGoE = "Editar"
      this.servicio.SendGetWOutPObsHeaderAut('groups/'+(this.modelEditar as GruposModel).id).then((rta: any) => {
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
              //console.log(rta);
              let modelo: GruposModel = { 
                id: rta.data.id,
                tag: rta.data.tag,
                description: rta.data.description,
                taxId: rta.data.taxId
              };
              this.FormGrupo.setValue(modelo);
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

  GuardarEditarGrupo(result:any):void{
    this.pGuardarEditarGrupo(this.EsEdicion, ((this.EsEdicion ? "Editar " : "Registrar ") +  "Grupo"));
  }

  private pGuardarEditarGrupo(_edicion: boolean, _title:string)
  {
    if(this.FormGrupo.valid)
    {
      if(this.FormGrupo.get("taxId")!.value == "0")
        Swal.fire("Campo requerido", "Campo tipo de tarifa del grupo es obligatorio!", "warning");
      else
      {
        Swal.fire({
          title: _title,
          text: "¿Desea " + (_edicion ? "editar" : "guardar") + " el grupo?",
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
                this.servicio.SendPOSTWParamObs('groups/', this.FormGrupo.value, true).then((rta: ResponseM2) => {
                  Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                  if(rta.success)
                  {
                    this.clearForm();
                  }
                });
              }
              else{
                this.servicio.SendPUTWParamObs('groups/' +this.FormGrupo.get("id")?.value, this.FormGrupo.value, true).then((rta: ResponseM2) => {
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
              Swal.fire("Error al guardar o editar el grupo", "Ha ocurrido un error inesperado!", "error");
            }
          } 
        });
      }
    }
  }

  private clearForm(){
    this.FormGru.resetForm();
    this.FormGrupo.controls["id"]?.setValue(0);
  }
}
