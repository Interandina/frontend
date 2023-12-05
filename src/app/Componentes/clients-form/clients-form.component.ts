import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators, FormGroup } from '@angular/forms';
import { ServicesComponent } from 'src/app/Services';
import { ClientModel, ModelEditar, PassModelBotonGrid, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { CompositeMensajeFields, StringIsNullOrEmpty, ValidateFieldsForm } from '../functions/FnGenericas';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.css']
})
export class ClientsFormComponent {
  FormClient;
  @ViewChild('FormCli', {static: false}) FormCli: NgForm;
  @ViewChild('chkFecVen', {static: false}) chkFecVen: Element;
  FormClientDocs;
  titlebGoE ="Guardar";
  formatDecimal:string ="[0-9]?[0-9]?(\.[0-9][0-9]?)?";
  //@Input() modelEditar: object;
  EsEdicion = false;
  @ViewChild('_FormClientDocs', {static: false}) _FormClientDocs: NgForm;
  tarifas:any[]=[];
  grupos:any[]=[];
  dataSourceDocs = new MatTableDataSource();
  dataColumnsDocs: any[];
  displayedColumnsDocs: string[];
  modelEditarDocs: ModelEditar;
  OcultarDT = false;
  //Listado
  MostrapnlLis = true;
  dataSourceL = new MatTableDataSource();
  dataColumnsL: any[];
  displayedColumnsL: string[];
  modelEditarL: ModelEditar;
  callbackEditarL: Function;
  selectedIndexTab: number = 0;
  EsEdicionDocs = '';
  bankFiles: any[];
  filteredOptionsBankFiles: Observable<any[]>;
  myControlFile = new FormControl<any>({id: '', name: ''}, Validators.required);
  MostrarSpinner = false;

  constructor(private servicio: ServicesComponent, private fb: FormBuilder){
    this.FormClient = fb.group({
      id: new FormControl(0),
      document: new FormControl('', Validators.required),
      nameenterprise: new FormControl('', Validators.required),
      shortname: new FormControl(''),
      accountable: new FormControl('', Validators.required),
      email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      inactive: new FormControl(false, Validators.required),
      taxId: new FormControl(0),
      groupId: new FormControl(0),
      tocompany: new FormControl('Andina'),
      files: new FormControl([])
      //docattachmentId: new FormControl(0)
    });

    this.FormClientDocs =  fb.group({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      shortname: new FormControl(''),
      msjhelp: new FormControl(''),
      expireat: new FormControl(0, [Validators.minLength(1)]),
      inactive: new FormControl(false, Validators.required),
      operationtype: new FormControl('G', Validators.required),
      assignto: new FormControl('', Validators.required),
      tocompany:new FormControl('Andina'),
      fileid: new FormControl(null),
      controleditar:new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.modelEditarL = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false
    };

    this.modelEditarDocs = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true
    };

    this.LoadClientesIni();

    //No borrar para recuperar grupos y tipos de tarifas
    this.servicio.SendGetWOutPObsHeaderAut('clients/joins/').then((rta: any) => {
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
            this.tarifas = rta.data.taxes;
            this.grupos = rta.data.groups;
            //Se debe armar la estructura de la grilla para si el cliente es nuevo, permita agregar documentos
            rta.data.tableFiles.push({name: "acciones", title: "Acción", display: true});
            this.dataColumnsDocs = rta.data.tableFiles;
            this.displayedColumnsDocs = rta.data.tableFiles.map((col:any)=>col.name);
            this.bankFiles = rta.data.bankfiles;
            // this.FormClientDocs.controls['name'].valueChanges.pipe(
            this.filteredOptionsBankFiles = this.myControlFile.valueChanges.pipe(
              startWith(''),
              map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filterFile(name as string) : this.bankFiles.slice();
              }),
            );
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

  private _filterFile(value: string): any[] {
    //Segundo evento que se ejecuta después de displayFnDpto
    const filterValue = value.toLowerCase();
    let items = this.bankFiles.filter(op => op.name.toString().toLowerCase().includes(filterValue));
    if(items.length == 1)
    {
      this.FormClientDocs.controls['name'].setValue(items[0].name);
      this.FormClientDocs.controls["msjhelp"].setValue(items[0].helpfile);
      this.FormClientDocs.controls['fileid'].setValue(items[0].id);
    }
    return items;
  }

  displayFnFile(file: any): string {
    //Primer evento que se ejecuta
    return file && file.name ? file.name : '';
  }


  private LoadClientesIni()
  {
    this.servicio.SendGetWOutPObsHeaderAut('clients/').then((rta: any) => {
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
            rta.data.forEach((i: any) => {
              i.acciones = [{icon: "border_color", title:"Clic para editar esta fila", indice: 1},{icon: "forward_to_inbox", title:"Clic para enviar de nuevo correo de recuperación de contraseña", indice: 2},{icon: "add_chart", title:"Clic para crear una nueva novedad.", indice: 3}]
            });
            rta.columns.push({name: "acciones", title: "Acciones", display: true});
            this.dataSourceL = new MatTableDataSource(rta.data);
            this.dataColumnsL = rta.columns;
            this.displayedColumnsL = rta.columns.map((col:any)=>col.name);

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

  GuardarEditarCliente(result:any):void{
    this.pGuardarEditarCliente(this.EsEdicion, ((this.EsEdicion ? "Editar " : "Registrar ") +  "Cliente"));
  }

  private pGuardarEditarCliente(_edicion: boolean, _title:string)
  {
    if(this.FormClient.valid)
    {
      // if(this.FormClient.get("taxId")!.value == 0 || this.FormClient.get("groupId")!.value == 0)
      //   Swal.fire("Campo(s) requerido", ("Campo(s) " + (this.FormClient.get("taxId")!.value == 0 && this.FormClient.get("groupId")!.value == 0 ? "tipo de tarifa y grupo del cliente son obligatorios!" : this.FormClient.get("taxId")!.value == 0 ? "tipo de tarifa es obligatorio!" : "grupo del cliente es obligatorio!" )), "warning");
      // else
      // {
      this.FormClient.controls["taxId"]?.setValue(this.FormClient.get("taxId")!.value == 0 ? null : this.FormClient.get("taxId")!.value); 
      this.FormClient.controls["groupId"]?.setValue(this.FormClient.get("groupId")!.value == 0 ? null : this.FormClient.get("groupId")!.value);
      //this.FormClient.controls["docattachmentId"]?.setValue(this.FormClient.get("docattachmentId")!.value == 0 ? null : this.FormClient.get("docattachmentId")!.value);

      Swal.fire({
        title: _title,
        text: "¿Desea " + (_edicion ? "editar" : "guardar") + " el cliente?",
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
              //Se adiciona los documentos que tenga el cliente
              this.AgregarDocsParaGuardar();
              this.servicio.SendPOSTWParamObs('clients/', this.FormClient.value, true).then((rta: ResponseM2) => {
                Swal.fire(rta.success ? "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                if(rta.success)
                {
                  this.clearForm();
                }
              });
            }
            else{
              //console.log(this.FormClient.value);
              this.FormClient.controls['document'].enable();
              this.servicio.SendPUTWParamObs('clients/' + this.FormClient.get("id")?.value, this.FormClient.value, true).then((rta: ResponseM2) => {
                if(rta.success)
                {
                  Swal.fire(rta.success ? "Registro Editado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" :  'warning');
                  //this.clearForm();
                  this.backListado();
                  //document.getElementById("btnClose")?.click();
                }
              });
            }
          }
          catch (err){
            console.log(err)
            Swal.fire("Error al guardar o editar el cliente", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });
      //}
    }
  }

  clearForm(){
    this.FormCli.resetForm();
    this.FormClient.controls["id"]?.setValue(0);
    this.FormClient.controls["inactive"]?.setValue(false);
    this.FormClient.controls["tocompany"]?.setValue('Andina');
    this.EsEdicion = false;
    this.titlebGoE ="Guardar";
    this.FormClient.controls['document'].enable();
    this.selectedIndexTab = 0;
    this.clearFormDocs();
    //NO mover al método de documentos porque cuando guarda un detalle invoca el método clearFormDocs y 
    //se perdería lo q se lleve en el detalle de documentos.
    this.dataSourceDocs = new MatTableDataSource();;
    this.MostrapnlLis = true;
    this.LoadClientesIni();
  }

  clearFormDocs()
  {
    this.FormClientDocs.reset();
    //(document.getElementById('chkFecVen-input') as HTMLInputElement).checked = false;
    (this.chkFecVen as HTMLInputElement).checked = false;
    this.checkValueFV(false);
    this.FormClientDocs.controls["shortname"]?.setValue('');
    this.FormClientDocs.controls["expireat"]?.setValue(0);
    this.FormClientDocs.controls["operationtype"]?.setValue('G');
    this.FormClientDocs.controls["tocompany"]?.setValue('Andina');
    this.FormClientDocs.controls["inactive"]?.setValue(false);
    this.myControlFile.setValue(null);
  }

  // GuardarEditarDocsCli(){
    GuardarEditarDocsCli(result:any){
    if(this.myControlFile.value == undefined)
      Swal.fire("Campo Obligatorio", "El campo nombre del documento es obligatorio!", "warning");
    else
    {
      if(this.FormClientDocs.controls["fileid"].value == undefined && this.FormClientDocs.controls["fileid"].value == null)
        this.FormClientDocs.controls["name"].setValue(this.myControlFile.value);

      if(this.FormClientDocs.valid)
      {
        let row: any = this.FormClientDocs.value;
        //Si es editar debe eliminar el row editado
        if(row.controleditar != null)
          this.EliminarFilaDoc({row: row.controleditar, verPadre: false});

        row.controleditar = null;
        row.acciones = ["delete_forever", "clic para eliminar esta fila"];
        this.dataSourceDocs.data.push(row);
        this.dataSourceDocs._updateChangeSubscription();
        // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
        this.clearFormDocs();
      }
      else
        ValidateFieldsForm(this.FormClientDocs);
    }
  }

  GuardarEditarDocsCliBack(){
    if(!this.FormClient.valid)
      Swal.fire("Advertencia", "Se debe establecer un cliente para poder guardar o editar los documentos!", "warning");
    else if(this.dataSourceDocs.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún documento al detalle de documentos del cliente para poder guardar o editar!", "warning");
    else{
      this.EsEdicionDocs = this.dataSourceDocs.data.some((i: any) => !StringIsNullOrEmpty(i.id)) ||  this.FormClient.controls["id"]?.value != 0 ? "Editar" : "Guardar";
      this.AgregarDocsParaGuardar();
      this.pGuardarEditarCliente((this.EsEdicionDocs == "Editar" ? true : false), (this.EsEdicionDocs +  " Documentos del Cliente")); 
    }
  }

  private AgregarDocsParaGuardar()
  {
    let modelo = this.dataSourceDocs.data.map(function(obj:any){
      return {id: obj.id, name: obj.name, shortname: obj.shortname, msjhelp: obj.msjhelp, expireat: obj.expireat, inactive: obj.inactive, operationtype: obj.operationtype, assignto: obj.assignto, tocompany: obj.tocompany, fileid: obj.fileid}
    });
    this.FormClient.controls["files"]?.setValue(modelo);
  }
  EditarRow(row: any){
    // console.log(row);
    this.FormClientDocs.setValue({id: row.row.id, name: row.row.name, shortname: row.row.shortname ,msjhelp: row.row.msjhelp, expireat: row.row.expireat, inactive: row.row.inactive, operationtype: 'G', assignto: row.row.assignto, tocompany: 'Andina', fileid: row.row.fileid, controleditar: row.row});
    this.LoadAutocomplete(row.row);
    this.checkValueFV(row.row.expireat > 0 ? true : false);
    // (document.getElementById('chkFecVen-input') as HTMLInputElement).checked = row.row.expireat > 0 ? true : false;
    (this.chkFecVen as HTMLInputElement).checked = row.row.expireat > 0 ? true : false;
  }

  LoadAutocomplete(value: any) {
    this.myControlFile.setValue({"id": value.fileid, "name": value.name});
  }

  EliminarFilaDoc(objetoEnviado: PassModelBotonGrid){
    // console.log(objetoEnviado);
    let index = this.dataSourceDocs.data.indexOf(objetoEnviado.row);
    this.dataSourceDocs.data.splice(index, 1);
    this.dataSourceDocs._updateChangeSubscription();
  }

  private ReloadGridDocs(data:any)
  {
    let dataAccion = data;
    dataAccion.forEach((i: any)=>{
      i.acciones = ["delete_forever", "clic para eliminar esta fila"],
      i.controleditar = null
    });
    this.dataSourceDocs = null;
    this.dataSourceDocs = new MatTableDataSource(dataAccion);
  }
  
  checkValueFV(Estado:boolean):void {   
    this.OcultarDT = Estado;
    if(Estado) 
      this.FormClientDocs.controls["expireat"].setValidators(Validators.required);      
    else
      this.FormClientDocs.controls["expireat"].clearValidators();
    this.FormClientDocs.get('expireat').updateValueAndValidity();
  }

  //#region Listado
  EditarRowLCliente(row: any){
    switch(row.indice)
    {
      case 1:
        this.LoadCliente(row.row.id);
        this.selectedIndexTab = 0;
        this.MostrapnlLis = false;  
      break;
      case 2:
        this.SendEmailClient(row.row)
        break;
      case 3:
        this.NewLifeSheet(row.row)
      break;
    }

  }

  NewLifeSheet(row: any)
  {
    Swal.fire({
      title: "Crear una nueva novedad sobre la hoja de vida",
      text: "¿Se creará una nueva hoja de vida. ¿Está seguro que desea continuar?",
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#2780e3',
    }).then((result) => {
      if (result.isConfirmed) {
        try
        {
          this.MostrarSpinner = true;
          this.servicio.SendPOSTObsWHeader('clients/newLifeSheet/' + row.id).then((rta: any) => {
            this.MostrarSpinner = false;
            if(rta == undefined)
              Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
            else
              Swal.fire(rta.success ? "Correo Enviado" : "Advertencia", (rta.success ? rta.message + ".<br>El cliente " + row.nameenterprise +" ha sido notificado.": ""), rta.success ? "success": "warning");
          });
        }
        catch(exception){
          this.MostrarSpinner = false;
          Swal.fire("Error", exception.toString(), "error");
          console.log('Ha ocurrido un error inesperado. Motivo:', exception);           
          throw exception;
        }
      }
    });

  }

  LoadCliente(id:number){
    this.EsEdicion = true;
    //this.FormClient.controls['email'].disable();
    //this.FormClient.controls['document'].disable();
    this.titlebGoE = "Editar"
    this.servicio.SendGetWOutPObsHeaderAut('clients/' + id).then((rta: any) => {
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
            this.FormClient.setValue(rta.data);
            this.ReloadGridDocs(rta.data.files);
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

  SendEmailClient(row:any){
    Swal.fire({
      title: "Enviar Correo de Recuperación de Contraseña",
      text: "¿Está seguro que desea enviar un correo de recuperación de contraseña al cliente " + row.nameenterprise + "?",
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#2780e3',
    }).then((result) => {
      if (result.isConfirmed) {
        try
        {
          this.MostrarSpinner = true;
          this.servicio.SendPOSTObsWHeader('clients/notificationClient/' + row.id).then((rta: any) => {
            this.MostrarSpinner = false;
            if(rta == undefined)
              Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
            else
              Swal.fire(rta.success ? "Correo Enviado" : "Advertencia", (rta.success ? rta.message + ".<br>El cliente " + row.nameenterprise +" ha sido notificado.": ""), rta.success ? "success": "warning");
          });
        }
        catch(exception){
          this.MostrarSpinner = false;
          Swal.fire("Error", exception.toString(), "error");
          console.log('Ha ocurrido un error inesperado. Motivo:', exception);           
          throw exception;
        }
      }
    });
  }
  //#endregion

  backListado(){
    this.MostrapnlLis = true;
    this.clearForm();
    //Ya se carga en el clear;
    //this.LoadClientesIni();
  }

  AddCliente(){
    //this.clearForm();
    this.MostrapnlLis = false;
  }
}
