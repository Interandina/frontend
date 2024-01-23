//import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort, MatSortable } from '@angular/material/sort';
import { ServicesComponent } from 'src/app/Services';
import { StringIsNullOrEmpty } from '../functions/FnGenericas';
import { AccionesBotonesTableEdit, objetosComponenteAutoComplete, objetosTableEditable, respuestaAutocomplete } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
//import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
//Para sobrecargar el método
//import { MatFormFieldAppearance as BaseMatFormFieldAppearance} from '@angular/material/form-field';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  // providers: [
  //   {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  // ]
})
export class CalendarComponent implements OnInit{
  FrmCalendar: FormGroup = null;
  FrmCalendarLis: FormGroup;
  FrmCalendarGrid: FormGroup;
  currentDate = new Date();
  branches: any[] = [];
  operations: any[] = [];
  pestanaSeleccionada = 'pestana1';
  objetosComponenteAutoCompleteR: objetosComponenteAutoComplete = {LabelAuto: "Responsable", PlaceHolderAuto: "un responsable", ListaOpcionesAuto: null, titleAuto: "Responsable (Coordinador)", FrmAuto: null, nombrecampoModelo: "responsable"};
  objetosComponenteAutoCompleteC: objetosComponenteAutoComplete = {LabelAuto: "Cliente", PlaceHolderAuto: "un cliente", ListaOpcionesAuto: null, titleAuto: "Asignar cliente", FrmAuto: null, nombrecampoModelo: "cliente"};
  objetosTableEdit: objetosTableEditable = {
    dataSource: null,
    displayedColumns: ['consecutivo', 'idresponsable', 'responsable', 'cliente', 'producto', 'fechaprod', 'action'],
    // {name: "action", title: "Acciones", display: true, editable: true}
    dataColumns: [{name: "consecutivo", title: "Consecutivo", display: true, editable: false, tipoelemento: "inputtexto" }, {name: "idresponsable", title: "idresponsable", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "responsable", title: "Responsable", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "idcliente", title: "idcliente", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "cliente", title: "Cliente", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "producto", title: "Producto", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "fechaprod", title: "Fecha ETA", display: true, editable: false, tipoelemento: "inputtexto" }, {name: "controleditar", title: "controleditar", display: false, editable: false, tipoelemento: "inputtexto"}],
    Formulario: null,
    botonesEventos: [{name: AccionesBotonesTableEdit.Save, visible: false}, {name: AccionesBotonesTableEdit.Cancel, visible: false}, {name: AccionesBotonesTableEdit.Edit, visible: true}, {name: AccionesBotonesTableEdit.Delete, visible: false}]
  };

  constructor(private fb: FormBuilder, private fbg: FormBuilder, private servicio: ServicesComponent){
    //type MyCustomAppearance = "none";
    //type MatFormFieldAppearance = BaseMatFormFieldAppearance | MyCustomAppearance;
  }

  ngOnInit(): void {
    this.FrmCalendar = this.fb.group({
      tipoOper:[null, Validators.required],
      sucursal:[null, Validators.required],
      consecutivo:[{ value: null, disabled: true }, Validators.required],
      consecutivoreal:['0', Validators.required],
      fechapro:[new Date(), Validators.required],
      responsable:[null, Validators.required],
      cliente:[null, Validators.required],
      producto:[null, Validators.required],
      registros:[1, [Validators.required, Validators.min(1)]]
    });

    this.FrmCalendarLis = this.fb.group({
      fechaInicio:[new Date(), null],
      fechaFin:[new Date(), null]
    });

    this.FrmCalendarGrid = this.fbg.group({
      FrmRows: this.fbg.array([])
    });

    this.objetosTableEdit.Formulario = this.FrmCalendarGrid

    this.servicio.SendGetWOutPObsHeaderAut('system/parameters_dailyprogrammer/').then((rta: any) => {
      //console.log(rta);
      this.branches = rta.data.branches;
      this.operations = rta.data.operations;
      //No mover por la asignación del FRM
      this.objetosComponenteAutoCompleteR.ListaOpcionesAuto = rta.data?.users.map((item: any) => { return {id: item.id, name: item.first_name + " " + item.last_name}});;
      this.objetosComponenteAutoCompleteR.FrmAuto = this.FrmCalendar;
      this.objetosComponenteAutoCompleteC.ListaOpcionesAuto = rta.data?.clients.map((item: any) => { return {id: item.document, name: item.nameenterprise}});
      //rta.data.clients;
      //rta.data?.clients.map((item: any) => { return {id: item.document, name: item.nameenterprise}});
      // const newArray =  this.objetosComponenteAutoCompleteC.ListaOpcionesAuto = 
      // const newArray = arrayOrigen.map(numero => {
      //  return { valor: numero };
      //});
      this.objetosComponenteAutoCompleteC.FrmAuto = this.FrmCalendar;
    });
  }

  HacerCalendario(result:any){
    if(this.FrmCalendar.valid)
    {
      for (let i = 1;  i <= this.FrmCalendar.controls['registros'].value;  i++)
      {
        const control = this.FrmCalendarGrid.get('FrmRows') as FormArray;
        control.insert(i, this.initiateFrmRows(this.ObtenerConsecutivo(i)));
        this.objetosTableEdit.dataSource = new MatTableDataSource(control.controls);
      }
      //console.log();
      this.objetosTableEdit.dataSource._updatePaginator(this.FrmCalendar.controls['registros'].value);
      this.objetosTableEdit.dataSource._updateChangeSubscription();
      this.LimpiarFormCal();
    }
    else
    {
      let valoresauto: string[]= [];
      if(StringIsNullOrEmpty(this.FrmCalendar.controls['cliente'].value))
        valoresauto.push('Campo cliente o id de cliente no puede ser nulo. Debe seleccionar un valor de la lista, no puede ser digitado!');
      if(StringIsNullOrEmpty(this.FrmCalendar.controls['responsable'].value))
        valoresauto.push('Campo responsable a o id de responsable no puede ser nulo. Debe seleccionar un valor de la lista, no puede ser digitado!');
      // if(StringIsNullOrEmpty(this.FrmCalendar.controls['cliente'].value))
      //   valoresauto.push('Campo cliente o id de cliente no puede ser nulo!\nDebe seleccionar un valor de la lista, no puede ser digitado');
      if(valoresauto.length > 0)
          Swal.fire("Campos Obligatorios No Diligenciados", ("Se han encontrado campos sin diligenciar:"+ valoresauto.join("\n")), "warning");
    }
  }

  //#region Valores devueltos de autocomplete
  ObtenerValorAutocomplete(valorrespuestaauto: respuestaAutocomplete){
    //console.log((valorrespuestaauto.valor as any).id);
    this.FrmCalendar.controls[valorrespuestaauto.elemento].setValue((valorrespuestaauto.valor as any).id);
  }
  //#endregion

  private ObtenerConsecutivo(numeroregistro: number):string{
    let cons: number = parseInt(this.FrmCalendar.controls['consecutivo'].value) + numeroregistro;
    return  (this.FrmCalendar.controls['tipoOper'].value + cons + "-" + this.FrmCalendar.controls['sucursal'].value);
  }

  LimpiarFormCal(){
    this.FrmCalendar.reset();
    this.FrmCalendar.controls['tipoOper'].setValue(null);
    this.FrmCalendar.controls['sucursal'].setValue(null);
    this.FrmCalendar.controls['fechapro'].setValue(new Date());
    this.FrmCalendar.controls['registros'].setValue(1);
    this.FrmCalendar.controls['consecutivoreal'].setValue(0);
  }

  ListarCalendario(result:any){
    if(this.FrmCalendarLis.valid)
    {

    }
  }

  ObtenerConsecPorOperYSucu(){
    if(!StringIsNullOrEmpty(this.FrmCalendar.controls['tipoOper'].value) && !StringIsNullOrEmpty(this.FrmCalendar.controls['sucursal'].value))
    {
      // this.servicio.SendPOSTWParamObs('hv',{}, true).then((rta: any) => 
      // {
      // });
      this.FrmCalendar.controls['consecutivoreal'].setValue(20);
      this.FrmCalendar.controls['consecutivo'].setValue(20);
    }
  }

  seleccionarPestana(pestana: string) {
    this.pestanaSeleccionada = pestana;
  }

  initiateFrmRows(consecutivo: string): FormGroup {
    return this.fbg.group({
      consecutivo: new FormControl(consecutivo),
      responsable: new FormControl(this.FrmCalendar.controls['responsable'].value),
      cliente: new FormControl(this.FrmCalendar.controls['cliente'].value),
      producto: new FormControl(this.FrmCalendar.controls['producto'].value.toUpperCase()),
      fechaprod: new FormControl(this.FrmCalendar.controls['fechapro'].value),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
    });
  }
}
