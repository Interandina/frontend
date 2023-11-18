import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ServicesComponent } from 'src/app/Services';
import { ElementosFromFiltComponent, ObjetosFiltrosComponent, PassModelBotonesGrid, RespuestaFiltros } from 'src/app/modelos/Interfaces';
import { StringIsNullOrEmpty, ValidateFieldsForm, todosMiembrosSonNulos } from '../functions/FnGenericas';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { FloatLabelType } from '@angular/material/form-field';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.css']
})
export class ListFiltersComponent implements OnInit{
  @Input() VisualizarElements: ObjetosFiltrosComponent = null;
  @Input() VerBotonImprimir: boolean = false;
  @Output() eventosFormPadre = new EventEmitter<PassModelBotonesGrid>();
  tituloListado = "";
  elementos: ElementosFromFiltComponent[] = [];
  FrmFiltros: FormGroup;
  currentDate = new Date();
  //VerBotonImprimir

  constructor(private fb: FormBuilder, private dateAdapter: DateAdapter<Date>, private servicio: ServicesComponent) {
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.dateAdapter.setLocale('es-CO'); //dd/MM/yyyy
  }
  
  ngOnInit(): void {
    //console.log(this.VisualizarElements);
    this.tituloListado = this.VisualizarElements.titulo;
    this.elementos = this.VisualizarElements.elementos;
    //console.log(this.elementos.filter(ele => ele.nameElementModel == "group")[0].requerido);
    this.FrmFiltros = this.fb.group({
      fechaIniCrea:[Date, this.elementos.filter(ele => ele.nameElementModel == "fechaIniCrea")[0].requerido ? Validators.required : null],
      fechaFinCrea:[Date, this.elementos.filter(ele => ele.nameElementModel == "fechaFinCrea")[0].requerido ? Validators.required : null],
      fechaIniRev:[Date, this.elementos.filter(ele => ele.nameElementModel == "fechaIniRev")[0].requerido ? Validators.required : null],
      fechaFinRev:[Date, this.elementos.filter(ele => ele.nameElementModel == "fechaFinRev")[0].requerido ? Validators.required : null],
      company:['', this.elementos.filter(ele => ele.nameElementModel == "company")[0].requerido ? Validators.required : null],
      document:['', this.elementos.filter(ele => ele.nameElementModel == "document")[0].requerido ? Validators.required : null],
      email:['', this.elementos.filter(ele => ele.nameElementModel == "email")[0].requerido ? Validators.required : null],
      contact:['', this.elementos.filter(ele => ele.nameElementModel == "contact")[0].requerido ? Validators.required : null],
      ispending:[null, this.elementos.filter(ele => ele.nameElementModel == "ispending")[0].requerido ? Validators.required : null],
      isaccept:[null, this.elementos.filter(ele => ele.nameElementModel == "isaccept")[0].requerido ? Validators.required : null],
      isdone:[null, this.elementos.filter(ele => ele.nameElementModel == "isdone")[0].requerido ? Validators.required : null],
      group:['']
    });
    
    // this.FrmFiltros.controls['fechaIniCrea'].setValue(this.elementos.some(ele => ele.nameElementModel == "fechaIniCrea") ? new Date() : null);
    // this.FrmFiltros.controls['fechaFinCrea'].setValue(this.elementos.some(ele => ele.nameElementModel == "fechaFinCrea") ? new Date() : null);
    // this.FrmFiltros.controls['fechaIniRev'].setValue(this.elementos.some(ele => ele.nameElementModel == "fechaIniRev") ? new Date() : null);
    // this.FrmFiltros.controls['fechaFinRev'].setValue(this.elementos.some(ele => ele.nameElementModel == "fechaFinRev") ? new Date() : null);
    this.FrmFiltros.controls['fechaIniCrea'].setValue(null);
    this.FrmFiltros.controls['fechaFinCrea'].setValue(null);
    this.FrmFiltros.controls['fechaIniRev'].setValue(null);
    this.FrmFiltros.controls['fechaFinRev'].setValue(null);
  }

  ListarInfo(result:any){
    if(this.FrmFiltros.valid)
    {
      let errores: string[] =[];
      if(this.elementos.some(ele => ele.nameElementModel == "fechaIniCrea") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniCrea'].value) && StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinCrea'].value))
        errores.push("Campo fecha final de creación es requerido si la fecha inicial de creación está diligenciada!");
      if(this.elementos.some(ele => ele.nameElementModel == "fechaIniCrea") && StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniCrea'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinCrea'].value))
        errores.push("Campo fecha final de creación es requerido si la fecha inicial de creación está diligenciada!");
      if(this.elementos.some(ele => ele.nameElementModel == "fechaIniRev") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniRev'].value) && StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinRev'].value))
        errores.push("Campo fecha final de revisión es requerido si la fecha inicial de revisión está diligenciada!");
      // if(this.elementos.some(ele => ele.nameElementModel == "fechaIniRev") && StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinRev'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniRev'].value))
      //   errores.push("Campo fecha final de revisión es requerido si la fecha inicial de revisión está diligenciada!");
      if(this.elementos.some(ele => ele.nameElementModel == "fechaIniCrea") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniCrea'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinCrea'].value) && (new Date(this.FrmFiltros.controls['fechaIniCrea'].value).setHours(0, 0, 0, 0) > new Date(this.FrmFiltros.controls['fechaFinCrea'].value).setHours(0, 0, 0, 0)))
        errores.push("Campo fecha final de creación no puede ser menor a la fecha inicial de creación!");
      if(this.elementos.some(ele => ele.nameElementModel == "fechaIniRev") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniRev'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinRev'].value) && (new Date(this.FrmFiltros.controls['fechaIniRev'].value).setHours(0, 0, 0, 0) > new Date(this.FrmFiltros.controls['fechaFinRev'].value).setHours(0, 0, 0, 0)))
        errores.push("Campo fecha final de revisión no puede ser menor a la fecha inicial de revisión!");

      if(errores.length > 0)
        Swal.fire("Advertencia", errores.join("<br>"), 'warning');
      else
      {
        let rta: RespuestaFiltros = {
          datec: this.elementos.some(ele => ele.nameElementModel == "fechaIniCrea") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniCrea'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinCrea'].value)? [new Date(this.FrmFiltros.controls['fechaIniCrea'].value).toLocaleDateString(), new Date(this.FrmFiltros.controls['fechaFinCrea'].value).toLocaleDateString()] : null,
          dater: this.elementos.some(ele => ele.nameElementModel == "fechaIniRev") && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaIniRev'].value) && !StringIsNullOrEmpty(this.FrmFiltros.controls['fechaFinRev'].value)? [new Date(this.FrmFiltros.controls['fechaIniRev'].value).toLocaleDateString(), new Date(this.FrmFiltros.controls['fechaFinRev'].value).toLocaleDateString()] : null,
          company: this.elementos.some(ele => ele.nameElementModel == "company") && !StringIsNullOrEmpty(this.FrmFiltros.controls['company'].value) ? this.FrmFiltros.controls['company'].value : null,
          document: this.elementos.some(ele => ele.nameElementModel == "document") && !StringIsNullOrEmpty(this.FrmFiltros.controls['document'].value) ? this.FrmFiltros.controls['document'].value : null,
          email: this.elementos.some(ele => ele.nameElementModel == "email") && !StringIsNullOrEmpty(this.FrmFiltros.controls['email'].value) ? this.FrmFiltros.controls['email'].value : null,
          contact: this.elementos.some(ele => ele.nameElementModel == "contact") && !StringIsNullOrEmpty(this.FrmFiltros.controls['contact'].value) ? this.FrmFiltros.controls['contact'].value : null,
          group: this.elementos.some(ele => ele.nameElementModel == "group") && !StringIsNullOrEmpty(this.FrmFiltros.controls['group'].value) ? this.FrmFiltros.controls['group'].value : null,
          ispending: this.elementos.some(ele => ele.nameElementModel == "ispending") && !StringIsNullOrEmpty(this.FrmFiltros.controls['ispending'].value) ? this.FrmFiltros.controls['ispending'].value == "Revisadas" ? false : true : null,
          isaccept: this.elementos.some(ele => ele.nameElementModel == "isaccept") && !StringIsNullOrEmpty(this.FrmFiltros.controls['isaccept'].value) ? this.FrmFiltros.controls['isaccept'].value == "Aceptadas" ? true : false : null,
          isdone: this.elementos.some(ele => ele.nameElementModel == "isdone") && !StringIsNullOrEmpty(this.FrmFiltros.controls['isdone'].value) ? this.FrmFiltros.controls['isdone'].value == "Completas" ? true : false : null
        };

        let PassModelBotonsGrid: PassModelBotonesGrid = {
          row: rta,
          verPadre: false,
          indice: 1
        };
        //if(!todosMiembrosSonNulos(rta).every(r=>r === true))
        this.eventosFormPadre.emit(PassModelBotonsGrid);
      }
    }
  }

  getElementos(elemento: string){
    return this.elementos.filter(item => item.tipo == elemento);
  }

  ImprimirListado(){
    let PassModelBotonsGrid: PassModelBotonesGrid = {
      row: null,
      verPadre: false,
      indice: 2
    };
    //if(!todosMiembrosSonNulos(rta).every(r=>r === true))
    this.eventosFormPadre.emit(PassModelBotonsGrid);
  }
}
