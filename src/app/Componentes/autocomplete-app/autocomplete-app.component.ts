import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { ItemAutocomplete2, objetosComponenteAutoComplete, respuestaAutocomplete } from 'src/app/modelos/Interfaces';

@Component({
  selector: 'app-autocomplete-app',
  templateUrl: './autocomplete-app.component.html',
  styleUrls: ['./autocomplete-app.component.css']
})
export class AutocompleteAppComponent {
  myControl = new FormControl('');
  @Input() objetosComponenteAutoComplete: objetosComponenteAutoComplete;
  OpcionesFiltradas: Observable<any[]>;
  @Output() RetornarValueAutomcomplete = new EventEmitter<any>();

  ngOnInit() {
      this.OpcionesFiltradas = this.myControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        // map(value => this._filter(value || '')),
        map((value:any) => {
          const name = typeof value === 'string' ? value : value?.name;
          return this._filter(name as string)
        })
      );
    // console.log(this.objetosComponenteAutoComplete.LabelAuto);
    // console.log(this.objetosComponenteAutoComplete.ListaOpcionesAuto);
  }

  private _filter(value: string): ItemAutocomplete2[] {
    if(value)
    {
      const filterValue = value.toLowerCase();
      //console.log(this.objetosComponenteAutoComplete.ListaOpcionesAuto);
      let items = this.objetosComponenteAutoComplete.ListaOpcionesAuto.filter(op => op.name.toLowerCase().includes(filterValue));
      if(items.length == 1)
      {
        //Aquí devolver el id al form ppal
        //console.log(items[0]);
      }
      return items
    }
    return null;
  }

  displayFuncion(item: any): string {
    //Primer evento que se ejecuta
    return item && item.name ? item.name : '';
  }

  OpcionSelccionada(event:any, nombreCampomodelo: string)
  {
    let respuestaAutocomplete: respuestaAutocomplete = {
      valor: event.option.value,
      elemento: nombreCampomodelo
    };
    this.RetornarValueAutomcomplete.emit(respuestaAutocomplete);
  }
}
