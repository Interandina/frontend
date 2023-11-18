import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ElementosFromFiltComponent, ModelEditar, ObjetosFiltrosComponent, PassModelBotonesGrid, ResponseM2, modelSelectsFilter } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hv-query',
  templateUrl: './hv-query.component.html',
  styleUrls: ['./hv-query.component.css']
})
export class HvQueryComponent implements OnInit{
  MostrarSpinner = false;
  VisualizarElements: ObjetosFiltrosComponent = null;
  _elementos: ElementosFromFiltComponent[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dataColumns: any[] = [];
  modelEditar: ModelEditar;
  VerBotonImprimir = true;

  constructor(private servicio: ServicesComponent) {}

  ngOnInit(): void {
    let _value: modelSelectsFilter = null;
    try
    {
      this.servicio.SendGetWOutPObsHeaderAut('groups/').then((rta: ResponseM2) => {
        if(rta.success)
        {
          _value = {data: rta.data, valorsl: 'id', descsl: 'description'};
          this._elementos.push({nameElementModel: "group", tipo: "select", requerido: false, etiqueta: "Grupo del cliente", value: _value});
        }
        else
          Swal.fire("Error", rta.message, "error");
      });
    }
    catch(excepcion)
    {
      Swal.fire("Error", excepcion.toString(), "error");
    }
    this._elementos.push({nameElementModel: "fechaIniCrea", tipo: "datepicker", requerido: false, etiqueta: "Fecha de Creación Inicial (dd/MM/AAAA)"}, {nameElementModel: "fechaFinCrea", tipo: "datepicker", requerido: false, etiqueta: "Fecha de Creación Final (dd/MM/AAAA)"});
    this._elementos.push({nameElementModel: "fechaIniRev", tipo: "datepicker", requerido: false, etiqueta: "Fecha de Revisión Inicial (dd/MM/AAAA)"}, {nameElementModel: "fechaFinRev", tipo: "datepicker", requerido: false, etiqueta: "Fecha de Revisión Final (dd/MM/AAAA)"});
    this._elementos.push({nameElementModel: "company", tipo: "inputele", requerido: false, etiqueta: "Filtrar por compañía"}, {nameElementModel: "document", tipo: "inputele", requerido: false, etiqueta: "Filtrar por documento"});
    this._elementos.push({nameElementModel: "email", tipo: "inputele", requerido: false, etiqueta: "Filtrar por email"}, {nameElementModel: "contact", tipo: "inputele", requerido: false, etiqueta: "Filtrar por contacto"});
    this._elementos.push({nameElementModel: "ispending", tipo: "radios", requerido: false, etiqueta: "Revisadas/Pendientes"}, {nameElementModel: "isaccept", tipo: "radios", requerido: false, etiqueta: "Aceptadas/Rechazadas"});
    this._elementos.push({nameElementModel: "isdone", tipo: "radios", requerido: false, etiqueta: "Completas/Incompletas"});  
    this.VisualizarElements =  {
      elementos: this._elementos,
      titulo: 'Listado de Hojas de Vida',
    }

    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false
    };
  }

  ListarGrid(objetoEnviado: PassModelBotonesGrid){
    //console.log(objetoEnviado);
    if(objetoEnviado != null && objetoEnviado.indice == 1)
    {
      let filters = {
        filters: objetoEnviado.row
      };
      //console.log(JSON.stringify(filters));
      this.MostrarSpinner = true;
      try
      {
        this.servicio.SendPOSTWParamObs('hv/query/', JSON.stringify(filters), true).then((rta: any) => {
          if(rta.success)
          {
            //console.log(rta);
            this.dataSource = null;
            //rta.columns.push({name: "acciones", title: "Acción", display: true});
            this.dataColumns =  rta.columns;
            this.displayedColumns =  rta.columns.map((col:any)=>col.name);
            // rta.data.forEach((item:any) =>{
            //   item.acciones = ["print", "Imprimir informe"];
            // });
            this.dataSource = new MatTableDataSource(rta.data);
          }
          else
            Swal.fire("Error", rta.message, "error");
        });
      }
      catch(excepcion)
      {
        Swal.fire("Error", excepcion.toString(), "error");
      }
      this.MostrarSpinner = false;
    }
    else if(objetoEnviado != null && objetoEnviado.indice == 2)
    {
      if(this.dataSource.data == null || this.dataSource.data == undefined || this.dataSource.data.length == 0)
        Swal.fire("Detalle sin Registros", "No hay registros en el detalle para imprimir!", "warning");
      else
      {
        try
        {
          this.servicio.DownloadPOSTWFile('reports/checklist', { ids:this.dataSource.data.map(r=>{ return r.id }) }).then((rta: Blob) => {
            if(rta)
            {
              const dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              const blob = new Blob([rta], { type: dataType });

              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.setAttribute('download', 'report.xlsx');
              document.body.appendChild(downloadLink);
              downloadLink.click();  
            }
          });
        }
        catch(excepcion)
        {
          Swal.fire("Error", excepcion.toString(), "error");
        }
      }
    }
  }

  PrintPDF(row: any){
    this.MostrarSpinner = true;
    try
    {
      this.servicio.SendPOSTWParamObs('reports/checklist', {"id": [row.hvId]}, true).then((rta: any) => {
        console.log(row.hvId)
        if(rta.success)
        {

          let pdfWindow = window.open("");
          pdfWindow.document.write("<html><head><title>Andina de Aduanas (Visualizar Documento)</title></head><body height='100%' width='100%'><iframe width='100%' height='100%' src='" + rta.data + "'></iframe></body></html>");
        }
        else
          Swal.fire("Error", rta.message, "error");
      });
    }
    catch(excepcion)
    {
      Swal.fire("Error", excepcion.toString(), "error");
    }
    this.MostrarSpinner = false;
  }
}
