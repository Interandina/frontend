import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { DocAnexosDetailsModel, DocAnexosModel, DocAnexosSaveModel, ModelEditar, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { CompositeMensajeFields, RemoveAccents } from '../functions/FnGenericas';
import { MatSelectionListChange } from '@angular/material/list';
import { __values } from 'tslib';
import { MatTableDataSource } from '@angular/material/table';
//MatCheckboxChange

@Component({
  selector: 'app-docanexos-form',
  templateUrl: './docanexos-form.component.html',
  styleUrls: ['./docanexos-form.component.css']
})
export class DocanexosFormComponent implements OnInit {
  // FormTiposEmpresas;
  FormTipEmpDet;
  //Details: DocAnexosDetailsModel[]=[];
  titlebGoE ="Guardar";
  //@Input() modelEditar: object;
  @Input() titledoc: string;
  EsEdicion = "";
  OcultarDT = false;
  dataSource = new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  @ViewChild('FormTipEmp', {static: false}) FormTipEmp: NgForm;
  @ViewChild('_FormTipEmpDet', {static: false}) _FormTipEmpDet: NgForm;
  
  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    // this.LoadForm();
    // this.LoadFormDet();
    // this.FormTiposEmpresas = fb.group({
    //   id: new FormControl(0),
    //   tag: new FormControl('', Validators.required),
    //   description: new FormControl('', Validators.required),
    //   inactive: new FormControl(false, Validators.required),
    //   type: new FormControl('Hoja de Vida'),
    //   details: []
    //   //Array<DocAnexosDetailsModel>(null)
    //   //this.fb.array(DocAnexosDetailsModel[]),
    //   //[DocAnexosDetailsModel]
    // });

    this.FormTipEmpDet =  fb.group({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      shortname: new FormControl(''),
      msjhelp: new FormControl(''),
      expireat: new FormControl(0, [Validators.minLength(1)]),
      inactive: new FormControl(false, Validators.required),
      operationtype: new FormControl('G', Validators.required),
      assignto: new FormControl('', Validators.required),
      tocompany:new FormControl('Andina'),
      fileid: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

      // this.servicio.SendGetWOutPObsHeaderAut('settingsdocsatt/G'+(this.modelEditar as DocAnexosModel).id).then((rta: any) => {
      this.servicio.SendGETWParamObs('settingsdocsatt/', JSON.stringify("{'operationtype': 1}")).then((rta: any) => {  
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
              // this.FormTiposEmpresas.setValue(rta.data);
              this.dataSource = rta.data
              this.dataColumns = rta.columns;
              this.displayedColumns = rta.columns.map((col:any)=>col.name);
              // this.FormTiposEmpresas.controls['tag'].disable();
              //if(rta.data.type == null)
                // this.FormTiposEmpresas.controls['type']?.setValue("Hoja de Vida");
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

  // AddDetalle(result:any):void{
  //   if(this.FormTipEmpDet.valid)
  //   {
  //     if((document.getElementById('chkFecVen-input') as HTMLInputElement).checked && (this.FormTipEmpDet.controls["expireat"].value as number) <= 0)
  //       Swal.fire("Advertencia", "Los días de vencimiento del documento no puede ser menor o igual a cero!", 'warning');
  //     else if(!this.EsEdicion && this.Details.some(n => RemoveAccents(n.name).toLocaleLowerCase() == RemoveAccents(this.FormTipEmpDet.controls["name"].value).toLocaleLowerCase()))
  //       Swal.fire("Advertencia", "No se puede agregar al detalle un documento con el mismo nombre de un documento anterior, el nombre de un documento debe ser único!", 'warning');
  //     else
  //     {
  //       if(this.EsEdicion)
  //       {
  //           //Eliminar el ítem editado y ingresar el mismo ítem con los cambios
  //           this.FormTipEmpDet.controls['name'].enable();
  //           //console.log(this.FormTipEmpDet.controls["name"].value);
  //           if(this.Details.findIndex(i => i.name == this.FormTipEmpDet.controls["name"].value) >= 0)
  //             this.Details.splice(this.Details.findIndex(i => i.name == this.FormTipEmpDet.controls["name"].value), 1);
  //       }
  //       this.Details.push(<DocAnexosDetailsModel>this.FormTipEmpDet.value);
  //       this.clearFormDet();
  //       //console.log(this.Details);
  //     }
  //   }
  // }

  GuardarEditarDocAnexos(result:any){
    if(this.FormTipEmpDet.valid)
    {
      if((document.getElementById('chkFecVen-input') as HTMLInputElement).checked && (this.FormTipEmpDet.controls["expireat"].value as number) <= 0)
        Swal.fire("Advertencia", "Los días de vencimiento del documento no puede ser menor o igual a cero!", 'warning');
      else
      {
        this.EsEdicion  = (this.FormTipEmpDet.controls["id"].value != null ? "Editar" : "Guardar")
        Swal.fire({
          title: (this.EsEdicion + " Documento General"),
          text: "¿Desea " + this.EsEdicion.toLowerCase() + " el documento general?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: this.EsEdicion,
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              if(this.EsEdicion == "Guardar")
              {
                this.servicio.SendPOSTWParamObs('settingsdocsatt/', this.FormTipEmpDet.value, true).then((rta: ResponseM2) => {
                  Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                  if(rta.success)
                  {
                    this.clearFormDet(rta.data);
                  }
                });
              }
              else{
                this.servicio.SendPUTWParamObs('settingsdocsatt/' + this.FormTipEmpDet.controls["id"].value, this.FormTipEmpDet.value, true).then((rta: ResponseM2) => {
                  Swal.fire(rta.success ? "Registro Editado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                  if(rta.success)
                  {
                    this.clearFormDet(rta.data);
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

  // GuardarEditarTipoEmp(result:any):void{
  //   this.pGuardarEditarTipoEmp(this.EsEdicion, ((this.EsEdicion ? "Editar " : "Registrar ") +  "Tipo de documento"));
  // }

  // private pGuardarEditarTipoEmp(_edicion: boolean, _title:string)
  // {
  //   if(this.FormTiposEmpresas.valid && this.Details.length > 0)
  //   {
  //     Swal.fire({
  //       title: _title,
  //       text: "¿Desea " + (_edicion ? "editar" : "guardar") + " el tipo de documento?",
  //       showCancelButton: true,
  //       cancelButtonText:'Cancelar',
  //       confirmButtonText: (_edicion ? 'Editar' : 'Guardar'),
  //       confirmButtonColor: '#2780e3',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         try
  //         {
  //           //console.log(this.FormTiposEmpresas.value);
  //           this.FormTiposEmpresas.controls["details"].setValue(this.Details);
  //           if(!_edicion)
  //           {
  //             this.servicio.SendPOSTWParamObs('settingsdocsatt/', this.FormTiposEmpresas.value, true).then((rta: ResponseM2) => {
  //               Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
  //               if(rta.success)
  //               {
  //                 this.clearForm();
  //                 this.clearFormDet();
  //               }
  //             });
  //           }
  //           else{
  //             //console.log(this.FormTiposEmpresas.value);
  //             this.FormTiposEmpresas.controls['tag'].enable();
  //             this.servicio.SendPUTWParamObs('settingsdocsatt/' +this.FormTiposEmpresas.get("id")?.value, this.FormTiposEmpresas.value, true).then((rta: ResponseM2) => {
  //               if(rta.success)
  //               {
  //                 this.clearForm();
  //                 this.clearFormDet();
  //                 Swal.fire({
  //                   title: (rta.success ? "Registro Editado" :"Error de  Edición"),
  //                   text: rta.message,
  //                   showCancelButton: false,
  //                   cancelButtonText:'Cancelar',
  //                   confirmButtonText: 'OK',
  //                   confirmButtonColor: '#2780e3',
  //                 }).then((resultado) => {
  //                   if (resultado.isConfirmed) {
  //                     document.getElementById("btnClose")?.click();
  //                   }
  //                 });
  //               }
  //             });
  //           }
  //         }
  //         catch{
  //           Swal.fire("Error al guardar o editar usuario", "Ha ocurrido un error inesperado!", "error");
  //         }
  //       } 
  //     });
  //   }
  //   else
  //     Swal.fire("Advertencia", "No se puede guardar el documento, no se han diligenciado los datos o no existe al menos un documento anexo!", "warning");
  // }


  private clearFormDet(data: any){
    this._FormTipEmpDet.resetForm();
    this.LoadDefValuesFormDet();
    if(data)
    {
      this.dataSource = null;
      this.dataSource =data;
    }
  }

  // private LoadDefValuesForm(){
  //   //this.FormTiposEmpresas.controls["id"]?.setValue(0);
  //   //this.FormTiposEmpresas.controls["inactive"]?.setValue(false);
  // }
  EditarRow(row: any){
    this.FormTipEmpDet.setValue({id: row.row.id, name: row.row.name, shortname: row.row.shortname, msjhelp: row.row.msjhelp, expireat: row.row.expireat, inactive: row.row.inactive, operationtype: row.row.operationtype, assignto: row.row.assignto, tocompany: row.row.tocompany, fileid: row.row.fileid});
    this.checkValueFV(row.row.expireat > 0 ? true : false);
    (document.getElementById('chkFecVen-input') as HTMLInputElement).checked = row.row.expireat > 0 ? true : false;
  }

  private LoadDefValuesFormDet(){
    //this.FormTipEmpDet.controls["id"]?.setValue(0);
    this.FormTipEmpDet.controls["shortname"]?.setValue('');
    this.FormTipEmpDet.controls["inactive"]?.setValue(false);
    this.FormTipEmpDet.controls["expireat"]?.setValue(0);
    this.FormTipEmpDet.controls["tocompany"]?.setValue('Andina');
    this.FormTipEmpDet.controls["operationtype"]?.setValue('G');
    // console.log((document.getElementById('chkFecVen-input') as HTMLElement));
    (document.getElementById('chkFecVen-input') as HTMLInputElement).checked = false;
    this.checkValueFV((document.getElementById('chkFecVen-input') as HTMLInputElement).checked);
  }

  checkValueFV(Estado:boolean):void {   
    this.OcultarDT = Estado;
    if(Estado) 
      this.FormTipEmpDet.controls["expireat"].setValidators(Validators.required);      
    else
      this.FormTipEmpDet.controls["expireat"].clearValidators();
    this.FormTipEmpDet.get('expireat').updateValueAndValidity();
  }

  // onClickMList(option: MatSelectionListChange){
  //   //console.log(option.options[0].selected);
  //   //console.log(option.options[0].value);
  //   if(this.EsEdicion && option.options[0].selected)
  //   {
  //     let item: DocAnexosDetailsModel = this.Details.filter(i => i.name == option.options[0].value)[0];
  //     //console.log(item);
  //     this.FormTipEmpDet.controls['name'].disable();
  //     this.FormTipEmpDet.controls["id"]?.setValue(item.id);
  //     this.FormTipEmpDet.controls["name"]?.setValue(item.name);
  //     this.FormTipEmpDet.controls["inactive"]?.setValue(item.inactive);
  //     this.FormTipEmpDet.controls["msjhelp"]?.setValue(item.msjhelp);
  //     if(item.expireat > 0)
  //     {
  //       //console.log(item.expireat);
  //       this.FormTipEmpDet.controls["expireat"]?.setValue(item.expireat);
  //       (document.getElementById('chkFecVen-input') as HTMLInputElement).checked = true;
  //       this.checkValueFV(true);
  //     }
  //     option.options[0].selected = false;
  //   }
  //   else
  //   {
  //     if(option.options[0].selected)
  //       this.Details.splice(this.Details.findIndex(i => i.name == this.FormTipEmpDet.controls["name"].value), 1);
  //   }
  // }
}