import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit{
  FrmCalendar: FormGroup;
  currentDate = new Date();

  constructor(private fb: FormBuilder){
  }

  ngOnInit(): void {
    this.FrmCalendar = this.fb.group({
      fechaInicio:[Date, null],
      fechaFin:[Date, null],
      tipoOper:['', Validators.required],
      sucursal:['', Validators.required],
      consecutivo:[null, Validators.required],
      fechaPro:[Date, null],
      responsable:[null, Validators.required],
      cliente:[null, Validators.required],
      registros:[1, Validators.required]
    });
  }

  HacerCalendario(result:any){

  }

  InsertarFilas(){

  }
}
