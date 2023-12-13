import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DO, ModelEditar, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { readExcelFile } from '../functions/FnGenericas';
import { ServicesComponent } from 'src/app/Services';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-docdo',
  templateUrl: './docdo.component.html',
  styleUrls: ['./docdo.component.css']
})
export class DocdoComponent implements OnInit {
  msjspinner: string;
  MostrarSpinner: boolean = false;
  DocLoad = false;
  viewGrid = false;
  dataSource = new MatTableDataSource<DO>();
  //dataSource: new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  fileSend: File;
  constructor(private servicio: ServicesComponent) {}

  ngOnInit(): void {
    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: false 
    };
  }

  public GetFileOnLoadInput2(event:any){
    try
    {
      this.fileSend = null;
      this.fileSend = event.target.files[0];
      if(this.fileSend.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      {
        this.DocLoad = false;
        Swal.fire("Advertencia", "El tipo de archivo que ha cargado no es permitido!<br>Solo son permitidos archivos .xls o .xlsx", "warning");
      }
      else
      {
        this.dataSource = null;
        this.DocLoad = true;
        this.MostrarSpinner = true;
        this.msjspinner = "Leyendo el archivo excel...";
        const excelData = readExcelFile(this.fileSend);
        // console.log("inicia  la lectura");
        // console.log(new Date());
        excelData.then((rta: any) =>{
          //Se crean la fila del encabezado para la tabla
          let arraycols: any[] = [];
          rta.headers.forEach((element: string) => {
            //arraycols.push({name: rta.headers.indexOf(element), title: element, display: true});
            arraycols.push({name: element, title: element, display: true});
          });
          this.dataColumns =  arraycols;
          this.displayedColumns =  arraycols.map((col: any) => col.name);
          //Se crea el datasource manualmente para la tabla
          let arraydata: any[] = [];
          //let hoja: XLSX.WorkSheet = rta.sheetExcel;
          rta.data.forEach((row: any) => {
            const rowData: any = {};
            for (let i = 0; i < arraycols.length; i++){
              rowData[arraycols[i].name] = row[i] == undefined ? '' :  String(row[i]);
              //rowData[arraycols[i]]=hoja.ge(row.index).getCell(i).value.text? hoja.getRow(row.index).getCell(i).value.text : hoja.getRow(row.index).getCell(i).value
            }
            //console.log(title)
            arraydata.push(rowData);
          });
          // console.log("temina de armar  la lectura");
          // console.log(new Date());
          // console.log(arraydata);
          this.dataSource = new MatTableDataSource<any>(arraydata);
          //console.log(arraydata);
          // setTimeout(() => {
          //   this.dataSource = new MatTableDataSource<any>(arraydata);
          //  }, 1);
          // console.log("final de armar  la lectura");
          // console.log(new Date());
          this.viewGrid = true;
          this.MostrarSpinner = false;
          this.msjspinner = null;
          Swal.fire("Archivo Procesado Correctamente", "El archivo se ha cargado correctamente!", "success");
        });
      }
    }
    catch(excepcion){
      this.viewGrid = false;
      this.MostrarSpinner = false;
      this.msjspinner = null;
      Swal.fire("Error al obtener el archivo", "Ha ocurrido un error inesperado!<br>Motivo:<br>" + excepcion, "error");
    }
  }

  public GetFileOnLoadInput(event:any){
    try
    {
      this.fileSend = null;
      this.fileSend = event.target.files[0];
      if(this.fileSend.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      {
        this.DocLoad = false;
        Swal.fire("Advertencia", "El tipo de archivo que ha cargado no es permitido!<br>Solo son permitidos archivos .xls o .xlsx", "warning");
      }
      else
      {
        this.dataSource = new MatTableDataSource<DO>();
        this.DocLoad = true;
        this.MostrarSpinner = true;
        this.msjspinner = "Leyendo el archivo excel...";
        let DO = new FormData();
        DO.append("file", this.fileSend);
        DO.append("save", 'false');
        //console.log(new Date());
        this.servicio.SendPOSTWParamFiles('parameters/uploaddocop', DO).then((rta: any) => {
          if(rta.success)
          {
            console.log(rta);
            this.MostrarSpinner = false;
            this.msjspinner = null;
            this.viewGrid = true;
            this.dataColumns =  rta.columns;
            this.displayedColumns =  rta.columns.map((col: any) => col.name);
            //this.dataSource = new MatTableDataSource<any>();
            //this.dataSource.data = [];
            //this.dataSource.data = rta.data;
            // console.log("inyecta la data al datasocrce");
            // console.log(new Date());
            this.dataSource = new MatTableDataSource<DO>(rta.data);
            this.DocLoad = true;
            //this.fileSend = null;
            Swal.fire("Archivo Procesado Correctamente", "El archivo se ha cargado correctamente!", "success");
          }
          else
            Swal.fire("Error Procesando el Documento", rta.message, 'warning');
        });
      }
    }
    catch(excepcion){
      this.viewGrid = false;
      this.MostrarSpinner = false;
      this.msjspinner = null;
      Swal.fire("Error al obtener el archivo", "Ha ocurrido un error inesperado!<br>Motivo:<br>" + excepcion, "error");
    }
  }

  public GuardarDocumento(){
    if(this.dataSource.data.length <= 0 || this.fileSend == null)
      Swal.fire("Documento no Cargado", "No se ha cargado ningún documento para procesar!", "warning");
    else
    {
      Swal.fire({
        title: "Guardar Documento",
        text: "¿Desea guardar el documento que se acaba de procesar y verificar?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: "Guardar",
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            this.MostrarSpinner = true;
            this.msjspinner = "Guardando el documento, por favor espere...";
            let DO = new FormData();
            DO.append("file", this.fileSend);
            DO.append("save", 'true');
            this.servicio.SendPOSTWParamFiles('parameters/uploaddocop', DO).then((rta: ResponseM2) => {
              if(rta.success)
              {
                this.MostrarSpinner = false;
                this.msjspinner = null;
                this.viewGrid = false;
                this.dataSource = null;
                this.DocLoad = false;
                this.fileSend = null;
                Swal.fire("Documento Guardado", rta.message, 'success');
              }
              else
                Swal.fire("Error Guardando Documentos", rta.message, 'warning');
            });
          }
          catch(excepcion){
            this.MostrarSpinner = false;
            this.msjspinner = null;
            Swal.fire("Ha ocurrido un error inesperado", "Error al guardar el documento<br>Motivo:" + excepcion, "error");
          }
        } 
      });
    }
  }
}
