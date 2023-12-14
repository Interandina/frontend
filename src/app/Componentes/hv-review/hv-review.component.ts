import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ServicesComponent } from 'src/app/Services';
import { AprobarPDFsHV, ModelEditar, ModelGridClients, PassModelBotonGrid, PassModelBotonesGrid, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { NameTipeDocument, StringIsNullOrEmpty } from '../functions/FnGenericas';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs';


// export interface ChipColor {
//   name: string;
//   color: ThemePalette;
// }


// export interface ChipColor {
//   color: ThemePalette;
// }
@Component({
  selector: 'app-hv-review',
  templateUrl: './hv-review.component.html',
  styleUrls: ['./hv-review.component.css']
})
export class HvReviewComponent implements OnInit{
  public MostrapnlHV = true;
  MostrapnlDocRevi = false;
  dataSource = new MatTableDataSource<ModelGridClients>();
  //dataSource: new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  dataGrid: ModelGridClients[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  callbackBoton: Function;
  //Grilla Historico
  dataSourceC = new MatTableDataSource();
  dataColumnsC: any[];
  displayedColumnsC: string[];
  modelEditarC: ModelEditar;
  FieldsWithErrors: any[] = [];
  MostrarSpinner: boolean = false;
  ChipStep1: any[];
  ChipStep7: any[];
  //Grillas
  //Grilla Personas Aut
  dataSourcePA = new MatTableDataSource<any>();
  displayedColumnsPA: string[] = ["fullName", "charge", "phone", "email"];
  dataColumnsPA: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false }, {name: "fullName", title: "Nombres y Apellidos", display: true }, {name: "charge", title: "Cargo", display: true }, {name: "phone", title: "Celular", display: true }, {name: "email", title: "Correo Electrónico", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarPA: ModelEditar;
  //Grilla Referencia Comercial
  dataSourceRC = new MatTableDataSource<any>();
  displayedColumnsRC: string[] = ["company", "phone"];
  dataColumnsRC: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false }, {name: "company", title: "Referencia Comercial", display: true }, {name: "phone", title: "Celular", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRC: ModelEditar;
  //Grilla Referencias Bancarias
  dataSourceRB = new MatTableDataSource<any>();
  displayedColumnsRB: string[] = ["company", "phone"];
  dataColumnsRB: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false }, {name: "company", title: "Referencia Bancaria", display: true },  {name: "phone", title: "Celular", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRB: ModelEditar;
  //Grilla Referencias clientes externos
  dataSourceRCE = new MatTableDataSource<any>();
  displayedColumnsRCE: string[] = ["company", "contactname", "country", "city", "phone", "antiquity", "products"];
  dataColumnsRCE: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false }, {name: "company", title: "Datos de Empresa", display: true }, {name: "contactname", title: "Contacto", display: true}, {name: "country", title: "País de la empresa", display: true }, {name: "city", title: "Ciudad de la empresa", display: true }, {name: "phone", title: "Celular", display: true }, {name: "antiquity", title: "Antigüedad", display: true }, {name: "products", title: "Productos", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRCE: ModelEditar;
  //Grilla Referencias proveedores externos
  dataSourceRPE = new MatTableDataSource<any>();
  displayedColumnsRPE: string[] = ["company", "contactname", "country", "city", "phone", "antiquity", "products"];
  dataColumnsRPE: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false }, {name: "company", title: "Datos de Empresa", display: true }, {name: "contactname", title: "Contacto", display: true}, {name: "country", title: "País de la empresa", display: true }, {name: "city", title: "Ciudad de la empresa", display: true }, {name: "phone", title: "Celular", display: true }, {name: "antiquity", title: "Antigüedad", display: true }, {name: "products", title: "Productos", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarRPE: ModelEditar;
  //Grilla Accionistas
  dataSourceAcc = new MatTableDataSource<any>();
  displayedColumnsAcc: string[] = ["company", "typedocdes", "document", "country"];
  dataColumnsAcc: any[] = [{name: "id", title: "id", display: false }, {name: "hvId", title: "hvId", display: false }, {name: "node", title: "node", display: false },{name: "company", title: "Nombres o Razón Social", display: true }, {name: "typedoc", title: "Tipo documento", display: false }, {name: "typedocdes", title: "Tipo documento", display: true }, {name: "document", title: "Documento", display: true }, {name: "country", title: "País", display: true }, {name: "controleditar", title: "controleditar", display: false }];
  modelEditarAcc: ModelEditar;
  Documents:any[] =[];
  Supplies:String;
  Visualizar = false;
  //DocPDF: any = null;
  safePdfUrl: SafeUrl;
  arrayElementosNOK: string[] = [];
  FrmAprobarHV: FormGroup;
  hv_info_step9: AprobarPDFsHV[] =[];
  TituloBotonAproRechazar = "Aprobar";
  TituloBotonAproRechazarDocs = "Aprobar";
  ValueAproRechazarDocs = true;
  @ViewChild('slDoc', {static: false}) slDoc: ElementRef;
  @ViewChild('btnApRecDoc', {static: false}) btnApRecDoc: HTMLButtonElement;
  FrmDocsRev: FormGroup;
  currentDate = new Date(2025,2,31);
  currentD = new Date();
  DocLoad = false;
  reasonRR: any[] =[];
  DocsR: any[] =[];
  filteredOptionsDocs: Observable<any[]>;
  dataSourceDet = new MatTableDataSource<ModelGridClients>();
  //dataSource: new MatTableDataSource();
  dataColumnsDet: any[];
  displayedColumnsDet: string[];
  modelEditarDet: ModelEditar;
  hvId: number;
  nameenterprise: string;
  state: string;
  msjspinner: string;

  @ViewChild('txtDocEnc', {static: false}) txtDocEnc: ElementRef;

  constructor(private fb: FormBuilder, private servicio: ServicesComponent, private router: Router, private el: ElementRef, private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false
    };

    this.modelEditarC = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false
    };

    this.modelEditarPA = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step2'
    };

    this.modelEditarRC = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step3'
    };

    this.modelEditarRB = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step4'
    };

    this.modelEditarRCE = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step5' 
    };

    this.modelEditarRPE = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step6' 
    };

    this.modelEditarAcc = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: true,
      NameStep: 'Step8' 
    };

    this.modelEditarDet = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: true,
      RowReject: false
    };

    this.GetInfoIni();
    this.FrmAprobarHV = this.fb.group({
      id: new FormControl(null, Validators.required),
      isReject: new FormControl(false, Validators.required),
      fieldsReject: [],
      annotations: new FormControl (null, Validators.required),
      deadlinedate: new FormControl (null, Validators.required)
    });

    this.FrmAprobarHV.controls['deadlinedate'].setValue(new Date(2025,2,31));


  }
  
  GetInfoIni():void{
    this.servicio.SendGetWOutPObsHeaderAut('hv/').then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          //console.log(rta);
          if(rta.success)
          {
            //console.log(rta);
            this.dataSource = null;
            this.dataSourceC = null;
            this.dataGrid = rta.data.pending;
            this.dataGrid.forEach(i=>{
              i.acciones = ["border_color", "clic para editar esta fila"]
            });
            const dcc: any =[];
            rta.columns.forEach((item:any) => {
              dcc.push(Object.assign({}, item));
            });
            dcc.push({name: "acciones", title: "Acciones", display: true});
            this.dataColumnsC =  dcc;
            this.displayedColumnsC =  dcc.map((col:any)=>col.name);
            rta.columns.push({name: "acciones", title: "Acción", display: true});
            this.dataColumns = rta.columns;
            this.displayedColumns = rta.columns.map((col:any)=>col.name);
            this.dataSource = new MatTableDataSource(this.dataGrid);
            //Grilla historico
            rta.data.completed.forEach((item:any) =>{
              item.acciones =  item.state == "Aprobada" ? [{icon: "forward_to_inbox", title: "Reenviar correo del estado de la hoja de vida", indice: 1},  {icon: "rule_folder", title: "Registrar documentos del Revisor" , indice: 2}, {icon: "cloud_download", title: "Generar Archivos para Firmar", indice: 3}] : [{icon: "forward_to_inbox", title: "Reenviar correo del estado de la hoja de vida", indice: 1}];
            });
            this.dataSourceC = new MatTableDataSource(rta.data.completed);
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

  LoadHV(row: any){
    this.MostrarSpinner = true;
    this.servicio.SendGetWOutPObsHeaderAut('hv/reviewform/' + row.hvid).then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          //console.log(rta);
          if(rta.success)
          {
            this.Documents = [];
            this.Supplies = 'NO';
            this.ChipStep1 = rta.data.Step1;
            this.dataSourcePA.data = []
            this.dataSourceRC.data = []
            this.dataSourceRB.data = []
            this.dataSourceRCE.data = []
            this.dataSourceRPE.data = []
            this.dataSourceAcc.data = []

            if(rta.data.hasSupplies)
              if(rta.data.hasSupplies>0)
                this.Supplies='SI (' + rta.data.hasSupplies + ' contratos de suministros)';
            if(!rta.data.fieldsReject)
              rta.data.fieldsReject='[]';
            this.FieldsWithErrors = JSON.parse(rta.data.fieldsReject.toLowerCase());
            this.FrmAprobarHV.controls["id"].setValue(row.hvid);
            if(rta.data.Step2 != undefined && rta.data.Step2 != null && rta.data.Step2.length > 0)
            {
              rta.data.Step2.forEach((item: any) =>{
                this.dataSourcePA.data.push({"id": item[0].value, "hvId": item[1].value, "node": item[0].node, "fullName": item[2].value, "charge": item[3].value, "phone": item[4].value, "email": item[5].value});
              });
              this.dataSourcePA._updateChangeSubscription();
            }
            
            if(rta.data.Step3 != undefined && rta.data.Step3 != null && rta.data.Step3.length > 0)
            {
              rta.data.Step3.forEach((item: any) =>{
                this.dataSourceRC.data.push({"id": item[0].value, "hvId": item[1].value, "node": item[0].node, "company": item[2].value, "phone": item[3].value});
              });
              this.dataSourceRC._updateChangeSubscription();
            }
            if(rta.data.Step4 != undefined && rta.data.Step4 != null && rta.data.Step4.length > 0)
            {
              rta.data.Step4.forEach((item: any) =>{
                this.dataSourceRB.data.push({"id": item[0].value, "hvId": item[1].value,"node": item[0].node, "company": item[2].value, "phone": item[3].value});
              });
              this.dataSourceRB._updateChangeSubscription();
            }

            if(rta.data.Step5 != undefined && rta.data.Step5 != null && rta.data.Step5.length > 0)
            {
              rta.data.Step5.forEach((item: any) =>{
                this.dataSourceRCE.data.push({"id": item[0].value, "hvId": item[1].value,"node": item[0].node, "company": item[2].value, "contactname": item[3].value, "country": item[4].value, "city": item[5].value, "phone": item[6].value, "antiquity": item[7].value, "products": item[8].value});
              });
              this.dataSourceRCE._updateChangeSubscription();
            }

            if(rta.data.Step6 != undefined && rta.data.Step6 != null && rta.data.Step6.length > 0)
            {
              rta.data.Step6.forEach((item: any) =>{
                this.dataSourceRPE.data.push({"id": item[0].value, "hvId": item[1].value, "node": item[0].node, "company": item[2].value, "contactname": item[3].value, "country": item[4].value, "city": item[5].value, "phone": item[6].value, "antiquity": item[7].value, "products": item[8].value});
              });
              this.dataSourceRPE._updateChangeSubscription();
            }


            this.ChipStep7 = rta.data.Step7;
            if(rta.data.Step8 != undefined && rta.data.Step8 != null && rta.data.Step8.length > 0)
            {
              rta.data.Step8.forEach((item: any) =>{
                let node:any = {}
//                for(let key of Object.keys(item))
//                  node[key] = item[key]
//                this.dataSourceAcc.data.push(node)
                this.dataSourceAcc.data.push({"id": item[0].value, "hvId": item[1].value, "node": item[0].node, "company": item[2].value, "typedoc": item[3].value, "typedocdes": this.addtypedocdesStep8(item[3].value), "document": item[4].value, "country": item[5].value});
              });
              this.dataSourceAcc._updateChangeSubscription();
            }

            if(rta.data.Step9 != undefined && rta.data.Step9 != null && rta.data.Step9.length > 0)
            {/*
              rta.data.Step9.sort((a:any, b:any) => {
                // Compara los nombres de los objetos de manera insensible a mayúsculas y minúsculas.
                const nombreA = a[2].value.toLowerCase();
                const nombreB = b[2].value.toLowerCase();
              
                if (nombreA < nombreB) {
                  return -1; // a debe ir antes que b
                }
                if (nombreA > nombreB) {
                  return 1; // a debe ir después que b
                }
                return 0; // a y b son iguales en cuanto al nombre
              });              
              */
             
              rta.data.Step9.forEach((item: any) =>{
                this.Documents.push({"value": item[0].value, nameCi: item[5].value, "name": item[2].value});
              });
              
            }
            this.MostrarSpinner = false;
          }
          else
          {
            this.MostrarSpinner = false;
            Swal.fire("Error", rta.message, "error");
          }
        }
      }
      catch(e){
        this.MostrarSpinner = false;
        console.log('Ha ocurrido un error inesperado. Motivo:', e);           
        throw e;
      }
    });
  }

  private addtypedocdesStep8(typedoc: string){
    return NameTipeDocument(parseInt(typedoc));
  }

  //#region Eventos Grillas
  OcultarGrid(objetoEnviado: PassModelBotonGrid){
    //console.log(objetoEnviado);
    this.LoadHV(objetoEnviado.row);
    this.MostrapnlHV = objetoEnviado.verPadre;
    this.MostrapnlDocRevi = false;
  }

  // private ReloadGrid(data:any, dataSource: MatTableDataSource<any>)
  // {
  //   console.log(data);
  //   let dataAccion = data;
  //   dataSource.data = null;
  //   dataSource.data = dataAccion;
  // }

  SeleccionarRowPerAut(row: any)
  {
    if(this.arrayElementosNOK.some(item => item == (row.row.node  + "." + row.row.id)))
      this.arrayElementosNOK.splice(this.arrayElementosNOK.indexOf((row.row.node  + "." + row.row.id)), 1);
    else
      this.arrayElementosNOK.push((row.row.node + "." +row.row.id));
      //console.log(this.arrayElementosNOK);
  }
  //#endregion

  backListado(){
    this.MostrapnlHV = true;
    this.MostrapnlDocRevi = false;
    //const currentUrl = this.router.url;
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   // Navega de nuevo a la URL original
    //   this.router.navigate([currentUrl]);
    // });
    this.router.navigate(['/hv_review'], {skipLocationChange: true});
    this.slDoc.nativeElement.value ="0";
    this.Visualizar = false;
    this.safePdfUrl = null;
  }

  porCorregir(chip:any)
  {
    let clase : boolean = false;
    if(this.FieldsWithErrors.includes(chip.node.toLowerCase() + '.' + chip.subnode.toLowerCase()))
      clase = true;
    return clase;
  }
  
  chipClicked(event: any){
    const matChipElement = event.target as HTMLElement;
    if (matChipElement.classList.contains('selectedElem')) {
      this.renderer.removeClass(matChipElement, 'selectedElem');
      this.renderer.addClass(matChipElement, 'NoselectedElem');
      this.arrayElementosNOK.push(event.srcElement.id);
    } 
    else if(matChipElement.classList.contains('NoselectedElem')) {
      this.renderer.removeClass(matChipElement, 'NoselectedElem');
      this.renderer.addClass(matChipElement, 'selectedElem');
      if(this.arrayElementosNOK.some(item => item == event.srcElement.id))
        this.arrayElementosNOK.splice(this.arrayElementosNOK.indexOf(event.srcElement.id), 1);
    }
    //console.log(this.arrayElementosNOK);
  }

  chipClick(event: any){
    const matChipElement = event.target as HTMLElement;
    if (matChipElement.classList.contains('selectedElemOK')) {
      this.renderer.removeClass(matChipElement, 'selectedElemOK');
    } 
    else{
      this.renderer.addClass(matChipElement, 'selectedElemOK');
    }
    //console.log(this.arrayElementosNOK);
  }

  verificarTipoDeCampo(campo: any): boolean {
    if (typeof campo === 'boolean')
      return true
    
    return false;
  }

  onChangeDoc(event: any){
    if(event.target.value != "0")
    {
      this.btnApRecDoc.disabled = true;
      //this.btnApRecDoc._elementRef = true;
      //console.log(this.slDoc.nativeElement.options[this.slDoc.nativeElement.selectedIndex].id);
      this.MostrarSpinner = true;
      this.msjspinner = "Cargando el documento, por favor espere..."
      //console.log(nameFile);
      // this.servicio.SendPOSTWParamObs('system/showFile/', {"fileName": ((new Date(this.FrmInfGeneral.controls['createdAt']?.value).getFullYear() + "/" +  this.FrmInfGeneral.controls['document']?.value + "/") + nameFile)}, true).then((rta: ResponseM2) => {
      this.servicio.ShowPOSTWFile('system/showFile/', {"fileName": this.slDoc.nativeElement.options[this.slDoc.nativeElement.selectedIndex].id }, true).then((rta: any) => {  
        try
        {
          if(rta)
          {
            const blob = new Blob([rta], { type: 'application/pdf' });
            this.MostrarSpinner = false;
            this.msjspinner = null;
            //this.DocPDF = rta.data;
            this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
            this.Visualizar = true;
            this.TituloBotonAproRechazarDocs = "Aprobar";
            this.ValueAproRechazarDocs = true;
            this.btnApRecDoc.disabled = false;
            // let pdfWindow = window.open("");
            // pdfWindow.document.write("<html><head><title>Andina de Aduanas (Visualizar Documento)</title></head><body height='100%' width='100%'><iframe width='100%' height='100%' src='" + rta.data + "'></iframe></body></html>");
          }
          else
          {
            this.Visualizar = false;
            this.safePdfUrl = null;
          }
        }
        catch(excepcion){
          this.MostrarSpinner = false;
          this.msjspinner = null;
          Swal.fire("Ha ocurrido un error inesperado", "Error al guardar o editar la información general de la hoja de vida<br>Motivo:" + excepcion, "error");
        }

      });
    }
    else
    { 
      this.Visualizar = false;
      this.safePdfUrl = null;
    }
  }

  onCheckboxChange(event:any){
    this.TituloBotonAproRechazar = event.checked ? "Rechazar" : "Aprobar";
    if(event.check)
    {
      this.FrmAprobarHV.controls['deadlinedate'].setValidators([Validators.required]);
      this.FrmAprobarHV.controls['deadlinedate'].updateValueAndValidity();
      
    }
    else
    {
      this.FrmAprobarHV.controls['deadlinedate'].setValue(null);
      this.FrmAprobarHV.controls['deadlinedate'].removeValidators([Validators.required]);
      this.FrmAprobarHV.controls['deadlinedate'].updateValueAndValidity();
    }
  }

  onCheckboxChangeDocs(event:any){
    this.TituloBotonAproRechazarDocs = event.checked ? "Aprobar" : "Rechazar"; 

  }

  AprobarRechazarDOC()
  {
    if(this.slDoc.nativeElement.value == "0")
    Swal.fire("Advertencia", "Para aprobar o rechazar algún documento, debe seleccionar primero el documento", 'warning');
    else 
    {
      if(this.hv_info_step9.some(item => item.id == this.slDoc.nativeElement.value))
        this.hv_info_step9.splice(this.hv_info_step9.indexOf(this.slDoc.nativeElement.value), 1);
      this.hv_info_step9.push({id: this.slDoc.nativeElement.value, isapprobed: this.TituloBotonAproRechazarDocs == "Rechazar" ? false : true, nameDoc: this.slDoc.nativeElement.options[this.slDoc.nativeElement.selectedIndex].text});
      Swal.fire("Documento Agregado", "Se ha agregado el documento correctamente y fue " + (this.TituloBotonAproRechazarDocs == "Rechazar" ? "rechazado." : "aprobado."), 'success');
      this.slDoc.nativeElement.value = "0";
      this.TituloBotonAproRechazarDocs = "Aprobar";
      this.ValueAproRechazarDocs = true;
      this.Visualizar = false;
      this.safePdfUrl = null;
    }
  }

  AprobarRechazarHV(result:any){
    if(this.FrmAprobarHV.valid)
    {
      if(this.FrmAprobarHV.controls["isReject"].value  && (this.arrayElementosNOK.length == 0 && this.hv_info_step9.length == 0))
        Swal.fire("Advertencia", "No es posible rechazar la información de la hoja de vida.<br>No se ha seleccionado ningún campo o ningún documento que esté incorrecto!", 'warning');
      else if(!this.FrmAprobarHV.controls["isReject"].value && this.arrayElementosNOK.length > 0)
        Swal.fire("Advertencia", "No es posible aprobar la información de la hoja de vida.<br>Han sido seleccionados campos que están incorrectos!", 'warning');
      else if(this.hv_info_step9.length < this.Documents.length)
        Swal.fire("Advertencia", "No es posible "+ this.TituloBotonAproRechazar.toLowerCase() +" la información de la hoja de vida.<br>Hay documentos que no han sido aprobados ni rechazados!<br>Total documentos: " + this.Documents.length + ".<br>Total documentos revisados: " + this.hv_info_step9.length, 'warning');
      else if(!this.FrmAprobarHV.controls["isReject"].value && this.hv_info_step9.some(item => !item.isapprobed))
        Swal.fire("Advertencia", "No es posible aprobar la información de la hoja de vida.<br>Hay documentos que han sido marcados como incorrectos!", 'warning');
//      else if(this.FrmAprobarHV.controls["isReject"].value && !this.hv_info_step9.some(item => !item.isapprobed))
//        Swal.fire("Advertencia", "No es posible rechazar la información de la hoja de vida.<br>Debe haber al menos un documento marcado como rechazado!", 'warning');
      else
      {
        this.FrmAprobarHV.controls["fieldsReject"].setValue(this.FrmAprobarHV.controls["isReject"].value ? JSON.stringify(this.arrayElementosNOK) : []);
        Swal.fire({
          title: (this.TituloBotonAproRechazar + " Hoja de Vida"),
          text: "Está seguro que desea " + this.TituloBotonAproRechazar.toLowerCase() + " la información de la hoja de vida?",
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText: this.TituloBotonAproRechazar,
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            try
            {
              this.MostrarSpinner = true;
              let modelostep9 = this.hv_info_step9.map(function(obj){
                return {id: obj.id, isapprobed: obj.isapprobed}
              });
              //console.log({"hv_info" : this.FrmAprobarHV.value, "hv_info_step9": modelostep9 });
              this.servicio.SendPOSTWParamObs('hv/finishReview', JSON.stringify({"hv_info" : this.FrmAprobarHV.value, "hv_info_step9": modelostep9 }), true).then((rta: any) => 
              {
                if(rta.success)
                {
                  this.MostrarSpinner = false;
                  Swal.fire(("Hoja de Vida " + this.TituloBotonAproRechazar), rta.message, (rta.success ? "success" : 'warning'));
                  this.backListado();
                }
                else
                {
                  this.MostrarSpinner = false;
                  Swal.fire("Error", rta.message, 'error');
                }
              });
            }
            catch{
              this.MostrarSpinner = false;
              //document.getElementById('LoaderSend').style.display = 'none';
              Swal.fire("Error", "Error al aporbar o rechzar la información de la hoja de vida", "error");
            }
          } 
        }); 
      }
    }
  }

  /*VerDocsAddRoA(){
    if(this.hv_info_step9.length == 0)
      Swal.fire("Visulizar Documentos Aprobados o Rechazados", "No hay documentos para visualizar!", 'warning');
    else
    {
      let msj: string = "";
//      msj += "<mat-chip-listbox>";
      msj += '<table mat-table style=”border:1px solid #b3adad !important; border-collapse:collapse; padding:5px;”><thead><tr><th style=”border:1px solid #b3adad; padding:5px; background: #99c1f1; color: #313030;”>Documento</th><th style=”border:1px solid #b3adad; padding:5px; background: #99c1f1; color: #313030;”>Estado</th></tr></thead><tbody>';
      this.hv_info_step9.forEach(item =>{
        //msj += "<mat-chip-option [ngClass]=\"{'NoselectedElem': !item.isapprobed}\">Documento: " +item.nameDoc + " Estado: " + (item.isapprobed ? "Aprobado" : "Rechazado") + "</mat-chip-option>";
        // msj += "<label [ngClass]=\"{'NoselectedElem': !item.isapprobed}\">Documento: " +item.nameDoc + " Estado: " + (item.isapprobed ? "Aprobado" : "Rechazado") + "</label>";
//        msj +=   item.isapprobed ? "<mat-chip-option >Documento: "+ item.nameDoc + " Estado: Aprobado" + "</mat-chip-option><br>" : "<mat-chip-option style='background-color:rgb(240, 149, 65) !important; padding 8px; border-radius: 6px !important;'>Documento: " + item.nameDoc + " Estado: Rechazado" + "</mat-chip-option><br>";
        msj +=   item.isapprobed ? "<tr><td>"+ item.nameDoc + "</td><td>Aprobado</td></tr>" : '<tr style="background-color:rgb(240, 149, 65)"><td>'+ item.nameDoc + "</td><td>Rechazado</td></tr>";
    });
//      msj += "</mat-chip-listbox>";
      msj += "</tbody></table>";
//Swal.fire("Visulizar Documentos Aprobados o Rechazados", msj, 'info');
      Swal.fire({
        title:"Visulizar Documentos Aprobados o Rechazados", 
        icon: "info",
        html: msj,  
        confirmButtonText: "OK", 
      });
    }
  }*/

  VerDocsAddRoA() {
    if (this.hv_info_step9.length === 0) {
      Swal.fire("Visualizar Documentos Aprobados o Rechazados", "No hay documentos para visualizar.", 'warning');
    } else {
      let msj: string = '<table style="min-width:100%; border: 1px solid #b3adad; border-collapse: collapse; padding: 5px; font-size:11px !important;"><thead><tr><th style="border: 1px solid #b3adad; padding: 5px; background: #99c1f1; color: #313030;">Documento</th><th style="border: 1px solid #b3adad; padding: 5px; background: #99c1f1; color: #313030;">Estado</th></tr></thead><tbody>';
  
      this.hv_info_step9.forEach(item => {
        msj += '<tr style="word-wrap: break-word; background-color: ' + (item.isapprobed ? '#ffffff' : 'rgb(240, 149, 65)') + ';"><td style="text-align:left;">' + item.nameDoc + '</td><td>' + (item.isapprobed ? 'Aprobado' : 'Rechazado') + '</td></tr>';
      });
  
      msj += '</tbody></table>';
  
      Swal.fire({
        title: "Visualizar Documentos Aprobados o Rechazados",
        icon: "info",
        html: msj,
        confirmButtonText: "OK",
      });
    }
  }

  EventosAcciones(row: PassModelBotonesGrid){
    if(row.indice == 1)
    {
      Swal.fire({
        title: ("Reenviar Correo de Estado de Hoja de Vida"),
        text: "¿Está seguro que desea reenviar el correo al cliente del estado de revisión de la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Enviar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            //console.log(row.row.id);
            this.MostrarSpinner = true;
            this.servicio.SendPOSTObsWHeader('hv/notificationHvCheck/' + row.row.id).then((rta: any) => 
            {
              this.MostrarSpinner = false;
              if(rta == undefined)
                Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
              else
                Swal.fire(rta.success ? "Correo Enviado": "Error", rta.message, rta.success ? "success" : 'warning');
            });
          }
          catch{
            this.MostrarSpinner = false;
            Swal.fire("Error", "Error al reenviar correo de estado de la hoja de vida", "error");
          }
        } 
      }); 
    }
    else if(row.indice == 2)
    {
      try
      {
        this.MostrarSpinner = true;
        this.MostrapnlHV = false;
        this.MostrapnlDocRevi = true;
        this.hvId = row.row.id;
        this.nameenterprise = row.row.nameenterprise;
        this.state = row.row.state;
        this.FrmDocsRev = this.fb.group({
          id: new FormControl(null),
          hvId: new FormControl(row.row.id, Validators.required),
          nameenterprise: new FormControl(row.row.nameenterprise),
          state: new FormControl(row.row.state),
          hvreasonId: new FormControl(null, Validators.required),
          dateupload: new FormControl(this.currentD, Validators.required),
          documentname: new FormControl(null, Validators.required),
          docattachmentId: new FormControl(null, Validators.required),
          files: new FormControl(null),
          comment: new FormControl(null, Validators.required),
          docoperationtype: new FormControl(null, Validators.required)
        });

        this.servicio.SendPOSTWParamObs('hvnews/list/', JSON.stringify({hvId: row.row.id }), true).then((rta: any) => 
        {
          this.MostrarSpinner = false;
          if(rta == undefined)
            Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
          else
          {
            //console.log(rta);
            this.reasonRR = rta.params.reasons;
            this.DocsR = rta.params.docs;
            this.LoadGridDetails(rta);
          }
        });

        this.filteredOptionsDocs = this.FrmDocsRev.controls['documentname'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterDocs(value || '')),
        );
      }
      catch(excepcion){
        this.MostrarSpinner = false;
        Swal.fire("Error", "Ha ocurrido un error, motivo:"+ excepcion, "error");
      }
    }
    else if(row.indice == 3)
    {
      try
      {
        this.MostrarSpinner = true;

        this.servicio.DownloadPOSTWFile('hv/downloaddocs', {"val": row.row.id}, true).then((rta: Blob) => {
          if(rta)
          {
            //console.log(rta);
            const dataType = 'application/zip';
            const blob = new Blob([rta], { type: dataType });
  
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.setAttribute('download', 'documentos_anexos.zip');
            
            downloadLink.click();  
            this.MostrarSpinner = false;

            this.filteredOptionsDocs = this.FrmDocsRev.controls['documentname'].valueChanges.pipe(
              startWith(''),
              map(value => this._filterDocs(value || '')),
            );
          }
        });
        
      }
      catch(excepcion){
        this.MostrarSpinner = false;
        Swal.fire("Error", "Ha ocurrido un error, motivo:"+ excepcion, "error");
      }
    }
  }

  LoadGridDetails(data: any) {
    //console.log(data);
    this.dataSourceDet = null;
    this.dataColumnsDet = data.columns;
    this.displayedColumnsDet = data.columns.map((col:any)=>col.name);
    this.dataSourceDet = new MatTableDataSource(data.data);
    this.dataSourceDet._updateChangeSubscription();
  }

  private _filterDocs(value: string): any[] {
    const filterValue = value.toLowerCase();
    let items = this.DocsR.filter(item => item.name.toString().toLowerCase().includes(filterValue));
    if(items.length == 1)
    {
      this.FrmDocsRev.controls["docattachmentId"].setValue(items[0].id);
      this.FrmDocsRev.controls["docoperationtype"].setValue(items[0].operationtype);
    }
    return  items;
  }

  // displayFnDocs(doc: any): string {
  //   return doc && doc.name ? doc.name : '';
  // }


  GuardarDocRevisor(result: any){
    if(this.FrmDocsRev.valid)
    {
      Swal.fire({
        title: ("Guardar o Editar Información del Documento"),
        text: "¿Desea guardar o editar la información del documento del revisor para la hoja de vida?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            let _hv_news = new FormData();
            if(this.FrmDocsRev.controls['files'].value != null)
              _hv_news.append("file", this.FrmDocsRev.controls['files'].value);
            this.FrmDocsRev.controls['files']?.setValue(null);
            _hv_news.append("news", JSON.stringify(this.FrmDocsRev.value));

            this.servicio.SendPOSTWParamFiles('hvnews/', _hv_news).then((rta: any) => 
              {
                this.MostrarSpinner = false;
                if(rta == undefined)
                  Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
                else
                {
                  Swal.fire("Documento Procesado", "El documento se ha guardado correctamente!", "success");
                  this.clearDoc();
                  this.LoadGridDetails(rta);
                }
              });
            }
            catch(excepcion){
              this.MostrarSpinner = false;
              Swal.fire("Error", "Ha ocurrido un error, motivo:"+ excepcion, "error");
            }
        }
      });
    }
  }

  clearDoc() {
    this.FrmDocsRev.controls['id']?.setValue(null);
    this.FrmDocsRev.controls['hvreasonId']?.setValue(null);
    this.FrmDocsRev.controls['dateupload']?.setValue(this.currentD);
    this.FrmDocsRev.controls['documentname']?.setValue(null);
    this.FrmDocsRev.controls['docattachmentId']?.setValue(null);
    this.FrmDocsRev.controls['files']?.setValue(null);
    this.FrmDocsRev.controls['comment']?.setValue(null);
  }

  //#region PDF
  public GetFileOnLoad(event: any) {
    var file = event.target.files[0];
    this.LoadValueNameinputFile(file?.name, 'fakeFileInput');
    //this.FrmInfGeneral.controls["operatorfile"]?.setValue(file[0]);
    try
    {
      this.FrmDocsRev.controls["files"]?.setValue(file);
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
        this.DocLoad = true;
      }
      else
        this.DocLoad = false;
    }
  }

  // private GetValueNameinputFile(nameInputFile: string):string
  // {
  //     var element = document.getElementById(nameInputFile) as HTMLInputElement | null;
  //     return element.value;
  // }

  ViewPDF() {
    try
    {
      let continuar = this.FrmDocsRev.get('files').value == undefined || this.FrmDocsRev.get('files').value == null ;
      if(continuar)
      {
        //Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
        if(!StringIsNullOrEmpty(this.txtDocEnc.nativeElement.value))
        {
          console.log('Ingreso')
          this.MostrarSpinner = true;
          //console.log(nameFile);
          // this.servicio.SendPOSTWParamObs('system/showFile/', {"fileName": ((new Date(this.FrmInfGeneral.controls['createdAt']?.value).getFullYear() + "/" +  this.FrmInfGeneral.controls['document']?.value + "/") + nameFile)}, true).then((rta: ResponseM2) => {
          this.servicio.SendPOSTWParamObs('system/showFile/', {"fileName":  this.txtDocEnc.nativeElement.value}, true).then((rta: ResponseM2) => {  
          //console.log(rta.data);
            if(rta.success)
            {
              this.MostrarSpinner = false;
              // this.ShowFileinIFrame(rta.data.replace("dataapplication/pdfbase64", "data:application/pdf;base64,"));
              this.ShowFileinIFrame(rta.data);
            }
          });
        }
        else
          Swal.fire("Advertencia", "No se ha cargado ningún archivo para su visualización!", "warning");
      }
      else
      {
        const reader = new FileReader();
        reader.readAsDataURL(this.FrmDocsRev.controls["files"]?.value);
        reader.onload = () => {
          this.ShowFileinIFrame(reader.result.toString());
        };
      }
    }
    catch{
      this.MostrarSpinner = false;
      //document.getElementById('LoaderSend').style.display = 'none';
      Swal.fire("Error al obtener el archivo", "Ha ocurrido un error inesperado!", "error");
    }
  }

  private ShowFileinIFrame(pdf: string){
    let pdfWindow = window.open("");
    pdfWindow.document.write("<html><head><title>Andina de Aduanas (Visualizar Documento)</title></head><body height='100%' width='100%'><iframe width='100%' height='100%' src='" + pdf + "'></iframe></body></html>");
  }
  //#endregion

  EditarRowDocsRev(row: any){
    //console.log(row);
    this.FrmDocsRev.setValue({id: row.row.id, hvId: this.hvId, hvreasonId: row.row.hvreasonId, documentname: null, docattachmentId: row.row.docattachmentId, comment: row.row.comment, dateupload: row.row.dateupload, docoperationtype: row.row.docoperationtype, nameenterprise: this.nameenterprise, state: this.state, files: null});
    this.FrmDocsRev.controls['documentname']?.setValue(this.DocsR.filter(item => item.id == row.row.docattachmentId)[0].id + ' - ' + this.DocsR.filter(item => item.id == row.row.docattachmentId)[0].name);
    this.txtDocEnc.nativeElement.value = row.row.documentname;
  }
}
