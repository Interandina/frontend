//import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort, MatSortable } from '@angular/material/sort';
import { ServicesComponent } from 'src/app/Services';
import { ConvertDateTimeToString, ConvertStringDateTODateTime, ObtenerPrimerDiaMes, ObtenerUltimoDiaMes, StringIsNullOrEmpty } from '../functions/FnGenericas';
import { AccionesBotonesTableEdit, RespuestasFullCalendar, objetosComponenteAutoComplete, objetosTableEditable, respuestaAutocomplete } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Title } from '@angular/platform-browser';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatInputModule } from '@angular/material/input';
//import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
//Para sobrecargar el método
//import { MatFormFieldAppearance as BaseMatFormFieldAppearance} from '@angular/material/form-field';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
 // providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }]
  providers: [
    {
      provide: [STEPPER_GLOBAL_OPTIONS, NG_VALUE_ACCESSOR],
      useValue: {showError: true},
      
    },
    //{provide: LOCALE_ID, useValue: 'en-GB' }
    {provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    {provide: MAT_DATE_LOCALE, useValue: { useUtc: true }}
    //{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] }
  ]
  // providers: [{
  //   provide: MAT_DATE_FORMATS,
  //   useValue: {
  //     parse: {
  //       dateInput: 'LL',
  //     },
  //     display: {
  //       dateInput: 'LL',
  //       monthYearLabel: 'MMM YYYY',
  //       dateA11yLabel: 'LL',
  //       monthYearA11yLabel: 'MMMM YYYY',
  //     },
  //   }
  // }],
  // providers: [
  //   {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  // ]
})
export class CalendarComponent implements OnInit{
  FrmCalendar: FormGroup = null;
  FrmCalendarLis: FormGroup;
  FrmCalendarGrid: FormGroup;
  currentDate: Date = new Date();
  selectDate : Date | null;
  branches: any[] = [];
  operations: any[] = [];
  pestanaSeleccionada = 'pestana1';
  objetosComponenteAutoCompleteR: objetosComponenteAutoComplete = {LabelAuto: "Responsable", PlaceHolderAuto: "un responsable", ListaOpcionesAuto: null, titleAuto: "Responsable (Coordinador)", FrmAuto: null, nombrecampoModelo: "assignuser"};
  objetosComponenteAutoCompleteC: objetosComponenteAutoComplete = {LabelAuto: "Cliente", PlaceHolderAuto: "un cliente", ListaOpcionesAuto: null, titleAuto: "Asignar cliente", FrmAuto: null, nombrecampoModelo: "client"};
  objetosTableEdit: objetosTableEditable = {
    //dataSource: new MatTableDataSource<any>(),
    //, 'controleditar'
    displayedColumns: ['code', 'operationid', 'branchid', 'assignuserid', 'assignuser', 'client', 'clientid', 'products', 'dateestimated', 'action'],
    // displayedColumns: ['consecutivo', 'idresponsable', 'responsable', 'cliente', 'idcliente', 'producto', 'fechaprod'],
    // {name: "action", title: "Acciones", display: true, editable: true}
    //, {name: "controleditar", title: "controleditar", display: false, editable: false, tipoelemento: "inputtexto"}
    // dataColumns: [{name: "consecutivo", title: "Consecutivo", display: true, editable: false, tipoelemento: "inputtexto" }, {name: "idresponsable", title: "idresponsable", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "responsable", title: "Responsable", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "idcliente", title: "idcliente", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "cliente", title: "Cliente", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "producto", title: "Producto", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "fechaprod", title: "Fecha ETA", display: true, editable: false, tipoelemento: "inputtexto" }],
    dataColumns: [{name: "code", title: "Consecutivo", display: true, editable: false, tipoelemento: "inputtexto" }, {name: "operationid", title: "operationid", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "branchid", title: "branchid", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "assignuserid", title: "assignuserid", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "assignuser", title: "Responsable", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "clientid", title: "clientid", display: false, editable: false, tipoelemento: "inputtexto"}, {name: "client", title: "Cliente", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "products", title: "Producto", display: true, editable: false, tipoelemento: "inputtexto"}, {name: "dateestimated", title: "Fecha Estimada", display: true, editable: false, tipoelemento: "inputtexto" }],
    Formulario: null,
    botonesEventos: [{name: AccionesBotonesTableEdit.Save, visible: false}, {name: AccionesBotonesTableEdit.Cancel, visible: false}, {name: AccionesBotonesTableEdit.Edit, visible: true}, {name: AccionesBotonesTableEdit.Delete, visible: false}],
    editarEnFila: false
  };
  dataSource = new MatTableDataSource<any>();
  //Componente Fullcalendar
  URLEventos: string = 'imports/';
  Editable: boolean = false;
  Expandido:boolean = false;
  // calendarOptions = {
  //   timeZone: 'America/Bogota',
  //   initialView: 'dayGridMonth',
  //   //plugins: [dayGridPlugin],
  //   plugins: [dayGridPlugin, timeGridPlugin],
  //   locales: [esLocale],
  //   defaultAllDay: true,
  //   editable: this.Editable, //Aquí toca según usuario,
  //   dayMaxEventRows: 4,
  //   headerToolbar: {
  //   //   left: 'prev,next,today',
  //   //   center: 'title',
  //     right: 'prev,next'
  //   //   right: 'dayGridMonth'
  //   },
  //   nowIndicator: true,
  //   lazyFetching: true,
  //   //events: this.Eventos,
  //   customButtons:{
  //     next: { click: this.nextMonth.bind(this)},
  //     prev: { click: this.prevMonth.bind(this)}
  //   }
  //};
  
  constructor(private fb: FormBuilder, private fbg: FormBuilder, private servicio: ServicesComponent, private dateAdapter: DateAdapter<Date>){
    //type MyCustomAppearance = "none";
    //type MatFormFieldAppearance = BaseMatFormFieldAppearance | MyCustomAppearance;
    this.dateAdapter.setLocale('es-CO'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.FrmCalendar = this.fb.group({
      operationid:[null, Validators.required],
      branchid:[null, Validators.required],
      //consecutivo:[{ value: null, disabled: true }, Validators.required],
      //consecutivoreal:['0', Validators.required],
      dateestimated:[null],
      assignuserid:[null],
      assignuser:[null],
      clientid:[null],
      client:[null],
      products:[null],
      numrows:[1, [Validators.required, Validators.min(1)]]
    });

    this.FrmCalendarLis = this.fb.group({
      fechaInicio:[new Date(), null],
      fechaFin:[ObtenerUltimoDiaMes(), null]
    });

    this.FrmCalendarGrid = this.fbg.group({
      FrmRows: this.fbg.array([])
    });

    this.objetosTableEdit.Formulario = this.FrmCalendarGrid
    this.servicio.SendGetWOutPObsHeaderAut('system/parameters_dailyprogrammer/').then((rta: any) => {
      // console.log(rta);
      try
      {
        if(rta.success)
        {
          this.branches = rta.data.branches;
          this.operations = rta.data.operations;
          //No mover por la asignación del FRM
          this.objetosComponenteAutoCompleteR.ListaOpcionesAuto = rta.data?.users.map((item: any) => { return {id: item.id, name: item.first_name + " " + item.last_name, status: false, requiereIcono: false}});
          this.objetosComponenteAutoCompleteR.FrmAuto = this.FrmCalendar;
          this.objetosComponenteAutoCompleteC.ListaOpcionesAuto = rta.data?.clients.map((item: any) => { return {id: item.id, name: item.nameenterprise, status: item.actualizado, requiereIcono: true, iconfalse: 'sentiment_very_dissatisfied', icontrue:'sentiment_satisfied'}});
          this.objetosComponenteAutoCompleteC.FrmAuto = this.FrmCalendar;
          //this.dataSource =  rta.data.imports;
          this.CrearFilasGrid(rta.data.imports);
          //this.ObtenerCalendario();
        }
        else
          Swal.fire("Error al cargar la información inicial de programación", "Ha ocurrido un error inesperado, motivo:<br/>" + rta.message, "warning");
      }
      catch(exception)
      {
        Swal.fire("Error al cargar la información inicial de programación", "Ha ocurrido un error inesperado, motivo:<br/>" + exception, "error");
      }
    });
    //this.ObtenerCalendario();
    // this.Eventos = [
    //   { title: 'event 1', date: '2024-01-01', color: 'rgb(121, 4, 4)' },
    //   { title: 'event 2', date: '2024-01-01', color: 'rgb(121, 4, 4)' },
    //   { title: 'event 3', date: '2024-01-01', color: 'rgb(121, 4, 4)' },
    //   { title: 'event 4', date: '2024-01-01', color: 'rgb(240, 149, 65)' },
    //   { title: 'event 5', date: '2024-01-01', color: 'rgb(121, 4, 4)' },
    //   { title: 'event 6', date: '2024-01-01', color: 'rgb(121, 4, 4)' },
    //   { title: 'event 2', date: '2024-01-02', color: 'rgb(4, 190, 97)'},
    //   { title: 'event 2', date: '2024-01-02', color: 'rgb(4, 190, 97)'},
    // ];
    this.Editable = false;
  }

  HacerCalendario(result:any){
    if(this.FrmCalendar.valid)
    {
      // for (let i = 1;  i <= this.FrmCalendar.controls['numrows'].value;  i++)
      // {
      //   const control = this.FrmCalendarGrid.get('FrmRows') as FormArray;
      //   //control.insert(i, this.initiateFrmRows(this.ObtenerConsecutivo(i)));
      //   control.insert(i, this.initiateFrmRows());
      //   this.dataSource = new MatTableDataSource(control.controls);
      // }
      // //console.log();
      // this.dataSource._updatePaginator(this.FrmCalendar.controls['numrows'].value);
      // this.dataSource._updateChangeSubscription();
      // this.LimpiarFormCal();
      //imports/
      Swal.fire({
        title: ("Adicionar Registros"),
        text: "¿Desea agregar los registros al detalle para la programación del día actual?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            // if(this.FrmCalendar.controls['dateestimated'].value != null)
            //   this.FrmCalendar.controls['dateestimated'].setValue(new Date(ConvertDateTimeToString(this.FrmCalendar.controls['dateestimated'].value, "yyyy-MM-dd")));
            //console.log(this.FrmCalendar.controls['dateestimated'].value);
            this.servicio.SendPOSTWParamObs('imports',this.FrmCalendar.value, true).then((rta: any) => 
            {
              if(rta.success)
              {
                this.CrearFilasGrid(rta.data);
                this.LimpiarFormCal();
              }
              else
                Swal.fire("Error al guardar o editar la información de programación", "Ha ocurrido un error inesperado, motivo:<br/>" + rta.message, "warning");
            });
          }
          catch{
            //document.getElementById('LoaderSend').style.display = 'none';
            Swal.fire("Error al guardar o editar la información de programación", "Ha ocurrido un error inesperado!", "error");
          }
        }
      });
    }
    else
    {
      let valoresauto: string[]= [];
      // if(this.FrmCalendar.controls['dateestimated'].value == null)
      //   valoresauto.push('Campo fecha es obligatoria, debe seleccionar una fecha del calendario!');
      if(!StringIsNullOrEmpty(this.FrmCalendar.controls['client'].value) && StringIsNullOrEmpty(this.FrmCalendar.controls['clientid'].value))
        valoresauto.push('Debe seleccionar un valor de la lista para el campo cliente, no puede ser digitado!');
      if(!StringIsNullOrEmpty(this.FrmCalendar.controls['assignuser'].value) && StringIsNullOrEmpty(this.FrmCalendar.controls['assignuserid'].value))
        valoresauto.push('Debe seleccionar un valor de la lista para el campo responsable, no puede ser digitado!');
      // if(StringIsNullOrEmpty(this.FrmCalendar.controls['cliente'].value))
      //   valoresauto.push('Campo cliente o id de cliente no puede ser nulo!\nDebe seleccionar un valor de la lista, no puede ser digitado');
      if(valoresauto.length > 0)
          Swal.fire("Campos Obligatorios No Diligenciados", ("Se han encontrado campos sin diligenciar:"+ valoresauto.join("\n")), "warning");
    }
  }

  //#region Valores devueltos de autocomplete
  ObtenerValorAutocomplete(valorrespuestaauto: respuestaAutocomplete){
    //console.log((valorrespuestaauto.valor as any).id);
    this.FrmCalendar.controls[valorrespuestaauto.elemento == "client" ? "clientid" : "assignuserid"].setValue((valorrespuestaauto.valor as any).id);
    this.FrmCalendar.controls[valorrespuestaauto.elemento].setValue((valorrespuestaauto.valor as any).name);
  }
  //#endregion

  // private ObtenerConsecutivo(numeroregistro: number):string{
  //   let cons: number = parseInt(this.FrmCalendar.controls['consecutivo'].value) + numeroregistro;
  //   return  (this.FrmCalendar.controls['tipoOper'].value.toString() + cons + "-" + this.FrmCalendar.controls['sucursal'].value);
  // }

  LimpiarFormCal(){
    this.FrmCalendar.reset();
    this.FrmCalendar.controls['operationid'].setValue(null);
    this.FrmCalendar.controls['branchid'].setValue(null);
    //this.FrmCalendar.controls['dateEst'].setValue(new Date());
    this.FrmCalendar.controls['numrows'].setValue(1);
    //this.FrmCalendar.controls['consecutivoreal'].setValue(0);
    //this.FrmCalendar.controls['consecutivo'].setValue(0);
    this.selectDate = null;
  }

  ListarCalendario(result:any){
    if(this.FrmCalendarLis.valid)
    {

    }
  }

  // ObtenerConsecPorOperYSucu(){
  //   if(!StringIsNullOrEmpty(this.FrmCalendar.controls['tipoOper'].value) && !StringIsNullOrEmpty(this.FrmCalendar.controls['sucursal'].value))
  //   {
  //     // this.servicio.SendPOSTWParamObs('hv',{}, true).then((rta: any) => 
  //     // {
  //     // });
  //     this.FrmCalendar.controls['consecutivoreal'].setValue(20);
  //     this.FrmCalendar.controls['consecutivo'].setValue(20);
  //   }
  // }

  seleccionarPestana(pestana: string) {
    this.pestanaSeleccionada = pestana;
  }

  private CrearFilasGrid(data:any){
    data.forEach((item: any, index: number) => {
      // console.log(item);
      // console.log(index);
      const control = this.FrmCalendarGrid.get('FrmRows') as FormArray;
      control.insert(index, this.initiateFrmRows(item));
      this.dataSource = new MatTableDataSource(control.controls);

    });
    this.dataSource._updateChangeSubscription();
  }

  //initiateFrmRows(consecutivo: string): FormGroup {
  initiateFrmRows(row: any): FormGroup {
    //console.log(row.code);
    return this.fbg.group({
      code: new FormControl(row.code),
      operationid: new FormControl(row.operationid),
      branchid: new FormControl(row.branchid),
      assignuserid: new FormControl(row.assignuserid),
      assignuser: new FormControl(row.assignuser),
      clientid: new FormControl(row.assignuserid),
      client: new FormControl(row.client),
      products: new FormControl(row.products),
      dateestimated: new FormControl(row.dateestimated != null ? moment(new Date(row.dateestimated)).format('DD/MM/yyyy') : null),
      // fechaprod: new FormControl(new Date(this.FrmCalendar.controls['fechapro'].value).toISOString().split('T')[0]),
      //controledi: new FormControl(this.FrmCalendar.controls['fechapro'].value),
      // action: new FormControl('newRecord'),
      // isEditable: new FormControl(true),
      // isNewRow: new FormControl(false),
      // displayedColumns: ['code', 'operationid', 'branchid', 'assignuserid', 'assignuser', 'client', 'clientid', 'product', 'dateestimated', 'action'],
    });
  }

  onDateSelected(date: any) {
    //this.FrmCalendar.controls['dateestimated'].setValue(date);
  }

  EditarRow(row: any){
    console.log(row);
  }

  ObtenerMetodosCalendario(objetorta:RespuestasFullCalendar){
    // if(objetorta.tipoevento == "obtenereventosmes")
    // {
    //   this.ObtenerCalendario(ObtenerPrimerDiaMes(objetorta.objeto), ObtenerUltimoDiaMes(objetorta.objeto))
    // }
  }
}

