import {AfterViewInit, Component, Input, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Output, EventEmitter } from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import { ModelEditar, PassModelBotonGrid, PassModelBotonesGrid } from 'src/app/modelos/Interfaces';
import { MatChipsModule } from '@angular/material/chips';
//import { DomSanitizer } from '@angular/platform-browser';
// import { MatTableExporterModule } from 'mat-table-exporter';


@Component({
  selector: 'app-table-app',
  templateUrl: './table-app.component.html',
  styleUrls: ['./table-app.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatInputModule, MatFormFieldModule, CommonModule, MatIconModule, MatChipsModule]
})

// export class TableAppComponent implements AfterViewInit {
export class TableAppComponent {
  // JSON = JSON;
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  //@ViewChild('buttonprueba') buttonprueba: HTMLButtonElement;

  private paginator: MatPaginator;
  private sort: MatSort;
  selectedRowIndex = -1;

  @Input() dataSource = new MatTableDataSource<any>();
  @Input() dataColumns: any[];
  @Input() displayedColumns:string[] =[];
  @Input() modelEditar: ModelEditar;
  @Input() callbackEditar: Function;
  @Input() rowsReject: string[] =[];
  //@Input() callbackBoton: Function;
  @Output() eventoFormPadre = new EventEmitter<PassModelBotonGrid>();
  @Output() eventosFormPadre = new EventEmitter<PassModelBotonesGrid>();
  @Output() eventoRowOutFormPadre = new EventEmitter<PassModelBotonGrid>();

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    //Se traslada al setdatasource attributes para que no arroje error las configuraciones al setearlos
    // mp._intl = new MatPaginatorIntl();
    // mp._intl.itemsPerPageLabel = "Ítems por página";
    // mp._intl.firstPageLabel = "Primera página";
    // mp._intl.nextPageLabel = "Siguiente página";
    // mp._intl.previousPageLabel = "Anterior página";
    // mp._intl.lastPageLabel = "Última página";
    mp._changePageSize(mp.pageSize);
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  //@ViewChild('table') table: ElementRef;

  // @ViewChild(MatTable, {static: false}) table : MatTable<any>  // Initialize
  //displayedColumns:string[] = [];
  //displayedColumns: string[] = ['_id', 'first_name', 'last_name', 'email', 'type_user_id'];
  //dataSource = new MatTableDataSource<any>();

  // @ViewChild(MatPaginator, {static: false})
  // set paginator(value: MatPaginator) {
  //   if (this.dataSource){
  //     this.dataSource.paginator = value;
  //   }
  // }
  // @ViewChild(MatSort, {static: false})
  // set sort(value: MatSort) {
  //   if (this.dataSource){
  //     this.dataSource.sort = value;
  //   }
  // }
  constructor(private dialog: MatDialog){}
  // ngOnInit(): void {
  //   let btn = document.getElementById("btnPruebahv");
  //   btn.addEventListener('click', () => {
  //     alert('¡Botón clickeado!');
  //   });
  // }

  // ngAfterViewInit() {
    // setTimeout(() => {
    //   this.renderWidgetInsideWidgetContainer();
    // }, 0);
    //this.displayedColumns = this.dataColumns.map((col:any)=>{col.name});
  // }

  setDataSourceAttributes() {
    setTimeout(() =>{
      if(this.dataSource != null && this.dataSource != undefined)
      {
        this.paginator._intl.itemsPerPageLabel = "Ítems por página";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.nextPageLabel = "Siguiente página";
        this.paginator._intl.previousPageLabel = "Anterior página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
    //console.log(this.dataColumns);
  }

  EventButton(row: any){
    // if(this.callbackBoton != undefined){
    //   this.callbackBoton(row);
    if(this.modelEditar.EventoBotonEditar)
    {
      let PassModelBotonGrid: PassModelBotonGrid = {
        row: row,
        verPadre: false
      };
      this.eventoFormPadre.emit(PassModelBotonGrid);
    }
  }

  EventosBotones(row: any, index: number){
    if(this.modelEditar.EventoBotonEditar)
    {
      let PassModelBotonsGrid: PassModelBotonesGrid = {
        row: row,
        verPadre: false,
        indice: index
      };
      this.eventosFormPadre.emit(PassModelBotonsGrid);
    }
  }

  // EventRowOut(row: any){
  //   if(this.modelEditar.EditarRowOut)
  //   {
  //     let PassModelBotonGrid: PassModelBotonGrid = {
  //       row: row,
  //       verPadre: false
  //     };
  //     this.eventoRowOutFormPadre.emit(PassModelBotonGrid);
  //   }
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ExportTOExcel(extension:string)
  {
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    //let options:XLSX.JSON2SheetOpts  = {header: this.displayedColumns};
    //Se envía el datasource para que las columnas ocultas se exporten al excel
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja_1');

    /* save to file */
    XLSX.writeFile(wb, ('Documento.' + extension));
  }

  UpdateRowinForm(row:any, event: any)
  {
    //console.log(event);
    this.selectedRowIndex = row.id;
    if(this.modelEditar.EditarRow)
    {
      const dialogRef = this.dialog.open(ModaldinamicComponent,{
        panelClass: 'my-dialog',
        disableClose: true,
        data:{
          buttonText: {
            cancel: 'Cerrar',
            confirm:'Editar'
          },
          titleag: this.modelEditar.Title,
          componenteag: this.modelEditar.Componente,
          dataedit: row,
          widthdiag: this.modelEditar.WidthDg,
          heightdiag: this.modelEditar.HeightDg
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.callbackEditar();
      });
    }
    else if(this.callbackEditar != undefined && this.modelEditar.EditarRow)
    {
      this.callbackEditar();
    }
    else if(this.modelEditar.EditarRowOut)
    {
      let PassModelBotonGrid: PassModelBotonGrid = {
        row: row,
        verPadre: false
      };
      this.eventoRowOutFormPadre.emit(PassModelBotonGrid);
      if(this.modelEditar.RowReject)
      {
        //Evento que se utiliza para no aprobar una fila de la grilla
        const RowElement = event.srcElement.parentElement as HTMLElement;
        //console.log(RowElement);
        if (RowElement.classList.contains('rejectRow')) {
          RowElement.classList.remove('rejectRow');
        } 
        else{
          RowElement.classList.add('rejectRow');
        }
      }
    }
  }

  eventClickRow(row:any, event: any)
  {
    if(this.modelEditar.RowReject)
    {
      //Evento que se utiliza para no aprobar una fila de la grilla
      const RowElement = event.srcElement.parentElement as HTMLElement;
      //console.log(RowElement);
      if (RowElement.classList.contains('NorejectRow')) {
        RowElement.classList.remove('NorejectRow');
      } 
      else{
        RowElement.classList.add('NorejectRow');
      }
    }
  }

  setColorReject(row:any): boolean {
    if(this.modelEditar.RowReject && this.rowsReject != undefined && this.rowsReject.length > 0 && this.modelEditar.NameStep != undefined)
    {
      // console.log(this.dataSource.data.findIndex(item => item === row));
      if(this.rowsReject.includes(this.modelEditar.NameStep.toLowerCase() + '.' + (this.dataSource.data.findIndex(item => item === row) + 1)))
        return true;
    }
    return false;
  }
  
  // VerificarReject(filaseleccionada: number, idfila: number, event:any){
  //   console.log(filaseleccionada);
  //   console.log(idfila);
  //   console.log(event);
  // }
}