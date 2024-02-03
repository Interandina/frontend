import { DataSource } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccionesBotonesTableEdit, botonesEventosTableEdit, objetosTableEditable } from 'src/app/modelos/Interfaces';

@Component({
  selector: 'app-table-app-edit',
  templateUrl: './table-app-edit.component.html',
  styleUrls: ['./table-app-edit.component.css']
})
export class TableAppEditComponent implements OnInit {

  displayedColumns:any[] = [];
  dataColumns:any[] = [];
  Formulario: FormGroup;
  botonSave: boolean;
  botonEdit: boolean;
  botonCancel: boolean;
  botonDelete: boolean;
  /*Variables de la Grilla*/
  pageNumber: number = 1;
  @Input() dataSource = new MatTableDataSource<any>();
  @Input() objetosTableEdit: objetosTableEditable = {
    displayedColumns:[],
    dataColumns:[],
    Formulario: null,
    botonesEventos:[],
    editarEnFila: false
  };
  @Output() eventoRowOutFormPadre = new EventEmitter<any>();

  isLoading = true;
  MostrarBotonAddRow = false;
  paginatorList: HTMLCollectionOf<Element>;
  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    //Se traslada al setdatasource attributes para que no arroje error las configuraciones al setearlos
    mp._changePageSize(mp.pageSize);
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit(): void {
    //this.dataSource = this.objetosTableEdit.dataSource;
    this.displayedColumns = this.objetosTableEdit.displayedColumns;
    this.dataColumns = this.objetosTableEdit.dataColumns;
    //console.log(this.dataColumns);
    this.Formulario = this.objetosTableEdit.Formulario;
    this.botonSave = this.objetosTableEdit.botonesEventos.filter(b=> b.name == AccionesBotonesTableEdit.Save)[0].visible;
    this.botonEdit = this.objetosTableEdit.botonesEventos.filter(b=> b.name == AccionesBotonesTableEdit.Edit)[0].visible;
    this.botonCancel = this.objetosTableEdit.botonesEventos.filter(b=> b.name == AccionesBotonesTableEdit.Cancel)[0].visible;
    this.botonDelete = this.objetosTableEdit.botonesEventos.filter(b=> b.name == AccionesBotonesTableEdit.Delete)[0].visible;
    this.isLoading = false;
    this.dataSource = new MatTableDataSource((this.Formulario.get('FrmRows') as FormArray).controls);
    this.dataSource.paginator = this.paginator;
    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    }
  }

  AddNewRow() {
    // this.getBasicDetails();
    const control = this.Formulario.get('FrmRows') as FormArray;
    control.insert(0,this.initiateFrmRows());
    this.dataSource = new MatTableDataSource(control.controls)
    // control.controls.unshift(this.initiateVOForm());
    // this.openPanel(panel);
      // this.table.renderRows();
      // this.dataSource.data = this.dataSource.data;
  }
  initiateFrmRows(): any {
    throw new Error('Method not implemented.');
  }

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  applyFilterGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => { // this is page change event
     this.onPaginateChange(this.paginator, this.paginatorList);
   });
  }

  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout((idx: any) => {
        let from = (paginator.pageSize * paginator.pageIndex) + 1;

        let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
        let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1)
            list[0].innerHTML = rows; 

    }, 0, paginator.pageIndex);
  }

   // On click of correct button in table (after click on edit) this method will call
   SaveFormGrid(FormElement: any, i: number) {
    FormElement.get('FrmRows').at(i).get('isEditable').patchValue(true);
  }

  // this function will enabled the select field for editd
  EditFormGrid(FormElement: any, i: number, row: any) {
    console.log(row);
    if(this.objetosTableEdit.editarEnFila)
      FormElement.get('FrmRows').at(i).get('isEditable').patchValue(false);
    else
      this.eventoRowOutFormPadre.emit(row);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelFormGrid(FormElement: any, i: number) {
    FormElement.get('FrmRows').at(i).get('isEditable').patchValue(true);
  }

   // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
   DeleteFormGrid(i: number) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

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
  }
}
