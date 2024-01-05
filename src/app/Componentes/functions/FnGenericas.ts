import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ResponseM2 } from "src/app/modelos/Interfaces";
import {NgFor, AsyncPipe, CurrencyPipe} from '@angular/common';
import * as XLSX from 'xlsx';


export function ConvertStringToDecimal(valor: string = "0"):number
{
    let _valor:any = valor.includes(",") ? parseFloat(valor.replace(",", ".")).toFixed(2) : parseFloat(valor).toFixed(2);
    return _valor;
}

export function CompositeMensajeFields(Response :ResponseM2):string
{
    if(Response.message.includes("Errores de validación") && Response.fields != undefined && Response.fields.length > 0)
    {
        console.log(Response.fields);
        return Response.fields.prototype.join("\n");
    }
    else
        return "";

}

export function RemoveAccents(str: string)
{
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// export function ResetForm(agForm:NgForm, agFormG: FormGroup){
//     agFormG.reset({});
//     agFormG.markAsUntouched();
//     //setTimeout(() => agForm.resetForm(), 0)
//     // Object.keys(agFormG.controls).forEach(key => {
//     //     agFormG.get(key)?.setErrors(null) ;
//     // });
// }

export function StringIsNullOrEmpty(str: string)
{
    return str == null || str == undefined || str == '' ? true : false;
}

export function ValidateFieldsForm(frm: FormGroup)
{
    // frm.controls.forEach((f:FormControl) => {

    // })

    Object.keys(frm.controls).forEach(f => {
        if(frm.controls[f].invalid)
        {
        console.log('campo ' + f);
        console.log(frm.controls[f].value);
        console.log(frm.controls[f].invalid);
        }
    });
}

export function transformMoney(fieldMoney: FormControl)
{
    let respuesta = 0;
    //this.FrmInfoFinanciera.controls["subscribedcapital"]?.setValue(this.currencyPipe.transform(StringIsNullOrEmpty(this.FrmInfoFinanciera.controls["subscribedcapital"]?.value) ? '0' : this.FrmInfoFinanciera.controls["subscribedcapital"]?.value, '$'));
    let currencyPipe : CurrencyPipe = new CurrencyPipe('en-US', '$');
    console.log(currencyPipe.transform(fieldMoney.value.replace('$','').replace(',','').replace('.00','')))
    return respuesta;
}

export function NameTipeDocument(typedoc: number)
{
    let rtaNameDoc ="";
    switch(typedoc){
        case 11:
            rtaNameDoc = "Registro civil de nacimiento";
            break;
        case 12:
            rtaNameDoc = "Tarjeta de identidad";
            break;
        case 13:
            rtaNameDoc = "Cédula de ciudadanía";
            break;
        case 21:
            rtaNameDoc = "Tarjeta de extranjería";
            break;
        case 22:
            rtaNameDoc = "Cédula de extranjería";
            break;
        case 31:
            rtaNameDoc = "NIT";
            break;
        case 41:
            rtaNameDoc = "Pasaporte";
            break;
        case 42:
            rtaNameDoc = "Tipo de documento extranjero";
            break;
        case 42:
            rtaNameDoc = "Sin identificación del Exterior o uso definido por la DIAN";
            break;
    }
    return rtaNameDoc;
}

export function hasRequiredValidator(Form: FormGroup, controlName: string): boolean {
    const control = Form.get(controlName);
    if (control) {
        const validators = control.validator(control);
        return validators === Validators.required;
    }
    return false;
}

export function todosMiembrosSonNulos(obj: any): boolean[] {
    let rta: boolean[] = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null)
        rta.push(obj.hasOwnProperty(key) && obj[key] !== null ? false : true);
    }
    return rta;
}

// export function readExcelFile(file: File, numberSheet: number = 0): Promise<any[]> {
export function readExcelFile(file: File, numberSheet: number = 0): Promise<{ headers: string[], data: any[], sheetExcel: XLSX.WorkSheet}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array((e.target as any).result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[numberSheet];
                const worksheet = workbook.Sheets[sheetName];

                // Obtener los encabezados de la hoja de Excel
                // const headers: string[] = [];
                // for (const key in worksheet) {
                //     if (worksheet.hasOwnProperty(key) && key.startsWith('A1')) {
                //         headers.push(worksheet[key].v);
                //     }
                // }
                const headers: string[] = [];
                const range = XLSX.utils.decode_range(worksheet['!ref']);
        
                for (let C = range.s.c; C <= range.e.c; ++C) {
                  const cellAddress = { r: 0, c: C };
                  const cellRef = XLSX.utils.encode_cell(cellAddress);
                  headers.push(worksheet[cellRef]?.v || '');
                }

                // Convertir los datos de la hoja de cálculo a un array de objetos
                const excelData: any[] = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 }).slice(1);
                //resolve(excelData);
                resolve({ headers, data: excelData, sheetExcel:  worksheet});
                //console.log(excelData);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

//Recibe un formato dd/MM/yyyy o dd-MM-yyyyy
export function ConvertStringDateTODateTime(fechastring :string, tipoFomartoIn: string):Date
{
    let dia = 0;
    let mes = 0;
    let anio = 0;
    switch(tipoFomartoIn)
    {
        case 'dd/MM/yyyy':
            const partesFechaF1 = fechastring.split('/');
            // Obtener los componentes de la fecha
            dia = parseInt(partesFechaF1[0], 10);
            mes = parseInt(partesFechaF1[1], 10) - 1; // Restar 1 porque los meses en JavaScript son de 0 a 11
            anio = parseInt(partesFechaF1[2], 10);
            break;
        case 'dd-MM-yyyy':
            const partesFechaF2 = fechastring.split('-');
            // Obtener los componentes de la fecha
            dia = parseInt(partesFechaF2[0], 10);
            mes = parseInt(partesFechaF2[1], 10) - 1; // Restar 1 porque los meses en JavaScript son de 0 a 11
            anio = parseInt(partesFechaF2[2], 10);
            break;
    }
    return new Date(anio, mes, dia);
}