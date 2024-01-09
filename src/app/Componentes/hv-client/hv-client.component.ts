import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, LOCALE_ID, NgZone, OnInit, Optional, Output, QueryList, Renderer2, SecurityContext, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { ServicesComponent } from 'src/app/Services';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ItemAutocomplete, ModelEditar, ModelGridClients, ModelInfoHV, PassModelBotonGrid, ResponseM2, activities, arrayCAuto, arrayME, fileHV, filesApp, hv_info_attachments } from 'src/app/modelos/Interfaces';
import { CompositeMensajeFields, ConvertStringDateTODateTime, ConvertStringToDecimal, NameTipeDocument, StringIsNullOrEmpty, ValidateFieldsForm, hasRequiredValidator, transformMoney } from '../functions/FnGenericas';
import { Observable, pipe } from 'rxjs';
import {debounceTime, map, min, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AUTO_STYLE } from '@angular/animations';
//import { Router } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
//import { HvReviewComponent } from '../hv-review/hv-review.component';
//import { } from '@angular/material-moment-adapter';
//, MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS


@Component({
  selector: 'app-hv-client',
  templateUrl: './hv-client.component.html',
  styleUrls: ['./hv-client.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
})

export class HvClientComponent implements OnInit {
 //isEditable = false;
  selectedFile: any = null;
  clientId: number = 0;
  hvId: number = 0;
  signaturepersons: any = [];
  actividades: any[];
  departamentos: any[];
  departamentosResp: any[];
  citiesdptoppal: any[];
  citiesdptoppalResp: any[];
  filteredOptionsDepts: Observable<any[]>;
  myControlDpto = new FormControl<any>({id: '', name: ''}, Validators.required);
  filteredOptionsCities: Observable<any[]>;
  myControlCity = new FormControl<any>({id: '', name: ''}, Validators.required);
  departamentosAlt: any[];
  citiesdptoAlt: any[];
  filteredOptionsDeptsAlt: Observable<any[]>;
  myControlDptoAlt = new FormControl<any>({id: '', name: ''}, Validators.required);
  filteredOptionsCitiesAlt: Observable<any[]>;
  filteredOptionsActivities: Observable<activities[]>;
  myControlCityAlt = new FormControl<any>({id: '', name: ''}, Validators.required);
  //Grilla Pendientes
  //Grilla Personas Aut
  dataSourcePA = new MatTableDataSource<any>();
  displayedColumnsPA: string[] = ["fullName", "document", "charge", "phone", "email", "acciones"];
  dataColumnsPA: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "document", title: "Documento", display: true }, {name: "fullName", title: "Nombres y Apellidos", display: true }, {name: "charge", title: "Cargo", display: true }, {name: "phone", title: "Celular", display: true }, {name: "email", title: "Correo Electrónico", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarPA: ModelEditar;
  //Grilla Referencia Comercial
  dataSourceRC = new MatTableDataSource<any>();
  displayedColumnsRC: string[] = ["company", "phone", "acciones"];
  dataColumnsRC: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false },{name: "company", title: "Referencia Comercial", display: true },  {name: "phone", title: "Celular", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRC: ModelEditar;
  //Grilla Referencias Bancarias
  dataSourceRB = new MatTableDataSource<any>();
  displayedColumnsRB: string[] = ["company", "phone", "acciones"];
  dataColumnsRB: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false },{name: "company", title: "Referencia Bancaria", display: true },  {name: "phone", title: "Celular", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRB: ModelEditar;
  //Grilla Referencias clientes externos
  dataSourceRCE = new MatTableDataSource<any>();
  displayedColumnsRCE: string[] = ["company", "contactname", "country", "city", "phone", "antiquityv", "antiquity", "products", "acciones"];
  dataColumnsRCE: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "company", title: "Datos de Empresa", display: true }, {name: "contactname", title: "Contacto", display: true}, {name: "country", title: "País de la empresa", display: true }, {name: "city", title: "Ciudad de la empresa", display: true }, {name: "phone", title: "Celular", display: true }, {name: "antiquityv", title: "Antigüedad", display: true }, {name: "antiquity", title: "antiquity", display: false }, {name: "products", title: "Productos", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRCE: ModelEditar;
  //Grilla Referencias proveedores externos
  dataSourceRPE = new MatTableDataSource<any>();
  displayedColumnsRPE: string[] = ["company", "contactname", "country", "city", "phone", "antiquityv", "antiquity", "products", "acciones"];
  dataColumnsRPE: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "company", title: "Datos de Empresa", display: true }, {name: "contactname", title: "Contacto", display: true}, {name: "country", title: "País de la empresa", display: true }, {name: "city", title: "Ciudad de la empresa", display: true }, {name: "phone", title: "Celular", display: true },  {name: "antiquityv", title: "Antigüedad", display: true }, {name: "antiquity", title: "Antigüedad", display: false }, {name: "products", title: "Productos", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRPE: ModelEditar;
  //Grilla Accionistas
  dataSourceAcc = new MatTableDataSource<any>();
  displayedColumnsAcc: string[] = ["company", "typedocdes", "document", "country", "acciones"];
  dataColumnsAcc: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false },{name: "company", title: "Nombres o Razón Social", display: true }, {name: "country", title: "País", display: true }, {name: "typedoc", title: "Tipo documento", display: false }, {name: "typedocdes", title: "Tipo documento", display: true }, {name: "document", title: "Documento", display: true }, {name: "acciones", title: "Acción", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarAcc: ModelEditar;
  //Forms
  FrmInfGeneral: FormGroup;
  FrmPersonAut:  FormGroup;
  FrmPersonAutStep:  FormGroup;
  @ViewChild('FormPA', {static: false}) FormPA: NgForm;
  FrmRefComer: FormGroup;
  FrmRefBanc: FormGroup;
  FrmRefStep:  FormGroup;
  // FrmRefBancStep:  FormGroup;
  FrmRefExt: FormGroup
  //FrmRefExtStep:  FormGroup;
  FrmRefPExt: FormGroup
  FrmRefEYPStep:  FormGroup;
  FrmInfoFinanciera: FormGroup;
  FrmAccionistas:  FormGroup;
  FrmAccionistasStep:  FormGroup;
  FrmAnexos: FormGroup;
  //Steppers
  @ViewChild('stepper') private Stepper: MatStepper;
  //@ViewChild('inputprueba') inputprueba:ElementRef;
  @ViewChild('autocity') autocity:MatOption;
  @ViewChild('mstoggleCS') mstoggleCS: MatSlideToggle;
  //@ViewChildren('.eleauto') elementosAuto: QueryList<ElementRef>;
  selectedPdf:string = null;
  selectedPdfIF: string = null;
  //@ViewChild('txtCapitalS') txtCapitalS: ElementRef;
  myCtxtCapitalS = new FormControl('0', Validators.required);
  //
  //@ViewChild('hiddenInputFile') hiddenInputFile: ElementRef<HTMLInputElement>;
  //myControlFile = new FormControl();
  //cdRef eivta el error ExpressionChangedAfterItHasBeenCheckedError
  MostrarSpinner: boolean = false;
  EsEdicionForm: string = "";
  pestanaSeleccionada = 'pestana1';
  pestanaSeleccionadaEYP = 'pestana1';
  Moneys: any[];
  Files: filesApp[];
  FilesSend:fileHV[]= [];
  DocLoadCS = false;
  ViewLoadCS = false;
  DocLoadRF = false;
  botones: string[] = [];
  anchoMaximoBoton: number;
  currentDate = new Date();
  MostrarBtnFinalizar = false;
  ArrayAutoME: arrayME[] =[];
  ArrayCamposAuto: arrayCAuto[] = [];
  filteredAutoMERL: Observable<arrayME[]>;
  filteredAutoMERLS: Observable<arrayME[]>;
  filteredAutoMERLS2: Observable<arrayME[]>;
  filteredAutoMEGE: Observable<arrayME[]>;
  filteredAutoMEGF: Observable<arrayME[]>;
  filteredAutoMEGA: Observable<arrayME[]>;
  filteredAutoMEGC: Observable<arrayME[]>;
  filteredAutoMEGCE: Observable<arrayME[]>;
  msjspinner: string;
  //Desacoplamiemto
  @Input() rowGridDetails: any = null;
  @Input() navegadorPadre: string = null;
  @Output() eventoFormPadre = new EventEmitter<any>();
  // ControlAutoMERL = new FormControl<arrayME>({nombreME: '', lineaorigen: null, nit: '' }, Validators.required);
  // ControlAutoMERLS = new FormControl<arrayME>({nombreME: '', lineaorigen: null, nit: '' }, Validators.required);
  // Configura las opciones para el campo de moneda
  // optionsCU = {
  //   align: 'right', // Alinea el símbolo de la moneda a la derecha
  //   allowNegative: false, // No permite valores negativos
  //   allowZero: true, // Permite el valor cero
  //   decimal: ',', // Separador decimal
  //   precision: 2, // Cantidad de decimales
  //   prefix: '€ ', // Símbolo de la moneda
  //   suffix: '', // Sufijo adicional (puedes dejarlo en blanco)
  //   thousands: '.', // Separador de miles
  // };

  //private currencyPipe : CurrencyPipe
  //private router: Router
  constructor(private fb: FormBuilder, private dateAdapter: DateAdapter<Date>, private servicio: ServicesComponent, private cdRef: ChangeDetectorRef, public sanitizer: DomSanitizer, private datePipe: DatePipe, private router: Router) {
    // if(_hvId != null)
    // {
    //   let row: any  = null;
    //   row.row.id = _hvId;
    //   this.LoadHV(row);
    //   this.MostrapnlHV = false;
    // }
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.dateAdapter.setLocale('es-CO'); //dd/MM/yyyy
  }
    
  ngOnInit(): void {
    this.modelEditarPA = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.modelEditarRC = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.modelEditarRB = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.modelEditarRCE = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.modelEditarRPE = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.modelEditarAcc = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: true 
    };

    this.buildForm();
    this.myCtxtCapitalS.setValue('0');
    this.transformM();
    this.refrescarLstaRepresentantes();
    ///console.log(this.rowGridDetails);
    if(this.rowGridDetails != null)
      this.LoadHV(this.rowGridDetails);
  }


  private _filterActivity(value: string): activities[] {
    const filterValue = value.toLowerCase();
    return this.actividades.filter(activity => activity.activity.toLowerCase().includes(filterValue) || activity.id.toLowerCase().includes(filterValue));
  }

  buildForm():void{
    this.FrmInfGeneral = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      document: new FormControl('', Validators.required),
      companyname: new FormControl('', Validators.required),
      mailinadress: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      mailindepartment: new FormControl('', Validators.required),
      mailincity: new FormControl('', Validators.required),
      alternateaddress: new FormControl(''),
      alternatedepartment: new FormControl(''),
      alternatecity: new FormControl(''),
      isoperator: new FormControl(false, Validators.required),
      operatorname: new FormControl({value: '', disabled: true}),
      //operatorfile: new FormControl<string | ArrayBuffer>({value: undefined, disabled: true}),
      legalrepresentative: new FormControl('', Validators.required),
      //{value: '', valida: Validators.required, class : 'eleauto'},
      //new FormControl('', Validators.required),
      emaillegalrepresentative: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocrepresentative: new FormControl('', Validators.required),
      documentrepresentative: new FormControl('', Validators.required),
      cityexprepresentative: new FormControl('', Validators.required),
      chargerepresentative: new FormControl('', Validators.required),
      legalrepresentativealt1: new FormControl(''),
      emaillegalrepresentativealt1: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocrepresentativealt1: new FormControl(''),
      documentrepresentativealt1: new FormControl(''),
      chargerepresentativealt1: new FormControl(''),
      legalrepresentativealt2: new FormControl(''),
      emaillegalrepresentativealt2: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      //new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocrepresentativealt2: new FormControl(''),
      documentrepresentativealt2: new FormControl(''),
      chargerepresentativealt2: new FormControl(''),
      manager: new FormControl(''),
      emailmanager: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocmanager: new FormControl(''),
      documentmanager: new FormControl(''),
      chargemanager: new FormControl(''),
      financialmanager: new FormControl(''),
      emailfinancialmanager: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocfinancialmanager: new FormControl(''),
      documentfinancialmanager: new FormControl(''),
      chargefinancialmanager: new FormControl(''),
      administrator: new FormControl(''),
      emailadministrator: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocadministrator: new FormControl(''),
      documentadministrator: new FormControl(''),
      chargeadministrator: new FormControl(''),
      commercialmanager: new FormControl(''),
      emailcommercialmanager: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedoccommercialmanager: new FormControl(''),
      documentcommercialmanager: new FormControl(''),
      chargecommercialmanager: new FormControl(''),
      ftrademanager: new FormControl(''),
      emailftrademanager: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      typedocftrademanager: new FormControl(''),
      documentftrademanager: new FormControl(''),
      chargeftrademanager: new FormControl(''),
      operationscoordination: new FormControl('', Validators.required),
      emailoperationscoordinator: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      chargeoperationscoordination: new FormControl('', Validators.required),
      phoneoperationcoordinator: new FormControl('', Validators.required),
      isanonymoussociety: new FormControl(false, Validators.required),
      signatureperson: new FormControl('', Validators.required),
      createdAt: new FormControl<Date>(null),
      updatedAt: [null]
    });
    this.ArrayCamposAuto.push({linea: 1, nombremodelo: 'legalrepresentative', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 1, nombremodelo: 'typedocrepresentative', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 1, nombremodelo: 'documentrepresentative', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 1, nombremodelo: 'chargerepresentative', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 1, nombremodelo: 'emaillegalrepresentative', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 2, nombremodelo: 'legalrepresentativealt1', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 2, nombremodelo: 'typedocrepresentativealt1', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 2, nombremodelo: 'documentrepresentativealt1', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 2, nombremodelo: 'chargerepresentativealt1', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 2, nombremodelo: 'emaillegalrepresentativealt1', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 3, nombremodelo: 'legalrepresentativealt2', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 3, nombremodelo: 'typedocrepresentativealt2', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 3, nombremodelo: 'documentrepresentativealt2', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 3, nombremodelo: 'chargerepresentativealt2', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 3, nombremodelo: 'emaillegalrepresentativealt2', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 4, nombremodelo: 'manager', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 4, nombremodelo: 'typedocmanager', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 4, nombremodelo: 'documentmanager', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 4, nombremodelo: 'chargemanager', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 4, nombremodelo: 'emailmanager', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 5, nombremodelo: 'financialmanager', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 5, nombremodelo: 'typedocfinancialmanager', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 5, nombremodelo: 'documentfinancialmanager', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 5, nombremodelo: 'chargefinancialmanager', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 5, nombremodelo: 'emailfinancialmanager', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 6, nombremodelo: 'administrator', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 6, nombremodelo: 'typedocadministrator', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 6, nombremodelo: 'documentadministrator', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 6, nombremodelo: 'chargeadministrator', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 6, nombremodelo: 'emailadministrator', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 7, nombremodelo: 'commercialmanager', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 7, nombremodelo: 'typedoccommercialmanager', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 7, nombremodelo: 'documentcommercialmanager', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 7, nombremodelo: 'chargecommercialmanager', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 7, nombremodelo: 'emailcommercialmanager', orden: 5, valor: null});
    this.ArrayCamposAuto.push({linea: 8, nombremodelo: 'ftrademanager', orden: 1, valor: null});
    this.ArrayCamposAuto.push({linea: 8, nombremodelo: 'typedocftrademanager', orden: 2, valor: null});
    this.ArrayCamposAuto.push({linea: 8, nombremodelo: 'documentftrademanager', orden: 3, valor: null});
    this.ArrayCamposAuto.push({linea: 8, nombremodelo: 'chargeftrademanager', orden: 4, valor: null});
    this.ArrayCamposAuto.push({linea: 8, nombremodelo: 'emailftrademanager', orden: 5, valor: null});
  
    this.FrmPersonAut = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      document: ['', Validators.required],
      fullName: ['', Validators.required],
      charge: ['', Validators.required],
      email: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      phone: ['', Validators.required],
      controleditar:new FormControl(null)
    });
    //Para realizar el control del Stepper
    this.FrmPersonAutStep = this.fb.group({
      hvId: new FormControl(null, Validators.required),
    });
  
    this.FrmRefComer = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      company: ['', Validators.required],
      phone: ['', Validators.required],
      controleditar:new FormControl(null)
      //emailrl: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
    });

    this.FrmRefBanc = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      company: ['', Validators.required],
      phone: ['', Validators.required],
      controleditar:new FormControl(null)
    });

    //Para realizar el control del Stepper de los form FrmRefComer y FrmRefBanc
    this.FrmRefStep = this.fb.group({
      hvIdRC: new FormControl(null, Validators.required),
      hvIdRB: new FormControl(null, Validators.required),
    });
  
    //Para realizar el control del Stepper
    // this.FrmRefBancStep = this.fb.group({
    //   hvId: new FormControl(null, Validators.required),
    // });

    this.FrmRefExt = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      company: ['', Validators.required],
      contactname: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      antiquitya: ['null', Validators.required],
      antiquitym: ['null', Validators.required],
      products: ['', Validators.required],
      controleditar:new FormControl(null)
    });
    //Para realizar el control del Stepper
    // this.FrmRefExtStep = this.fb.group({
    //   hvId: new FormControl(null, Validators.required),
    // });

    this.FrmRefPExt = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      company: ['', Validators.required],
      contactname: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      antiquitya: ['null', Validators.required],
      antiquitym: ['null', Validators.required],
      products: ['', Validators.required],
      controleditar:new FormControl(null)
    });
    //Para realizar el control del Stepper
    this.FrmRefEYPStep = this.fb.group({
      hvIdE: new FormControl(null),
      hvIdP: new FormControl(null),
    });

    this.FrmInfoFinanciera = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      walletemployname: ['', Validators.required],
      walletemployphone: ['', Validators.required],
      walletemployemail: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      isselfretaining: [false, Validators.required],
      retainingresolution: [{value: '', disabled: true}],
      isgreatcontributor: [false, Validators.required],
      greatcontributorresolution: [{value: '', disabled: true}],
      isretainingagent:  [false, Validators.required],
      isresponsibleiva:  [false, Validators.required],
      isreteica:  [false, Validators.required],
      isreteiva:  [false, Validators.required],
      // taxretencion:  [{value: 0, disabled: true}],
      taxretencion:  [{value: ('0' + sessionStorage.getItem('formats')!.replaceAll('"', '')  + '00'), disabled: true}],
      regimen:  ['NA', Validators.required],
      responsiblestatename:  ['', Validators.required],
      responsiblestatephone:  ['', Validators.required],
      email:  ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      contactinvoicename:  ['', Validators.required],
      contactinvoicecharge:  ['', Validators.required],
      contactinvoicephone:  ['', Validators.required],
      contactinvoiceemail:  ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      contactinvoicealternativeemail:  [{value: '', disabled: true}],
      codeciuu: new FormControl(null),
      //subscribedcapital: [0, Validators.required],
      //subscribedcapital: [0, Validators.required, this.optionsCU, this.asyncValidator],
      // subscribedcapital: [{value: ('0' + sessionStorage.getItem('formats')!.replaceAll('"', '')  + '00')}, Validators.required, this.asyncValidator],
      subscribedcapital: ['0', Validators.required],
      bankname: ['', Validators.required],
      bankaddress: ['', Validators.required],
      bankcity: ['', Validators.required],
      kindpay: ['', Validators.required],
      currencyname: [0, Validators.required],
      islegalresources: ['', Validators.required],
      products: ['', Validators.required],
      hasfiscalreview: [false, Validators.required],
      //certificationdictamenfile: new FormControl<string | ArrayBuffer>({value: undefined, disabled: true}),
      createdAt: [null],
      updatedAt: [null]
    });

    this.FrmAccionistas = this.fb.group({
      id: new FormControl(null),
      hvId: new FormControl(null),
      company: ['', Validators.required],
      country: ['', Validators.required],
      typedoc: ['', Validators.required],
      document: ['', Validators.required],
      createdAt: [null],
      updatedAt: [null],
      controleditar:new FormControl(null)
    });
    //Para realizar el control del Stepper
    this.FrmAccionistasStep = this.fb.group({
      hvId: new FormControl(null, Validators.required),
    });
  
    this.FrmAnexos = this.fb.group({
      hv_info_step9: this.fb.array<hv_info_attachments>([]),
      contratosuministrosfile:['']
    });
  }

  AddValuestoAutocomplete(event: any, linea: number){
    this.ArrayAutoME = [];
    // console.log(event.target.value);
    this.ArrayCamposAuto.sort((a, b) => a.linea - b.linea).forEach(item => {
      item.valor =  item.linea == linea && item.orden == 1 ?  event.target.value : this.FrmInfGeneral.controls[item.nombremodelo].value;
      // console.log(item.valor);
      if(item.orden == 1 && !StringIsNullOrEmpty(item.valor) && !this.ArrayAutoME.some(i => i.nombreME != null && i.nombreME.trim().toUpperCase() === item.valor.trim().toUpperCase()))
        this.ArrayAutoME.push({nombreME: this.FrmInfGeneral.controls[item.nombremodelo].value.toString().trim().toUpperCase(), lineaorigen: item.linea, nit:  (!StringIsNullOrEmpty(this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].valor) ? this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].valor : null)});
    });
    // console.log(this.ArrayCamposAuto);
    //console.log(this.ArrayAutoME);
  }
  
  onOptionSelectedMiembros(event: any, lineTarget: number){
    this.ArrayCamposAuto.filter(ls => ls.linea == event.option._element.nativeElement.optionselected.lineaorigen).forEach(item => {
      this.FrmInfGeneral.controls[this.ArrayCamposAuto.filter(ld => ld.linea == lineTarget && ld.orden == item.orden)[0].nombremodelo].setValue(this.FrmInfGeneral.controls[item.nombremodelo].value.toString().trim().toUpperCase());
    });
  }

  ngAfterViewInit(): void { 
    this.cdRef.detectChanges();
    // if (this.mstoggleCS) {
    //   //Para que no salga como indefinido al buscarlo en el HTML
    //   this.mstoggleCS.toggle();
    // }
  }

  // formatCurrency_TaxableValue(event: any)
  // {
  //   var uy = new Intl.NumberFormat('en-USD', {style: 'currency', currency:'USD'}).format(event.target.value);
  //   //this.tax = ;
  //   this.FrmInfoFinanciera.controls["subscribedcapital"]?.setValue(event.target.value);
  //   // this.taxableValue = uy;
  // }

  seleccionarPestana(pestana: string) {
    this.pestanaSeleccionada = pestana;
  }

  seleccionarPestanaEYP(pestana: string) {
    this.pestanaSeleccionadaEYP = pestana;
  }

  transformM(){
    //this.FrmInfoFinanciera.controls["subscribedcapital"]?.setValue(transformMoney(this.myCtxtCapitalS));
    this.FrmInfoFinanciera.controls["subscribedcapital"]?.setValue(transformMoney(this.myCtxtCapitalS));
    //console.log(this.FrmInfoFinanciera.controls["subscribedcapital"]?.value);
  } 
  // asyncValidator(control: FormControl) {
  //   // Simula una validación asincrónica
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       if (control.value === 'valor_invalido') {
  //         resolve({ valorInvalido: true });
  //       } else {
  //         resolve(null); // La validación asincrónica pasó
  //       }
  //     }, 1000); // Simulación de retardo de 1 segundo
  //   });
  // }

  LoadHV(row: any){
    // this.servicio.SendGetWOutPObsHeaderAut('hv/' + row.id).then((rta: any) => {
    this.servicio.SendGetWOutPObsHeaderAut('hv/' + row.hvid).then((rta: any) => {
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
            let lasthvInfo = rta.data
            if(!lasthvInfo.fieldsReject)
              lasthvInfo.fieldsReject = '[]'
            if(lasthvInfo.fieldsReject)
            {
              const fieldsReject = JSON.parse(lasthvInfo.fieldsReject);
              for(let field of fieldsReject)
              {
                const nodoPadre = field.split('.')[0]
                const campo = field.split('.')[1]
                if(!isNaN(campo))
                {   
                  const campoInt = parseInt(campo)
                  const recRow = lasthvInfo[nodoPadre].map((r:any)=>r.id).indexOf(campoInt)
                  if(recRow != -1)
                    lasthvInfo[nodoPadre].splice(recRow,1)
                  /*for(let i:number=3; i<Object.keys(lasthvInfo[nodoPadre][recRow]).length; i++)
                    lasthvInfo[nodoPadre][recRow][Object.keys(lasthvInfo[nodoPadre][recRow])[i]]=null*/
                }
                else
                    lasthvInfo[nodoPadre][campo] = ''
              }
            }

            rta.data = JSON.parse(JSON.stringify(lasthvInfo));

            //console.log(rta);
            this.clientId = rta.data.client.id;
            this.hvId = rta.data.id;
            if(rta.data.Step1 == undefined || rta.data.Step1 == null)
            {
              const _doc = rta.data.client.document;
              rta.data.client.document = _doc.substring(0,_doc.length-1) + '-' + _doc.charAt(_doc.length-1)
                this.FrmInfGeneral.controls["document"]?.setValue(rta.data.client.document);
              this.FrmInfGeneral.controls["companyname"]?.setValue(rta.data.client.nameenterprise);
              this.FrmInfGeneral.controls["hvId"]?.setValue(rta.data.id);
              this.IsOperator(false);
            }
            else
            {
              if(!rta.data.Step1.document.includes('-'))
                rta.data.Step1.document = rta.data.Step1.document.substring(0,rta.data.Step1.document.length-1) + '-' + rta.data.Step1.document.charAt(rta.data.Step1.document.length-1)
            }
            // this.departamentos = JSON.parse(JSON.stringify(rta.departments));
            // this.departamentosResp = JSON.parse(JSON.stringify(rta.departments));
            this.departamentos = JSON.parse(JSON.stringify(rta.departments));
            this.departamentosResp = JSON.parse(JSON.stringify(rta.departments));
            //Swal.fire("Error", JSON.stringify(this.departamentos), 'error');
            this.citiesdptoppal = JSON.parse(JSON.stringify(rta.cities));
            this.citiesdptoppalResp = JSON.parse(JSON.stringify(rta.cities));
            this.departamentosAlt = JSON.parse(JSON.stringify(rta.departments));
            this.citiesdptoAlt = JSON.parse(JSON.stringify(rta.cities));
            this.Moneys = rta.currencies;
            this.actividades = rta.activities;

            //Cargar pasos
            //No mover se debe primero cargar los datos de los combos
            if(rta.data.Step1 != undefined && rta.data.Step1 != null )
            {
              this.LoadFrmInfGeneral(rta.data.Step1);             
              this.Stepper.next();
              //console.log("1");
            }
            
            //Cargar Paso 2 Personas Autorizadas
            if(rta.data.Step2 != undefined && rta.data.Step2 != null && rta.data.Step2.length > 0)
            {
              this.ReloadGrid(rta.data.Step2, this.dataSourcePA, 2);
              this.FrmPersonAutStep.controls["hvId"]?.setValue(rta.data.id);
              this.Stepper.next();
              //console.log("2");
            }

            //Cargar Paso 3 Referencias Comerciales
            if(rta.data.Step3 != undefined && rta.data.Step3 != null && rta.data.Step3.length > 0)
            {
              this.ReloadGrid(rta.data.Step3, this.dataSourceRC, 3);
              this.FrmRefStep.controls["hvIdRC"]?.setValue(rta.data.id);
              //this.Stepper.next();
            }

            //Cargar Paso 4 Referencias Bancarias
            if(rta.data.Step4 != undefined && rta.data.Step4 != null && rta.data.Step4.length > 0)
            {
              this.ReloadGrid(rta.data.Step4, this.dataSourceRB, 4);
              this.FrmRefStep.controls["hvIdRB"]?.setValue(rta.data.id);
              //this.Stepper.next();
            }
            if(!StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRC"]?.value) && !StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRB"]?.value))
              this.Stepper.next();

            //Cargar Paso 5 Referencias de Clientes Exteriores
            if(rta.data.Step5 != undefined && rta.data.Step5 != null && rta.data.Step5.length > 0)
            {
              //console.log(rta.data.Step5);
              this.ReloadGrid(rta.data.Step5, this.dataSourceRCE, 5);
              this.FrmRefEYPStep.controls["hvIdE"]?.setValue(rta.data.id);
              //this.Stepper.next();
            }

            //Cargar Paso 6 Referencia de Proveedores Externos
            if(rta.data.Step6 != undefined && rta.data.Step6 != null && rta.data.Step6.length > 0)
            {
              this.ReloadGrid(rta.data.Step6, this.dataSourceRPE, 6);
              this.FrmRefEYPStep.controls["hvIdP"]?.setValue(rta.data.id);
              // this.Stepper.next();
            }
            if(!StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdE"]?.value) || !StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdP"]?.value))
              this.Stepper.next();

            if(rta.data.Step7 != undefined && rta.data.Step7 != null)
            {
              this.myCtxtCapitalS.setValue(rta.data.Step7.subscribedcapital)
              this.LoadFrmInfFinanciera(rta.data.Step7);             
              this.Stepper.next();
              //console.log("7");
            }
            else
            {
              this.FrmInfoFinanciera.controls["hvId"]?.setValue(rta.data.id);
              //this.Isfiscalreview(false);
            }

            //Cargar Paso 8 Accionistas
            if(rta.data.Step8 != undefined && rta.data.Step8 != null && rta.data.Step8.length > 0)
            {
              this.ReloadGrid(this.addtypedocdesStep8(rta.data.Step8), this.dataSourceAcc, 9);
              this.FrmAccionistasStep.controls["hvId"]?.setValue(rta.data.id);
              this.Stepper.next();
              //console.log("8");
            }
            
            if(rta.files != undefined && rta.files != null && rta.files.length > 0)
              this.LoadDocStep9(rta);

            this.filteredOptionsDepts = this.myControlDpto.valueChanges.pipe(
              startWith(''),
              // map(value => this._filterDpto(value || '')),
              map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filterDpto(name as string) : this.departamentosResp.slice();
              }),
            );
              
            this.filteredOptionsCities = this.myControlCity.valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              //map(value => this._filterCityP(value || '')),
              map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filterCityP(name as string) :  this.citiesdptoppal.filter(c=> c.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
              })
            );
        
            this.filteredOptionsDeptsAlt = this.myControlDptoAlt.valueChanges.pipe(
              startWith(''),
              // map(value => this._filterDptoAlt(value || '')),
              map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filterDptoAlt(name as string) : this.departamentosResp.slice();
              })
            );
        
            this.filteredOptionsCitiesAlt = this.myControlCityAlt.valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              //map(value => this._filterCityP(value || '')),
              map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filterCityA(name as string) : this.citiesdptoAlt.filter(c=> c.iddpt.toString() == this.FrmInfGeneral.controls["alternatedepartment"]?.value.toString());
                //this.FrmInfGeneral.controls["alternatedepartment"]?.value != undefined ? this.citiesdptoAlt.slice().filter(op => op.iddpt == this.FrmInfGeneral.controls["alternatedepartment"]?.value) : null;
              })
            );

            this.filteredAutoMERL = this.FrmInfGeneral.controls['legalrepresentative'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMERLS = this.FrmInfGeneral.controls['legalrepresentativealt1'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMERLS = this.FrmInfGeneral.controls['legalrepresentativealt1'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMERLS2 = this.FrmInfGeneral.controls['legalrepresentativealt2'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMEGE = this.FrmInfGeneral.controls['manager'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMEGF = this.FrmInfGeneral.controls['financialmanager'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredAutoMEGA = this.FrmInfGeneral.controls['administrator'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );
            
            this.filteredAutoMEGC = this.FrmInfGeneral.controls['commercialmanager'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );
            
            this.filteredAutoMEGCE = this.FrmInfGeneral.controls['ftrademanager'].valueChanges.pipe(
              startWith(''),
              debounceTime(400),
              map(value => {
                const nombreME = typeof value === 'string' ? value : value?.nombreME;
                return nombreME ? this._filterAutoME(nombreME as string) :  this.ArrayAutoME;
              })
            );

            this.filteredOptionsActivities = this.FrmInfoFinanciera.controls['codeciuu'].valueChanges.pipe(
              startWith(''),
              map(value => this._filterActivity(value || '')),
            );
        
            //Se carga al inicio para que cuando haga el primer foco ya esté cargado si los miembros están diligenciados
            this.ArrayCamposAuto.sort((a, b) => a.linea - b.linea).forEach(item => {
              item.valor =  this.FrmInfGeneral.controls[item.nombremodelo].value;
              if(item.orden == 1 && !StringIsNullOrEmpty(item.valor) && !this.ArrayAutoME.some(i => i.nombreME != null && i.nombreME.trim().toUpperCase() === item.valor.trim().toUpperCase()))
                this.ArrayAutoME.push({nombreME: this.FrmInfGeneral.controls[item.nombremodelo].value.toString().trim().toUpperCase(), lineaorigen: item.linea, nit:  (!StringIsNullOrEmpty(this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].valor) ? this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].valor : !StringIsNullOrEmpty(this.FrmInfGeneral.controls[this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].nombremodelo].value) ? this.FrmInfGeneral.controls[this.ArrayCamposAuto.filter(i => i.linea == item.linea && i.orden == 3)[0].nombremodelo].value : null)});
            });

            this.transformM()
            this.refrescarLstaRepresentantes()

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

  get filesArray() {
    return this.FrmAnexos.get('hv_info_step9') as FormArray;
  }

  refrescarLstaRepresentantes() {
    // Puedes acceder a los valores de otros campos en el formulario
    let person: Object[] = new Array();
    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get('documentrepresentative').value))
      person.push({ value: this.FrmInfGeneral.get('documentrepresentative').value, title: this.FrmInfGeneral.get('legalrepresentative').value, selected:true })
    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get('documentrepresentativealt1').value) && !person.some((item: any) => item.value == this.FrmInfGeneral.get('documentrepresentativealt1').value))
      person.push({ value: this.FrmInfGeneral.get('documentrepresentativealt1').value, title: this.FrmInfGeneral.get('legalrepresentativealt1').value, selected:true })
    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get('documentrepresentativealt2').value) && !person.some((item: any) => item.value == this.FrmInfGeneral.get('documentrepresentativealt2').value))
      person.push({ value: this.FrmInfGeneral.get('documentrepresentativealt2').value, title: this.FrmInfGeneral.get('legalrepresentativealt2').value, selected:true })

    // Puedes realizar cualquier lógica de actualización aquí si es necesario.
    // En este caso, simplemente actualizamos las opciones para ilustrar el concepto.
    this.signaturepersons = person ;
  }

  private CalcularAnchoMaximoBotones(){
    this.anchoMaximoBoton = this.botones.reduce((max, boton) => {
      const botonWidth = this.getTextWidth(boton);
      return botonWidth > max ? botonWidth : max;
    }, 0);
  }

  private getTextWidth(text: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px Arial'; // Establece la fuente y el tamaño de fuente deseado
    const metrics = context.measureText(text);
    return metrics.width;
  }

  //#region Autocompletes
  private _filterDpto(value: string): ItemAutocomplete[] {
    //Segundo evento que se ejecuta después de displayFnDpto
    const filterValue = value.toLowerCase();
    this.myControlCity.setValue(null);
    let items = this.departamentos.filter(op => op.name.toString().toLowerCase().startsWith(filterValue));
    //console.log(items);
    if(items.length == 1)
    {
      this.FrmInfGeneral.controls["mailincity"].setValue(null);
      this.FrmInfGeneral.controls["mailindepartment"].setValue(items[0].id);
      // this.citiesdptoppal = [];
      // this.citiesdptoppal = this.citiesdptoppalResp.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
      //console.log('aqui dpto ' + this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
      this.citiesdptoppal.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
    }
    return items;
  }

  displayFnDpto(dpto: ItemAutocomplete): string {
    //Primer evento que se ejecuta
    return dpto && dpto.name ? dpto.name : '';
  }

  // SelectedDpto(event:any){
  //   this.FrmInfGeneral.controls["mailindepartment"].setValue(event.option.value.id);
  //   //console.log(this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
  //   //this.citiesdptoppal = this.citiesdptoppalResp.find(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
  // }

  displayFnCity(city: any): string {
      //Primer evento que se ejecuta
    return city && city.name ? city.name : '';
  }

  // public myControlFocused(){
  //   console.log("focus");
  //   console.log(this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
  //   this.citiesdptoppal = this.citiesdptoppalResp.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
  // }

  private _filterCityP(value: string): ItemAutocomplete[] {
    //Segundo evento que se ejecuta después de displayFnCity
    if(value)
    {
      const filterValue = value.toLowerCase();
      let items = this.citiesdptoppal.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString() && op.name.toString().toLowerCase().includes(filterValue));
      if(items.length == 1)
      {
        // Swal.fire("Advertencia",JSON.stringify(items[0]), "warning");
        // console.log(items[0]);
        this.FrmInfGeneral.controls["mailincity"].setValue(items[0].id);
      }
      return items
    }
    return null;
  }

  //Selectedcity(event:any){
  //   console.log(event.option.value.id);
  //   this.FrmInfGeneral.controls["mailincity"]?.setValue(event.option.value.id);
  //}

  private _filterDptoAlt(value: string): ItemAutocomplete[] {
    const filterValue = value.toLowerCase();
    this.myControlCityAlt.setValue(null);
    //let items = this.departamentosAlt.filter(op => op.name.toString().toLowerCase().includes(filterValue)); botaba error con Santander y norte san
    let items = this.departamentosAlt.filter(op => op.name.toString().toLowerCase().startsWith(filterValue));
    if(items.length == 1)
    {
      this.FrmInfGeneral.controls["alternatecity"].setValue(null);
      this.FrmInfGeneral.controls["alternatedepartment"].setValue(items[0].id);
      // this.citiesdptoppal = [];
      // this.citiesdptoppal = this.citiesdptoppalResp.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["mailindepartment"]?.value.toString());
      this.citiesdptoAlt.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["alternatedepartment"]?.value.toString());
    }
    return items;
  }

  displayFnDptoAlt(dpto: any): string {
    return dpto && dpto.name ? dpto.name : '';
  }

  // SelectedDptoAlt(event:any){
  //   this.FrmInfGeneral.controls["alternatedepartment"]?.setValue(event.option.value.id);
  // }

  private _filterCityA(value: string): ItemAutocomplete[] {
    if(value)
    {
      const filterValue = value.toLowerCase();
      let items = this.citiesdptoAlt.filter(op => op.iddpt.toString() == this.FrmInfGeneral.controls["alternatedepartment"]?.value.toString() && op.name.toString().toLowerCase().includes(filterValue));
      if(items.length == 1)
      {
        // Swal.fire("Advertencia",JSON.stringify(items[0]), "warning");
        // console.log(items[0]);
        this.FrmInfGeneral.controls["alternatecity"].setValue(items[0].id);
      }
      return items
    }
    return null;
  }

  private _filterAutoME(value: string): arrayME[]{
    const filterValue = value.toLowerCase();
    return this.ArrayAutoME.filter(opt => opt.nombreME.toLowerCase().includes(filterValue));
  }

  // private _filterAutoMERLS(value: string): arrayME[]{
  //   const filterValue = value.toLowerCase();
  //   return this.ArrayAutoME.filter(opt => opt.nombreME.toLowerCase().includes(filterValue));
  // }


  // SelectedcityAlt(event:any){
  //   //console.log(event.option.value.id);
  //   this.FrmInfGeneral.controls["alternatecity"]?.setValue(event.option.value.id);
  // }

  displayFnCityA(city: any): string {
    return city && city.name ? city.name : '';
  }
  //#endregion

  //#region PDF
  public GetFileOnLoad(event: any, NameModelField: string, NameInputField: string) {
    var file = event.target.files[0];
    //const file = (event.target as HTMLInputElement).files[0];
    // this.LoadValueNameinputFile(file?.name, "fakeFileInput");
    this.LoadValueNameinputFile(file?.name, NameInputField);
    //this.FrmInfGeneral.controls["operatorfile"]?.setValue(file[0]);
    try
    {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedPdf = reader.result.toString();
        if(NameModelField == "operatorfile")
        {
          //this.FrmInfGeneral.controls["operatorfile"]?.setValue(reader.result);
          this.selectedPdf = reader.result.toString();
        }
        else
        {
          this.FrmInfoFinanciera.controls[NameModelField]?.setValue(reader.result);
          this.selectedPdfIF = reader.result.toString();
        }
        //this.DocLoad = true;
      };
    }
    catch(e){}
  }

  public GetFileOnLoadXLS(event: any, NameModelField: string, NameInputField: string) {
    var file = event.target.files[0];
    this.LoadValueNameinputFile(file?.name, NameInputField);
    try
    {
      this.FrmAnexos.controls[NameModelField]?.setValue(file);
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //     this.FrmAnexos.controls[NameModelField]?.setValue(reader.result);
      // };
    }
    catch(e){}
  }

  private LoadValueNameinputFile(valor: string, nameElement: string)
  {
    if(valor != undefined)
    {
      var element = document.getElementById(nameElement) as HTMLInputElement | null;
      if(element != null)
      {
        element.value = valor;
        if(nameElement == "fakeFileInputCS")
          this.DocLoadCS = true;
        else
          this.DocLoadRF = true;
      }
      else
      {
        if(nameElement == "fakeFileInput")
          this.DocLoadCS = false;
        else
          this.DocLoadRF = false;
      }
    }
  }

  private GetValueNameinputFile(nameInputFile: string):string
  {
      var element = document.getElementById(nameInputFile) as HTMLInputElement | null;
      return element.value;
  }

  ViewPDF(nameFieldModel: string, nameFakeField: string) {
    try
    {
      let continuar = nameFieldModel == "operatorfile" ? this.FrmInfGeneral.get(nameFieldModel).value == undefined || this.FrmInfGeneral.get(nameFieldModel).value == null :  this.FrmInfoFinanciera.get(nameFieldModel).value == undefined || this.FrmInfoFinanciera.get(nameFieldModel).value == null;
      if(continuar)
      {
        //Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
        let nameFile = this.GetValueNameinputFile(nameFakeField);
        if(!StringIsNullOrEmpty(nameFile))
        {
          this.MostrarSpinner = true;
          //console.log(nameFile);
          // this.servicio.SendPOSTWParamObs('system/showFile/', {"fileName": ((new Date(this.FrmInfGeneral.controls['createdAt']?.value).getFullYear() + "/" +  this.FrmInfGeneral.controls['document']?.value + "/") + nameFile)}, true).then((rta: ResponseM2) => {
          //this.servicio.SendPOSTWParamObs('system/showFile/', {"fileName":  nameFile}, true).then((rta: ResponseM2) => { 
          this.servicio.ShowPOSTWFile('system/showFile/', {"fileName":  nameFile}, true).then((rta: any) => { 
          
          //console.log(rta.data);
            if(rta)
            {
              this.MostrarSpinner = false;
              //console.log("Ingreso")
              const blob = new Blob([rta], { type: 'application/pdf' });
              var safePdfUrl:any = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
              // this.ShowFileinIFrame(rta.data.replace("dataapplication/pdfbase64", "data:application/pdf;base64,"));
              this.ShowFileinIFrame(safePdfUrl.changingThisBreaksApplicationSecurity);
            }
          });
        }
        else
          Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
      }
      else
      {
        this.ShowFileinIFrame(nameFieldModel == "operatorfile" ? this.selectedPdf: this.selectedPdfIF);
        //console.log(this.selectedPdf.split(",")[1]);
        //pdfWindow.document.write("<html><head><title>Andina de Aduanas (Visualizar Documento)</title></head><body height='100%' width='100%'><iframe width='100%' height='100%' src='" + this.selectedPdf + "'></iframe></body></html>");
      }
    }
    catch{
      this.MostrarSpinner = false;
      //document.getElementById('LoaderSend').style.display = 'none';
      Swal.fire("Error al obtener el archivo", "Ha ocurrido un error inesperado!", "error");
    }
  }

  ViewPDFFiles(name:string) {
    try
    {
      if((document.getElementById(name) as HTMLInputElement).value != "undefined" && (document.getElementById(name) as HTMLInputElement).value != null && (document.getElementById(name) as HTMLInputElement).value != undefined && !StringIsNullOrEmpty((document.getElementById(name) as HTMLInputElement).value))
      {
        let valueNameFile = this.GetValueNameinputFile(name);
        if(valueNameFile != "undefined" && valueNameFile != null && valueNameFile != undefined && !StringIsNullOrEmpty(valueNameFile))
        {
          //console.log(valueNameFile);
          this.MostrarSpinner = true;
          //this.servicio.SendPOSTWParamObs('system/showFile', {"fileName": valueNameFile}, true).then((rta: ResponseM2) => {
          this.servicio.ShowPOSTWFile('system/showFile', {"fileName": valueNameFile}, true).then((rta: any) => {
            //console.log(rta.data);
            this.MostrarSpinner = false;
            if(rta)
            {
              console.log("Ingreso")

              // this.ShowFileinIFrame(rta.data.replace("dataapplication/pdfbase64", "data:application/pdf;base64,"));
              const blob = new Blob([rta], { type: 'application/pdf' });
              var safePdfUrl:any = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
              this.ShowFileinIFrame(safePdfUrl.changingThisBreaksApplicationSecurity);
            }
            else
              Swal.fire("Advertencia", rta.message, "warning");
          });
        }
        else
          Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
      }
      else
      {
        var file = (document.getElementById(name.slice(0, -1) + "h") as HTMLInputElement);
        if(file.files[0] != undefined)
        {
          const reader = new FileReader();
          reader.readAsDataURL(file.files[0]);
          reader.onload = () => {
            this.ShowFileinIFrame(reader.result.toString());
          };
        }
        else
          Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
      }
    }
    catch{
      this.MostrarSpinner = false;
      //document.getElementById('LoaderSend').style.display = 'none';
      Swal.fire("Error al obtener el archivo", "Ha ocurrido un error inesperado!", "error");
    }
  }

  public GetFileOnLoadDocs(event: any, file: any, nameDate: string) {
    var filepdf = event.target.files[0];
    this.LoadValueNameinputFile(filepdf?.name, event.target.id.slice(0, - 1));
    //Si el documento ya existe en el array, lo elimina para no enviarlo duplicado
    if(this.FilesSend.some(item => item.position == file.docattachmentid && item.type == file.type))
      this.FilesSend.splice(this.FilesSend.findIndex(i => i.position == file.docattachmentid && i.type == file.type), 1);
    let _fechaExp = null;
    if((document.getElementById(nameDate) as HTMLInputElement) != undefined && !StringIsNullOrEmpty((document.getElementById(nameDate) as HTMLInputElement).value))
      _fechaExp = ConvertStringDateTODateTime((document.getElementById(nameDate) as HTMLInputElement).value, 'dd/MM/yyyy');
      //_fechaExp = new Date(this.datePipe.transform((document.getElementById(nameDate) as HTMLInputElement).value, 'dd/MM/yyyy'));
      //console.log(_fechaExp);
    this.FilesSend.push({position: file.docattachmentid, archivo: filepdf, expireat : file.expireat, documentdate: _fechaExp, name: file.name, type: file.type});
    if((this.FrmAnexos.get('hv_info_step9') as FormArray).controls.some((item) => item.value.docattachmentid == file.docattachmentid && item.value.docoperationtype == file.type) && _fechaExp != null)
      (this.FrmAnexos.get('hv_info_step9') as FormArray).controls.filter((frm: AbstractControl<hv_info_attachments>)=> frm.value.docattachmentid == file.docattachmentid && frm.value.docoperationtype == file.type)[0].value.documentdate = _fechaExp;  
    else
    {
      if((this.FrmAnexos.get('hv_info_step9') as FormArray).controls.some((item) => item.value.docattachmentid == file.docattachmentid && item.value.docoperationtype == file.type))
        (this.FrmAnexos.get('hv_info_step9') as FormArray).controls.splice((this.FrmAnexos.get('hv_info_step9') as FormArray).controls.findIndex((frm: AbstractControl<hv_info_attachments>)=> frm.value.docattachmentid == file.docattachmentid && frm.value.docoperationtype == file.type), 1);
      (this.FrmAnexos.controls['hv_info_step9'] as FormArray).push(this.fb.control({"hvId" : this.hvId, "docattachmentid" : file.docattachmentid, "docoperationtype": file.type, "documentname" : file.name, "expireat": file.expireat, "documentdate": _fechaExp != null ? _fechaExp : null}));
    }
    // console.log("Carga frmanexo");
    // console.log(this.FrmAnexos.value);  
  }

  changeDateP(event:any, file: any){
    if(this.FilesSend.some(item => item.position == file.docattachmentid && item.type == file.type))
    {
      this.FilesSend.filter(item => item.position == file.docattachmentid && item.type == file.type)[0].documentdate = event.target.value;
      if((this.FrmAnexos.get('hv_info_step9') as FormArray).controls.some((item: AbstractControl<hv_info_attachments>) => item.value.docattachmentid == file.docattachmentid && item.value.docoperationtype == file.type) && file.docattachmentid != null)
        (this.FrmAnexos.get('hv_info_step9') as FormArray).controls.filter((frm: AbstractControl<hv_info_attachments>)=> frm.value.docattachmentid == file.docattachmentid && frm.value.docoperationtype == file.type)[0].value.documentdate = event.target.value;
      else
        (this.FrmAnexos.controls['hv_info_step9'] as FormArray).push(this.fb.control({"hvId" : this.hvId, "docattachmentid" : file.docattachmentid, "docoperationtype": file.type, "documentname" : file.name, "expireat": file.expireat, "documentdate": event.target.value}));
    }
    else
    {
      event.target.value = null;
      Swal.fire("Advertencia", "Debe adjuntar primero el documento antes de asignarle una fecha!", 'warning');
    }
    // console.log("en change");
    // console.log(this.FilesSend);
  }

  private LoadDocStep9(rta: any){
    //Asigna los archivos que el cliente tiene asignados
    this.Files = rta.files;
    //Verifica que el paso nueve exista o ya tenga diligenciado el paso 9
    if(rta.data.Step9 != undefined && rta.data.Step9 != null && rta.data.Step9.length > 0)
    {
      let fecc = null;
      rta.data.Step9.forEach((item: any) =>{
        if(this.Files.some((itf: filesApp) => itf.docattachmentid == item.docattachmentId && itf.type == item.docoperationtype))
        {
          //console.log(item.documentdate);
          fecc = new Date(item.documentdate);
          fecc.setDate(fecc.getDate() + 1);
          //console.log(fecc);
          this.Files.filter((itf: filesApp) => itf.docattachmentid == item.docattachmentId && itf.type == item.docoperationtype)[0].documentdate = fecc;
          //item.documentdate.setDate(item.documentdate.getDate() + 1);
          this.Files.filter((itf: filesApp) => itf.docattachmentid == item.docattachmentId && itf.type == item.docoperationtype)[0].nameEnc = item.documentname;
        }
      });
    }
    //Recorre los files para dibujar los botones y que queden todos con un ancho simetrico
    rta.files.forEach((item: any) => {
      this.botones.push(item.name);
      //No se deben agregar si no los q ya existen
      // if((rta.data.Step9 == undefined || rta.data.Step9.length == 0) || !rta.data.Step9.some((item: any) => item.docattachmentId == item.docattachmentid))
      //   this.FilesSend.push({position: item.docattachmentid, archivo: null, documentdate: null, expireat: item.expireat, name: item.name, type: item.type});
    });

    //Sí el paso nueve existe, carga los documentos
    if(rta.data.Step9 != undefined && rta.data.Step9 != null && rta.data.Step9.length > 0)
      this.LoadDocs(rta.data.Step9);
    //sí el cliente tiene archivos dibuja los botones
    if(this.botones.length > 0)
      this.CalcularAnchoMaximoBotones();
  }

  private LoadDocs(itemsStep9: hv_info_attachments[]){
    //console.log(itemsStep9);
    this.FilesSend = [];
    //(this.FrmAnexos.controls['hv_info_step9'] as FormArray).setValue(null);
    while (this.FrmAnexos.value['hv_info_step9'].length !== 0) {
      (this.FrmAnexos.controls['hv_info_step9'] as FormArray).removeAt(0);
    }
    itemsStep9.forEach((item: any)=>{
      if(this.Files.filter((it: filesApp) =>  it.docattachmentid == item.docattachmentId && it.type == item.docoperationtype).length > 0)
      {
        (this.FrmAnexos.controls['hv_info_step9'] as FormArray).push(this.fb.control({"hvId" : this.hvId, "docattachmentid" : item.docattachmentId, "docoperationtype": item.docoperationtype, "documentname" : this.Files.filter((it: filesApp) =>  it.docattachmentid == item.docattachmentId && it.type == item.docoperationtype)[0].name, "expireat": this.Files.filter((it: filesApp) => it.docattachmentid == item.docattachmentId && it.type == item.docoperationtype)[0].expireat, "documentdate": item.documentdate}));
        this.FilesSend.push({position: item.docattachmentId, archivo: null, documentdate: item.documentdate, expireat: this.Files.filter((it: filesApp) =>  it.docattachmentid == item.docattachmentId && it.type == item.docoperationtype)[0].expireat, name: this.Files.filter((it: filesApp) =>  it.docattachmentid == item.docattachmentId && it.type == item.docoperationtype)[0].name, type: item.docoperationtype});
      //Cargar los input de fecha cuando se guarda el paso 9
      if((document.getElementById("date" + item.docoperationtype + item.docattachmentId) as HTMLInputElement) != undefined)
        (document.getElementById("date" + item.docoperationtype + item.docattachmentId) as HTMLInputElement).value = this.datePipe.transform(item.documentdate, "dd/MM/yyyy");

      }
    });

    //if((this.FrmAnexos.controls['hv_info_step9'] as FormArray).controls.length === this.Files.length)
    //Si tiene un navegador padre, quuiere decir que se invocó el componente desde un proceso que no es del cliente quien puede cerrar
    //la hoja de vida, los otros procesos no pueden cerrar la hoja de vida, solo el cliente
    if(this.FrmAnexos.value['hv_info_step9'].length === this.Files.length && this.navegadorPadre == null)
      this.MostrarBtnFinalizar = true;
  }

  ClickInputFile(name: string){
    document.getElementById(name + 'h').click();
  }

  private ShowFileinIFrame(pdf: string){
    let pdfWindow = window.open("");
    pdfWindow.document.write("<html><head><title>Andina de Aduanas (Visualizar Documento)</title></head><body height='100%' width='100%'><iframe width='100%' height='100%' src='" + pdf + "'></iframe></body></html>");
  }
  //#endregion

  //#region Guardar o Editar Forms de Stepper
  GuardarEditarInfGeneral(result:any){
    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("legalrepresentativealt2").value))
    {
      this.FrmInfGeneral.controls['legalrepresentativealt2'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['legalrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emaillegalrepresentativealt2'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emaillegalrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocrepresentativealt2'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentrepresentativealt2'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargerepresentativealt2'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargerepresentativealt2'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['legalrepresentativealt2'].setValue(null);
      this.FrmInfGeneral.controls['legalrepresentativealt2'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['legalrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emaillegalrepresentativealt2'].setValue(null);
      this.FrmInfGeneral.controls['emaillegalrepresentativealt2'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emaillegalrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocrepresentativealt2'].setValue(null);
      this.FrmInfGeneral.controls['typedocrepresentativealt2'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentrepresentativealt2'].setValue(null);
      this.FrmInfGeneral.controls['documentrepresentativealt2'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentrepresentativealt2'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargerepresentativealt2'].setValue(null);
      this.FrmInfGeneral.controls['chargerepresentativealt2'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargerepresentativealt2'].updateValueAndValidity();
    }

    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("manager").value))
    {
      this.FrmInfGeneral.controls['manager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['manager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargemanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargemanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailmanager'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emailmanager'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['manager'].setValue(null);
      this.FrmInfGeneral.controls['manager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['manager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocmanager'].setValue(null);
      this.FrmInfGeneral.controls['typedocmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentmanager'].setValue(null);
      this.FrmInfGeneral.controls['documentmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargemanager'].setValue(null);
      this.FrmInfGeneral.controls['chargemanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargemanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailmanager'].setValue(null);
      this.FrmInfGeneral.controls['emailmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emailmanager'].updateValueAndValidity();
    }

    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("financialmanager").value))
    {
      this.FrmInfGeneral.controls['financialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['financialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocfinancialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocfinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentfinancialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentfinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargefinancialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargefinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailfinancialmanager'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emailfinancialmanager'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['financialmanager'].setValue(null);
      this.FrmInfGeneral.controls['financialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['financialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocfinancialmanager'].setValue(null);
      this.FrmInfGeneral.controls['typedocfinancialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocfinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentfinancialmanager'].setValue(null);
      this.FrmInfGeneral.controls['documentfinancialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentfinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargefinancialmanager'].setValue(null);
      this.FrmInfGeneral.controls['chargefinancialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargefinancialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailfinancialmanager'].setValue(null);
      this.FrmInfGeneral.controls['emailfinancialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emailfinancialmanager'].updateValueAndValidity();
    }

    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("administrator").value))
    {
      this.FrmInfGeneral.controls['administrator'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['administrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocadministrator'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentadministrator'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargeadministrator'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargeadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailadministrator'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emailadministrator'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['administrator'].setValue(null);
      this.FrmInfGeneral.controls['administrator'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['administrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocadministrator'].setValue(null);
      this.FrmInfGeneral.controls['typedocadministrator'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentadministrator'].setValue(null);
      this.FrmInfGeneral.controls['documentadministrator'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargeadministrator'].setValue(null);
      this.FrmInfGeneral.controls['chargeadministrator'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargeadministrator'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailadministrator'].setValue(null);
      this.FrmInfGeneral.controls['emailadministrator'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emailadministrator'].updateValueAndValidity();
    }

    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("commercialmanager").value))
    {
      this.FrmInfGeneral.controls['commercialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['commercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedoccommercialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedoccommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentcommercialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentcommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargecommercialmanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargecommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailcommercialmanager'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emailcommercialmanager'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['commercialmanager'].setValue(null);
      this.FrmInfGeneral.controls['commercialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['commercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedoccommercialmanager'].setValue(null);
      this.FrmInfGeneral.controls['typedoccommercialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedoccommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentcommercialmanager'].setValue(null);
      this.FrmInfGeneral.controls['documentcommercialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentcommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargecommercialmanager'].setValue(null);
      this.FrmInfGeneral.controls['chargecommercialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargecommercialmanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailcommercialmanager'].setValue(null);
      this.FrmInfGeneral.controls['emailcommercialmanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emailcommercialmanager'].updateValueAndValidity();
    }

    if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("ftrademanager").value))
    {
      this.FrmInfGeneral.controls['ftrademanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['ftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocftrademanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentftrademanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargeftrademanager'].setValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargeftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailftrademanager'].setValidators([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      this.FrmInfGeneral.controls['emailftrademanager'].updateValueAndValidity();
    }
    else
    {
      this.FrmInfGeneral.controls['ftrademanager'].setValue(null);
      this.FrmInfGeneral.controls['ftrademanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['ftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['typedocftrademanager'].setValue(null);
      this.FrmInfGeneral.controls['typedocftrademanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['typedocftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['documentftrademanager'].setValue(null);
      this.FrmInfGeneral.controls['documentftrademanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['documentftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['chargeftrademanager'].setValue(null);
      this.FrmInfGeneral.controls['chargeftrademanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['chargeftrademanager'].updateValueAndValidity();
      this.FrmInfGeneral.controls['emailftrademanager'].setValue(null);
      this.FrmInfGeneral.controls['emailftrademanager'].removeValidators([Validators.required]);
      this.FrmInfGeneral.controls['emailftrademanager'].updateValueAndValidity();
    }

    if(this.FrmInfGeneral.valid)
    {
      if( this.FrmInfGeneral.get("isoperator").value == true && StringIsNullOrEmpty(this.FrmInfGeneral.get("operatorname").value))
        Swal.fire("Advertencia", "Campo nombre del operador es obligatorio!", 'warning');
      // else if(StringIsNullOrEmpty(this.FrmInfGeneral.get("id").value) && this.FrmInfGeneral.get("isoperator").value == true && this.FrmInfGeneral.get("operatorfile").value == undefined)
      //   Swal.fire("Advertencia", "Campo archivo adjunto es obligatorio!", 'warning');
      else if(this.FrmInfGeneral.get("mailindepartment")?.value == undefined)
        Swal.fire("Advertencia", "Campo departamento es obligatorio!", 'warning');
      else if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("alternateaddress").value) && this.FrmInfGeneral.get("alternatedepartment")?.value == undefined)
        Swal.fire("Advertencia", "Campo departamento de cultivo es obligatorio!", 'warning');
      else if(this.FrmInfGeneral.get("mailincity")?.value == undefined)
        Swal.fire("Advertencia", "Campo ciudad es obligatorio!", 'warning');
      else if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("alternateaddress").value) && this.FrmInfGeneral.get("alternatecity")?.value == undefined)
        Swal.fire("Advertencia", "Campo ciudad de cultivo es obligatorio!", 'warning');
      else if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("alternatecity").value) && StringIsNullOrEmpty(this.FrmInfGeneral.get("alternateaddress")?.value))
        Swal.fire("Advertencia", "Si el campo ciudad cultivo está diligenciado, la dirección de cultivo es obligatorio!", 'warning');
      else if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("alternatedepartment").value) && StringIsNullOrEmpty(this.FrmInfGeneral.get("alternateaddress")?.value))
        Swal.fire("Advertencia", "Si el campo departamento de cultivo está diligenciado, la dirección de cultivo es obligatorio!", 'warning');
      else if(!StringIsNullOrEmpty(this.FrmInfGeneral.get("legalrepresentativealt2").value) && (this.FrmInfGeneral.get("typedocrepresentativealt2").value == "0"))
        Swal.fire("Advertencia", "Si el campo representante legal suplente 2 está diligenciado, los campos tipo de documento, número de documento, cargo y email son obligatorio!", 'warning');
      else
      {
        // if(StringIsNullOrEmpty(this.FrmInfGeneral.get("alternateaddress").value))
        // {
        //   this.FrmInfGeneral.get("alternateaddress").setValue(null);
        //   this.FrmInfGeneral.get("alternatedepartment").setValue(null);
        //   this.FrmInfGeneral.get("alternatecity").setValue(null);
        // }
        this.EsEdicionForm = !StringIsNullOrEmpty(this.FrmInfGeneral.get("id").value) &&  !StringIsNullOrEmpty(this.FrmInfGeneral.get("hvId").value) ? "Editar" : "Guardar";
        Swal.fire({
          title: (this.EsEdicionForm + " Información General"),
          text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información general de la hoja de vida?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: "Guardar",
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              //console.log(this.FrmInfGeneral.get("operatorfile").value);
              //document.getElementById('LoaderSend').style.display = 'block';
              this.MostrarSpinner = true;
              //console.log(this.FrmInfGeneral.value);
              this.servicio.SendPOSTWParamObs('hv', {"hv_info_step1" : this.FrmInfGeneral.value, "clientId": this.clientId}, true).then((rta: any) => 
              {
                //console.log(rta);
                if(rta.success)
                {
                  //Asignar campos para una posible edición sin terminar la hoja de vida
                  // this.FrmInfGeneral.controls["id"]?.setValue(rta.data.id);
                  // this.FrmInfGeneral.controls["hvId"]?.setValue(rta.data.hvId);
                  // this.FrmInfGeneral.controls["document"]?.setValue(rta.data.client.document);
                  // this.FrmInfGeneral.controls["companyname"]?.setValue(rta.data.client.nameenterprise);
                  this.LoadFrmInfGeneral(rta.data.Step1);
                  this.LoadDocStep9(rta);
                  setTimeout(() => {
                    this.Stepper.next();
                   }, 1);
                  this.MostrarSpinner = false;
                  Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                  //document.getElementById('LoaderSend').style.display = 'none';
                }
              });
            }
            catch{
              this.MostrarSpinner = false;
              //document.getElementById('LoaderSend').style.display = 'none';
              Swal.fire("Error al guardar o editar la información general de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
            }
          } 
        });   
      }
    }
  }

  private LoadFrmInfGeneral(data:any)
  {
    //console.log(data);
    //let docNamePDF = data.operatorfile;
    //data.operatorfile = null;
    //console.log(rta.data.Step1);
    this.FrmInfGeneral.setValue(data);
    //this.LoadValueNameinputFile(docNamePDF, "fakeFileInput");
    this.IsOperator(data.isoperator);
    //console.log(data);
    if(this.departamentosResp.filter((d: any) => d.id.toString() == data.mailindepartment.toString()).length > 0)
    {
      this.myControlDpto.setValue({"id" : this.departamentosResp.filter((d: any) => d.id.toString() == data.mailindepartment.toString())[0].id, "name" : this.departamentosResp.filter((d: any) => d.id.toString() == data.mailindepartment.toString())[0].name});
     //Se vuelve a asingar porq el evento change lo cambia en la línea anterior
     this.FrmInfGeneral.controls["mailincity"].setValue(data.mailincity);
     if(!StringIsNullOrEmpty(data.alternatedepartment))
       this.myControlDptoAlt.setValue({"id" : this.departamentosResp.slice().filter((d: any) => d.id.toString() == data.alternatedepartment)[0].id, "name" : this.departamentosResp.slice().filter((d: any) => d.id.toString() == data.alternatedepartment)[0].name});
      this.myControlCity.setValue({"id" : this.citiesdptoppalResp.slice().filter((c: any) => c.id.toString() == data.mailincity)[0].id, "name" : this.citiesdptoppalResp.slice().filter((c: any) => c.id.toString() == data.mailincity)[0].name});
    }


    if(!StringIsNullOrEmpty(data.alternatecity))
    {
      this.myControlCityAlt.setValue({"id" : this.citiesdptoppalResp.filter((c: any) => c.id.toString() == data.alternatecity)[0].id, "name" : this.citiesdptoppalResp.filter((c: any) => c.id.toString() == data.alternatecity)[0].name});
      //Se vuelve a asingar porq el evento change lo cambia en la línea anterior
      this.FrmInfGeneral.controls["alternatecity"].setValue(data.alternatecity);
    }
  }

  ValidarCamposObligatorios(Form: FormGroup, Campo: string){
    return hasRequiredValidator(Form, Campo);
  }

  GuardarEditarInfPerAut(){
    if(this.dataSourcePA.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agregado ningún registro al detalle de personas autorizadas para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourcePA.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información Personas Autorizadas"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de personas autorizadas de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let modelo = this.dataSourcePA.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, fullName: obj.fullName, document: obj.document, charge: obj.charge, email: obj.email, phone: obj.phone}
            });
            
            this.servicio.SendPOSTWParamObs('hv', {"hv_info_step2" : modelo, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //console.log(rta);
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmPersonAutStep.controls["hvId"]?.setValue(rta.data[0].id);
                //Swal.fire("bie", JSON.stringify(rta.data), "error");
                setTimeout(() => {
                  this.Stepper.next();
                 }, 1);
                this.MostrarSpinner = false;
               this.ReloadGrid(rta.data, this.dataSourcePA, 2);
                //document.getElementById('LoaderSend').style.display = 'none';
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            //document.getElementById('LoaderSend').style.display = 'none';
            Swal.fire("Error al guardar o editar la información general de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });  
    }
  }

  // AddPerAut(result:any){
  AddPerAut(){
    if(this.FrmPersonAut.valid)
    {
      let row: any = this.FrmPersonAut.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaPerAut({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"]
      this.dataSourcePA.data.push(row);
      this.dataSourcePA._updateChangeSubscription();
      // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
      this.FrmPersonAut.reset();
        //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourcePA.data.length >= 1)
        this.FrmPersonAutStep.controls["hvId"]?.setValue(this.hvId);
    }
  }

  EliminarFilaPerAut(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourcePA.data.indexOf(objetoEnviado.row);
    this.dataSourcePA.data.splice(index, 1);
    this.dataSourcePA._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourcePA.data.length <= 0)
      this.FrmPersonAutStep.controls["hvId"]?.setValue(null);
  }

  EditarRowPerAut(row: any){
    this.FrmPersonAut.setValue({document: row.row.document, charge: row.row.charge, email: row.row.email, fullName: row.row.fullName, hvId: row.row.hvId, id: row.row.id, phone: row.row.phone, controleditar:row.row});
  }

  GuardarEditarRefCom(){
    if(this.dataSourceRC.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún registro al detalle de referencias comerciales para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourceRC.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información de Referencias Comerciales"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de las referencias comerciales de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let modelo3 = this.dataSourceRC.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, company: obj.company,  phone: obj.phone}
            });

            let modelo4 = null;
            if(this.dataSourceRB.data.length > 0)
            {
              modelo4 = this.dataSourceRB.data.map(function(obj){
                return {id: obj.id, hvId: obj.hvId, company: obj.company,  phone: obj.phone}
              });
            }

            this.servicio.SendPOSTWParamObs('hv', modelo4 != null ? {"hv_info_step3" : modelo3, "hv_info_step4" : modelo4, "clientId": this.clientId} : {"hv_info_step3" : modelo3, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmRefStep.controls["hvIdRC"]?.setValue(rta.data[0].id);
                this.ReloadGrid(rta.data, this.dataSourceRC, 3);
                this.MostrarSpinner = false;
                if(!StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRC"]?.value) && !StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRB"]?.value))
                {
                  setTimeout(() => {
                    this.Stepper.next();
                  }, 1);
                }
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            Swal.fire("Error al guardar o editar la información referencias comerciales de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });  
    }
  }

  AddRefCo(){
    if(this.FrmRefComer.valid)
    {
      let row: any = this.FrmRefComer.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaRefC({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"]
      if(this.dataSourceRC.data.length<1)
      this.dataSourceRC.data.push(row);
      this.dataSourceRC._updateChangeSubscription();
      // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
      this.FrmRefComer.reset();
        //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourceRC.data.length >= 1)
        this.FrmRefStep.controls["hvIdRC"]?.setValue(this.hvId);
    }
  }

  EliminarFilaRefC(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourceRC.data.indexOf(objetoEnviado.row);
    this.dataSourceRC.data.splice(index, 1);
    this.dataSourceRC._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourceRC.data.length <= 0)
      this.FrmRefStep.controls["hvIdRC"]?.setValue(null);
  }

  EditarRowRefC(row: any){
    this.FrmRefComer.setValue({hvId: row.row.hvId, id: row.row.id, company: row.row.company, phone: row.row.phone, controleditar:row.row});
  }

  GuardarEditarRefB(){
    if(this.dataSourceRB.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún registro al detalle de referencias bancarias para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourceRB.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información de Referencias Bancarias"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de las referencias bancarias de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let modelo3 = null;
            if(this.dataSourceRC.data.length > 0)
            {
              modelo3 = this.dataSourceRC.data.map(function(obj){
                return {id: obj.id, hvId: obj.hvId, company: obj.company,  phone: obj.phone}
              });
            }

            let modelo4 = this.dataSourceRB.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, company: obj.company,  phone: obj.phone}
            });

            this.servicio.SendPOSTWParamObs('hv', modelo3 != null ? {"hv_info_step3" : modelo3, "hv_info_step4" : modelo4, "clientId": this.clientId} : {"hv_info_step4" : modelo4, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmRefStep.controls["hvIdRB"]?.setValue(rta.data[0].id);
                this.ReloadGrid(rta.data, this.dataSourceRB, 4);
                this.MostrarSpinner = false;
                if(!StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRB"]?.value) && !StringIsNullOrEmpty(this.FrmRefStep.controls["hvIdRC"]?.value))
                {
                  setTimeout(() => {
                    this.Stepper.next();
                  }, 1);
                }
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            Swal.fire("Error al guardar o editar la información referencias bancarias de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });  
    }
  }

  AddRefB(){
    if(this.FrmRefBanc.valid)
    {
      let row: any = this.FrmRefBanc.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaRefB({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"]
      if(this.dataSourceRB.data.length<1)
      this.dataSourceRB.data.push(row);
      this.dataSourceRB._updateChangeSubscription();
      // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
      this.FrmRefBanc.reset();
        //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourceRB.data.length >= 1)
        this.FrmRefStep.controls["hvIdRB"]?.setValue(this.hvId);
    }
  }

  EliminarFilaRefB(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourceRB.data.indexOf(objetoEnviado.row);
    this.dataSourceRB.data.splice(index, 1);
    this.dataSourceRB._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourceRB.data.length <= 0)
      this.FrmRefStep.controls["hvIdRB"]?.setValue(null);
  }

  EditarRowRefB(row: any){
    this.FrmRefBanc.setValue({hvId: row.row.hvId, id: row.row.id, company: row.row.company, phone: row.row.phone, controleditar:row.row});
  }

  GuardarEditarRefCE(){
    if(this.dataSourceRCE.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún registro al detalle de referencias exteriores para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourceRCE.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información de Referencias de Clientes Exteriores"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de las referencias de clientes exteriores de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let modelo5 = this.dataSourceRCE.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, company: obj.company, contactname: obj.contactname, country: obj.country, city: obj.city,  phone: obj.phone, antiquity: obj.antiquity, products: obj.products}
            });

            let modelo6 = null;
            if(this.dataSourceRPE.data.length > 0)
            {
              modelo6 = this.dataSourceRPE.data.map(function(obj){
                return {id: obj.id, hvId: obj.hvId, company: obj.company, contactname: obj.contactname, country: obj.country, city: obj.city,  phone: obj.phone, antiquity: obj.antiquity, products: obj.products}
              });
            }
            this.servicio.SendPOSTWParamObs('hv', modelo6 == null ? {"hv_info_step5" : modelo5, "clientId": this.clientId} : {"hv_info_step5" : modelo5, "hv_info_step6" : modelo6, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmRefEYPStep.controls["hvIdE"]?.setValue(rta.data[0].id);
                 this.ReloadGrid(rta.data, this.dataSourceRCE, 5);
                this.MostrarSpinner = false;
                if(!StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdE"]?.value) || !StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdP"]?.value))
                {
                  setTimeout(() => {
                    this.Stepper.next();
                  }, 1);
                }
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            Swal.fire("Error al guardar o editar la información referencias de clientes del exterior de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });  
    }
  }

  AddRefCE(){
    if(this.FrmRefExt.valid)
    {
      let row: any = this.FrmRefExt.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaRefCE({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.antiquityv = (this.FrmRefExt.controls["antiquitya"]?.value + " año(s), " + this.FrmRefExt.controls["antiquitym"]?.value + " mes(es)");
      row.antiquity = (this.FrmRefExt.controls["antiquitya"]?.value + "," + this.FrmRefExt.controls["antiquitym"]?.value);
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"]
      if(this.dataSourceRCE.data.length < 2)
      {
        this.dataSourceRCE.data.push(row);
        this.dataSourceRCE._updateChangeSubscription();
        // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
        this.FrmRefExt.reset();
      }
      else
        Swal.fire("Máximo No Permitido", "No se pueden seguir agregando más referencias de clientes; el máximo permitido son dos!", "warning");
      //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourceRCE.data.length >= 1)
        this.FrmRefEYPStep.controls["hvIdE"]?.setValue(this.hvId);
    }
  }

  EliminarFilaRefCE(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourceRCE.data.indexOf(objetoEnviado.row);
    this.dataSourceRCE.data.splice(index, 1);
    this.dataSourceRCE._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourceRCE.data.length <= 0)
      this.FrmRefEYPStep.controls["hvIdE"]?.setValue(null);
  }

  EditarRowRefCE(row: any){
    this.FrmRefExt.setValue({hvId: row.row.hvId, id: row.row.id, company: row.row.company, contactname: row.row.contactname, country: row.row.country, city: row.row.city, phone: row.row.phone, antiquitya: row.row.antiquity.split(",")[0], antiquitym: row.row.antiquity.split(",")[1], products: row.row.products, controleditar:row.row});
  }

  validarTeclaNumerica(event: KeyboardEvent) {
    const teclaPresionada = event.key;

    // Verificar si la tecla presionada es un número
    if (!isNaN(Number(teclaPresionada)) || ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight','.'].includes(teclaPresionada)) {
      // Permitir la tecla
      return;
    } else {
      // Cancelar la tecla
      event.preventDefault();
    }
    }
  GuardarEditarRefPE(){
    if(this.dataSourceRPE.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún registro al detalle de referencias de proveedores para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourceRPE.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información de Referencias de Proveedores Exteriores"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de las referencias de proveedores exteriores de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            let modelo5 = null;
            if(this.dataSourceRCE.data.length > 0)
            {
              modelo5 = this.dataSourceRCE.data.map(function(obj){
                return {id: obj.id, hvId: obj.hvId, company: obj.company, contactname: obj.contactname, country: obj.country, city: obj.city,  phone: obj.phone, antiquity: obj.antiquity, products: obj.products}
              });
            }

            this.MostrarSpinner = true;
            let modelo6 = this.dataSourceRPE.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, company: obj.company, contactname: obj.contactname, country: obj.country, city: obj.city,  phone: obj.phone, antiquity: obj.antiquity, products: obj.products}
            });
            
            this.servicio.SendPOSTWParamObs('hv', modelo5 != null ? {"hv_info_step5" : modelo5, "hv_info_step6" : modelo6, "clientId": this.clientId} : {"hv_info_step6" : modelo6, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmRefEYPStep.controls["hvIdP"]?.setValue(rta.data[0].id);

                this.ReloadGrid(rta.data, this.dataSourceRPE, 6);
                this.MostrarSpinner = false;
                if(!StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdP"]?.value) || !StringIsNullOrEmpty(this.FrmRefEYPStep.controls["hvIdE"]?.value))
                {
                  setTimeout(() => {
                    this.Stepper.next();
                    }, 1);
                }
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            Swal.fire("Error al guardar o editar la información referencias de proveedores del exterior de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
          }
        } 
      });  
    }
  }

  AddRefPE(){
    if(this.FrmRefPExt.valid)
    {
      let row: any = this.FrmRefPExt.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaRefPE({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.antiquityv = (this.FrmRefPExt.controls["antiquitya"]?.value + " año(s), " + this.FrmRefPExt.controls["antiquitym"]?.value + " mes(es)");
      row.antiquity = (this.FrmRefPExt.controls["antiquitya"]?.value + "," + this.FrmRefPExt.controls["antiquitym"]?.value);
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"]
      if(this.dataSourceRPE.data.length < 2)
      {
        this.dataSourceRPE.data.push(row);
        this.dataSourceRPE._updateChangeSubscription();
        // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
        this.FrmRefPExt.reset();
      }
      else
      Swal.fire("Máximo No Permitido", "No se pueden seguir agregando más proveedores; el máximo permitido son dos!", "warning");
        //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourceRPE.data.length >= 1)
        this.FrmRefEYPStep.controls["hvIdP"]?.setValue(this.hvId);
    }
  }

  EditarRowRefPE(row: any){
    this.FrmRefPExt.setValue({hvId: row.row.hvId, id: row.row.id, company: row.row.company, contactname: row.row.contactname, country: row.row.country, city: row.row.city, phone: row.row.phone, antiquitya: row.row.antiquity.split(",")[0], antiquitym: row.row.antiquity.split(",")[1], products: row.row.products, controleditar:row.row});
  }

  EliminarFilaRefPE(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourceRCE.data.indexOf(objetoEnviado.row);
    this.dataSourceRPE.data.splice(index, 1);
    this.dataSourceRPE._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourceRPE.data.length <= 0)
      this.FrmRefEYPStep.controls["hvIdP"]?.setValue(null);
  }

  GuardarEditarInfoFin(){
    if(this.FrmInfoFinanciera.valid)
    {
      if((this.FrmInfoFinanciera.controls["subscribedcapital"]?.value.toString()).replace('$','').replace(',','').replace('.00','') <= 0)
        Swal.fire("Advertencia", "Campo capital suscrito debe ser mayor a cero!", "warning");
      else if(this.FrmInfoFinanciera.controls["regimen"]?.value == "NA")
        Swal.fire("Advertencia", "Campo tipo de régimen es obligatorio!", "warning");
      // else if(StringIsNullOrEmpty(this.FrmInfoFinanciera.get("id").value) && this.FrmInfoFinanciera.get("hasfiscalreview").value == true && this.FrmInfoFinanciera.get("certificationdictamenfile").value == undefined)
      //   Swal.fire("Advertencia", "Campo archivo adjunto de responsable fiscal es obligatorio!", 'warning');
      else{
        if(this.FrmInfoFinanciera.controls["isretainingagent"]?.value == false)
        {
          this.FrmInfoFinanciera.controls["taxretencion"]?.setValue(0);
          this.FrmInfoFinanciera.controls["taxretencion"].enable();
        }
        else
        {
          //Asegurar que el campo decimal lleve el decimal formateado
          this.FrmInfoFinanciera.get("taxretencion")?.setValue(ConvertStringToDecimal(this.FrmInfoFinanciera.get("taxretencion")!.value).toString());
        }
        this.EsEdicionForm = !StringIsNullOrEmpty(this.FrmInfoFinanciera.get("id").value) &&  !StringIsNullOrEmpty(this.FrmInfoFinanciera.get("hvId").value) ? "Editar" : "Guardar";
        Swal.fire({
          title: (this.EsEdicionForm + " Información de Financiera"),
          text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información financiera de la hoja de vida?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: "Guardar",
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              this.MostrarSpinner = true;             
              this.servicio.SendPOSTWParamObs('hv', {"hv_info_step7" : this.FrmInfoFinanciera.value, "clientId": this.clientId}, true).then((rta: any) => {
                if(rta.success)
                {
                  this.LoadFrmInfFinanciera(rta.data.Step7);
                  this.LoadDocStep9(rta);
                  setTimeout(() => {
                    this.Stepper.next();
                    }, 1);
                  this.MostrarSpinner = false;
                  Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                }
              });
            }
            catch{
              this.MostrarSpinner = false;
              Swal.fire("Error al guardar o editar la información financiera de la hoja de vida", "Ha ocurrido un error inesperado!", "error");
            }
          } 
        });  
      }
    }
  }

  private LoadFrmInfFinanciera(data:any){
    //let docNamePDF = data.certificationdictamenfile;
    //data.certificationdictamenfile = null;
    this.FrmInfoFinanciera.setValue(data);
    //this.LoadValueNameinputFile(docNamePDF, "fakeFileInputRF");
    //this.Isfiscalreview(data.hasfiscalreview);
    this.HabilitarCamposFrmFinanciera(data.isselfretaining, 'retainingresolution');
    this.HabilitarCamposFrmFinanciera(data.isgreatcontributor, 'greatcontributorresolution');
    this.HabilitarCamposFrmFinanciera(data.isretainingagent, 'taxretencion');
    this.HabilitarCamposFrmFinanciera(!StringIsNullOrEmpty(data.contactinvoicealternativeemail), 'contactinvoicealternativeemail');

  }

  GuardarEditarInfAcci(){
    if(this.dataSourceAcc.data.length <= 0)
      Swal.fire("Advertencia", "No se ha agreagado ningún registro al detalle de accionistas para poder guardar o editar!", "warning");
    else{
      this.EsEdicionForm = this.dataSourceAcc.data.some(i => !StringIsNullOrEmpty(i.id)) ? "Editar" : "Guardar";
      Swal.fire({
        title: (this.EsEdicionForm + " Información de Accionistas"),
        text: "¿Desea " + this.EsEdicionForm.toLowerCase() + " la información de accionistas de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let modelo = this.dataSourceAcc.data.map(function(obj){
              return {id: obj.id, hvId: obj.hvId, company: obj.company, typedoc: obj.typedoc, document: obj.document, country: obj.country}
            });
            //console.log({"hv_info_step8" : modelo, "clientId": this.clientId});
            this.servicio.SendPOSTWParamObs('hv', {"hv_info_step8" : modelo, "clientId": this.clientId}, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                //Asignar campos para una posible edición sin terminar la hoja de vida, no mover para que el stepper pase a la siguiente hoja
                this.FrmAccionistasStep.controls["hvId"]?.setValue(rta.data[0].id);
                setTimeout(() => {
                  this.Stepper.next();
                }, 1);
                this.MostrarSpinner = false;
                // this.ReloadGrid(rta.data, this.dataSourceAcc);
                this.ReloadGrid(this.addtypedocdesStep8(rta.data), this.dataSourceAcc, 8);
              }
            });
          }
          catch{
            this.MostrarSpinner = false;
            //document.getElementById('LoaderSend').style.display = 'none';
            Swal.fire("Ha ocurrido un error inesperado", "Error al guardar o editar la información de accionistas de la hoja de vida", "error");
          }
        } 
      });  
    }
  }

  AddAcc(){
    if(this.FrmAccionistas.valid)
    {
      let row: any = this.FrmAccionistas.value;
      //Si es editar debe eliminar el row editado
      if(row.controleditar != null)
        this.EliminarFilaAcc({row: row.controleditar, verPadre: false});

      row.hvId = this.hvId;
      row.controleditar = null;
      row.acciones = ["delete_forever", "clic para eliminar esta fila"];
      row.typedocdes = NameTipeDocument(parseInt(this.FrmAccionistas.controls['typedoc'].value));
      //console.log(row);
      this.dataSourceAcc.data.push(row);
      this.dataSourceAcc._updateChangeSubscription();
      // this.FormPA.reset({id:null, hvId: null, fullName: null, charge: '', email: '', phone: '', controleditar: null});
      this.FrmAccionistas.reset();
        //Para validar la grilla cuando esté llena, puede continuar al siguiente paso
      if(this.dataSourceAcc.data.length >= 1)
        this.FrmAccionistasStep.controls["hvId"]?.setValue(this.hvId);
    }
  }

  EliminarFilaAcc(objetoEnviado: PassModelBotonGrid){
    let index = this.dataSourceAcc.data.indexOf(objetoEnviado.row);
    this.dataSourceAcc.data.splice(index, 1);
    this.dataSourceAcc._updateChangeSubscription();
    //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
    if(this.dataSourceAcc.data.length <= 0)
      this.FrmAccionistasStep.controls["hvId"]?.setValue(null);
  }

  EditarRowPerAcc(row: any){
    this.FrmAccionistas.setValue({hvId: row.row.hvId, id: row.row.id, company: row.row.company, typedoc: row.row.typedoc, document: row.row.document, country: row.row.country, createdAt: null, updatedAt: null, controleditar:row.row});
  }

  GuardarAnexos(result:any){
    // this.FilesSend.forEach((pdf, index) => {
    //   console.log(pdf);
    // });

    let size = (((this.FilesSend.reduce((acu, file) => acu + (file.archivo != undefined ? file.archivo.size : 0), 0)) / 1024) / 1024);
    //console.log(this.FrmAnexos.controls['contratosuministrosfile'].value);
    //console.log(this.FilesSend);
    if(this.FilesSend.length == 0)
      Swal.fire("Adjuntos No Encontrados", 'Para poder guardar este paso de anexos, debe adjuntar al menos un archivo!', 'warning');
    else if(size > 5)
      Swal.fire("Límite de Tamaño en Adjuntos", 'Los archivos que se han adjuntado superan el tamaño máximo permitido!<br>Tamaño máximo permitido: 5 MB.<br>Tamaño de archivos: ' + size.toFixed(2) + ' MB', 'warning');
    //OJO aquí tiene q validar o cambiar a frmanexos porq si no se edita o crea documento no va a estar lleno
    else if(this.FilesSend.some((item: fileHV) => item.expireat > 0 && (item.documentdate == null || item.documentdate == undefined)))
    {
      // console.log("FileSend");
      // console.log(this.FilesSend);
      Swal.fire("Fecha de Documento", 'Uno o más documento(s) exigen fecha de expedición del mismo y no se ha diligenciado la fecha.<br>Diligencie la fecha para poder guardar el documento!', 'warning');
    }
    else if(this.mstoggleCS.checked && StringIsNullOrEmpty(this.FrmAnexos.controls['contratosuministrosfile'].value))
      Swal.fire("Archivo Contrato Suministro", 'Si tiene un contrato de suministros es obligatorio cargar el archivos .xls!', 'warning');
    else
    {
      //Validar que el documento de cada archivo si tiene expireat no se haya vencido 10/10/2023 + 90 > 11/11/2023
      let arcvencido: string[] = [];
      if(this.FilesSend.some(item => item.expireat > 0))
      {
        let fecc: Date;
        this.FilesSend.filter(item => item.expireat > 0).forEach((item: fileHV) => {
          fecc = new Date(item.documentdate);
          fecc.setDate(fecc.getDate() + item.expireat);
          // console.log(fecc);
          if(new Date(fecc) < new Date())
              arcvencido.push(item.name);
        });
      }

      if(arcvencido.length > 0)
        Swal.fire("Documentos Vencidos", 'Uno o más archivos adjuntos están vencidos, verifique la(s) fecha(s) de expedición!<br>Documento(s) vencido(s):' + arcvencido.join("<br>") , 'warning');
      else
      {
        Swal.fire({
          title: ("Guardar o Editar Información de Anexos"),
          text: "¿Desea guardar o editar los anexos de la información de la hoja de vida?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: "Guardar",
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              this.MostrarSpinner = true;
              this.msjspinner = "Guardando los documentos anexos, por favor espere...";
              let _hv_info_step9 = new FormData();
              this.FilesSend.forEach((pdf, index) => {
                if(pdf.archivo != null)
                {                
                  _hv_info_step9.append('files', pdf.archivo, (pdf.type + '_' + pdf.position));
                }
                // if(pdf.archivo != null)
                // {                
                //   const nuevoNombreFile = (pdf.type + '_' + pdf.name);
                //   const archivoRenombrado = new File([pdf.archivo], nuevoNombreFile, {type: pdf.archivo.type});
                //   _hv_info_step9.append('files', archivoRenombrado);
                // }
              });
              if(this.mstoggleCS.checked)
              {
                _hv_info_step9.append('files', this.FrmAnexos.controls['contratosuministrosfile'].value, 'Formato_Contrato_Suministros.xlsx');
                this.FrmAnexos.controls['contratosuministrosfile'].setValue(null);
              }
              _hv_info_step9.append("clientId", this.clientId.toString());
              _hv_info_step9.append("hv_info_step9", JSON.stringify(this.FrmAnexos.controls["hv_info_step9"].value));
              //console.log(_hv_info_step9);
              this.servicio.SendPOSTWParamFiles('hv', _hv_info_step9).then((rta: ResponseM2) => {
                if(rta.success)
                {
                  //console.log(rta.data);
                  //  console.log(rta.data[0].documentdate);
                  this.LoadDocs(rta.data);
                  this.MostrarSpinner = false;
                  this.msjspinner = null;
                  if(rta.data.length == this.FilesSend.length)
                    Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (rta.success && this.navegadorPadre == null ? "<br>Ha finalizado de adjuntar los documentos requeridos. Ahora puede finalizar el proceso de hoja de vida" : "")), rta.success ? "success" : 'warning');
                  else
                    Swal.fire(rta.success ? this.EsEdicionForm == "Editar" ?  "Registro Editado" : "Registro Guardado" : "Advertencia", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
                }
                else
                  Swal.fire("Error Guardando Documentos", rta.message, 'warning');
              });
            }
            catch(excepcion){
              this.MostrarSpinner = false;
              this.msjspinner = null;
              //document.getElementById('LoaderSend').style.display = 'none';
              Swal.fire("Ha ocurrido un error inesperado", "Error al guardar o editar la información general de la hoja de vida<br>Motivo:" + excepcion, "error");
            }
          } 
        });
      }
    }
  }

  finalizarHV(){
    Swal.fire({
      title: ("Finalizar Proceso de Hoja de Vida"),
      html: '<div style="text-align: justify">Al pulsar el boton "Finalizar" usted está certificando que <strong>la información aquí ingresada es la correcta, verídica y que no presentará cambios de estos datos una vez hayan sido autorizados por el revisor</strong>. Si tiene dudas, regrese el comienzo, revise nuevamente toda la información y de finalizar.<br><br>¿Está seguro que desea finalizar el proceso de cargue de información de la hoja de vida?</div>',
      showCancelButton: true,
      cancelButtonText:'No, cancelar',
      confirmButtonText: "Si, finalizar",
      confirmButtonColor: '#2780e3',
    }).then((result) => {
      if (result.isConfirmed) {
        try
        {
          this.MostrarSpinner = true;
          this.msjspinner = "Finalizando el proceso de hoja de vida, por favor espere...";
          this.servicio.SendPOSTWParamObs('hv/publish', {"hvId" : this.hvId}, true).then((rta: ResponseM2) => {
            if(rta.success)
            {
              //Swal.fire("Proceso Finalizado", (rta.message + (!rta.success ? CompositeMensajeFields(rta) : "")), rta.success ? "success" : 'warning');
              //this.GetInfoIni();
              //this.MostrapnlHV = true;
              this.MostrarSpinner = false;
              this.msjspinner = null;
              Swal.fire({
                title: ("Proceso Finalizado"),
                text: rta.message,
                showCancelButton: false,
                confirmButtonText: "OK",
                confirmButtonColor: '#2780e3',
              }).then((result) => {
                if (result.isConfirmed) {
                    this.backListado();
                }
              });
            }
          });
        }
        catch(excepcion){
          this.MostrarSpinner = false;
          this.msjspinner = null;
          //document.getElementById('LoaderSend').style.display = 'none';
          Swal.fire("Ha ocurrido un error inesperado", "Error al finalizar la información general de la hoja de vida<br>Motivo:" + excepcion, "error");
        }
      } 
    });
  }

  // EliminarFilaGrid(objetoEnviado: PassModelBotonGrid, dataSource: MatTableDataSource<any>, campoControl: object){
  //   let index = this.dataSourcePA.data.indexOf(objetoEnviado.row);
  //   dataSource.data.splice(index, 1);
  //   dataSource._updateChangeSubscription();
  //   //Para validar la grilla cuando quede vacía, no puede continuar al siguiente paso
  //   if(dataSource.data.length <= 0)
  //     (campoControl as FormControl).setValue(null);
  // }

  private addtypedocdesStep8(Step8: any){
    let data = Step8;
    data.forEach((item: any) =>{
      item.typedocdes = NameTipeDocument(parseInt(item.typedoc));
    });
    return data;
  }
  private ReloadGrid(data:any, dataSource: MatTableDataSource<any>, paso: number)
  {
    let dataAccion = data;
    if(paso == 5 || paso == 6)
    {
      dataAccion.forEach((i: any)=>    
      {
        i.acciones = ["delete_forever", "clic para eliminar esta fila"],
        i.controleditar = null,
        i.antiquityv = (i.antiquity.split(",")[0] + " año(s), " + i.antiquity.split(",")[1] + " mes(es)")
      });
    }
    else
     {
      dataAccion.forEach((i: any)=> {
        i.acciones = ["delete_forever", "clic para eliminar esta fila"],
        i.controleditar = null
      });
    }
    dataSource.data = null;
    dataSource.data = dataAccion;
  }

  // private ReloadGrid(data:any)
  // {
  //   let dataAccion = data;
  //   dataAccion.forEach((i: any)=>{
  //     i.acciones = ["delete_forever", "clic para eliminar esta fila"],
  //     i.controleditar = null
  //   });
  //   this.dataSourceRC.data = null;
  //   this.dataSourceRC.data = dataAccion;
  // }
  //#endregion

  //#region Checkbox
  IsOperator(value: boolean){
    if(value) {
      this.FrmInfGeneral.controls['operatorname'].enable();
      // this.FrmInfGeneral.controls['operatorfile'].enable();
      //document.getElementById("fakeFileInput").removeAttribute("disabled");
    } 
    else 
    {
      this.FrmInfGeneral.controls['operatorname']?.setValue(null);
      this.FrmInfGeneral.controls['operatorname'].disable();
      // this.FrmInfGeneral.controls['operatorfile']?.setValue(null);
      // this.FrmInfGeneral.controls['operatorfile'].disable();
      //document.getElementById("fakeFileInput").setAttribute("disabled","disabled");
      //this.LoadValueNameinputFile('', '');
    }
  }

  // Isfiscalreview(value: boolean){
  //   if(value) {
  //     this.FrmInfoFinanciera.controls['certificationdictamenfile'].enable();
  //     document.getElementById("fakeFileInputRF").removeAttribute("disabled");
  //   } 
  //   else 
  //   {
  //     this.FrmInfoFinanciera.controls['certificationdictamenfile']?.setValue(null);
  //     this.FrmInfoFinanciera.controls['certificationdictamenfile'].disable();
  //     document.getElementById("fakeFileInputRF").setAttribute("disabled","disabled");
  //     this.LoadValueNameinputFile('', '');
  //   }
  // }

  HabilitarCamposFrmFinanciera(value: boolean, nameField: string){
    if(value)
    {
      this.FrmInfoFinanciera.controls[nameField].enable();
      this.FrmInfoFinanciera.get(nameField).setValidators([Validators.required]);
      this.FrmInfoFinanciera.get(nameField).updateValueAndValidity();
    }
    else 
    {
      this.FrmInfGeneral.controls[nameField]?.setValue(nameField == "taxretencion" ? 0 : null);
      this.FrmInfoFinanciera.controls[nameField].disable();
      this.FrmInfoFinanciera.get(nameField).setValidators(null);
      this.FrmInfoFinanciera.get(nameField).updateValueAndValidity();
    }
  }

  //#region Métodos por separados de los check's
  // IsSelFretaining(value: boolean){
  //   if(value)
  //   {
  //     this.FrmInfoFinanciera.controls['retainingresolution'].enable();
  //     this.FrmInfoFinanciera.get('retainingresolution').setValidators([Validators.required]);
  //     this.FrmInfoFinanciera.get('retainingresolution').updateValueAndValidity();
  //   }
  //   else 
  //   {
  //     this.FrmInfoFinanciera.controls['retainingresolution']?.setValue(null);
  //     this.FrmInfoFinanciera.controls['retainingresolution'].disable();
  //     this.FrmInfoFinanciera.get('retainingresolution').setValidators(null);
  //     this.FrmInfoFinanciera.get('retainingresolution').updateValueAndValidity();
  //   }
  // }

  // IsGreatContributor(value: boolean){
  //   if(value)
  //   {
  //     this.FrmInfoFinanciera.controls['greatcontributorresolution'].enable();
  //     this.FrmInfoFinanciera.get('greatcontributorresolution').setValidators([Validators.required]);
  //     this.FrmInfoFinanciera.get('greatcontributorresolution').updateValueAndValidity();
  //   }
  //   else 
  //   {
  //     this.FrmInfoFinanciera.controls['greatcontributorresolution']?.setValue(null);
  //     this.FrmInfoFinanciera.controls['greatcontributorresolution'].disable();
  //     this.FrmInfoFinanciera.get('greatcontributorresolution').setValidators(null);
  //     this.FrmInfoFinanciera.get('greatcontributorresolution').updateValueAndValidity();
  //   }
  // }

  // IsRetainingAgent(value: boolean){
  //   if(value)
  //   {
  //     this.FrmInfoFinanciera.controls['taxretencion'].enable();
  //     this.FrmInfoFinanciera.get('taxretencion').setValidators([Validators.required]);
  //     this.FrmInfoFinanciera.get('taxretencion').updateValueAndValidity();
  //   }
  //   else 
  //   {
  //     this.FrmInfoFinanciera.controls['taxretencion']?.setValue(0);
  //     this.FrmInfoFinanciera.controls['taxretencion'].disable();
  //     this.FrmInfoFinanciera.get('taxretencion').setValidators(null);
  //     this.FrmInfoFinanciera.get('taxretencion').updateValueAndValidity();
  //   }
  // }

  // EmailAlterno(value: boolean){
  //   if(value)
  //   {
  //     this.FrmInfoFinanciera.controls['contactinvoicealternativeemail'].enable();
  //     this.FrmInfoFinanciera.get('contactinvoicealternativeemail').setValidators([Validators.required]);
  //     this.FrmInfoFinanciera.get('contactinvoicealternativeemail').updateValueAndValidity();
  //   }
  //   else 
  //   {
  //     this.FrmInfGeneral.controls['contactinvoicealternativeemail']?.setValue(null);
  //     this.FrmInfoFinanciera.controls['contactinvoicealternativeemail'].disable();
  //     this.FrmInfoFinanciera.get('contactinvoicealternativeemail').setValidators(null);
  //     this.FrmInfoFinanciera.get('contactinvoicealternativeemail').updateValueAndValidity();
  //   }
  // }
  //#endregion
  //#endregion

  backListado(){
    //this.MostrapnlHV = true;
    // const currentUrl = this.router.url;
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   // Navega de nuevo a la URL original
    //   this.router.navigate([currentUrl]);
    // });
    //console.log("Regerso");
    //this.router.navigate(['/hv_clients'], {skipLocationChange: true});
    //window.location.reload();
    // this.cdRef.detectChanges();
    // this.Stepper.ngOnDestroy();
    // setTimeout(() => {
    //   this.Stepper.reset(); // Crear un nuevo stepper
    // });
    // this.router.navigate(['/']);
    // this.router.navigate(['/hv_clients']);
    //console.log(this.navegadorPadre);
    if(StringIsNullOrEmpty(this.navegadorPadre))
      window.location.reload();
    else
    {
      this.router.navigate([this.navegadorPadre], {skipLocationChange: true});
      this.eventoFormPadre.emit(false);
      // this.router.navigate([this.navegadorPadre], {skipLocationChange: true}).then(() => {
      //   this.cdRef.detectChanges();
      // });
      // this.ngZone.run(() => {
      //   this.router.navigate([this.navegadorPadre]);
      // });
    }

    //this.router.navigate(['/hv_clients']);
    //this.FrmInfGeneral.reset();
    //this.dataSourcePA = new MatTableDataSource<any>();
  }

  downloadFile() {
    const filePath = '../../../assets/recursos/Formato_Contrato_Suministros.xlsx';
    return `/${filePath}`;
  }

  ContratoSuministro(value: boolean){
    this.ViewLoadCS = value;
  }

  // onStepChange(event:any){
  //     console.log(event.previouslySelectedStep);
  // }
}
