import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ResponseM2 } from "src/app/modelos/Interfaces";
import {NgFor, AsyncPipe, CurrencyPipe} from '@angular/common';


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
    let fieldMoneyT = currencyPipe.transform((!StringIsNullOrEmpty(fieldMoney.value) && !isNaN(parseFloat(fieldMoney.value)) ? fieldMoney.value : '0'));
    respuesta = (!StringIsNullOrEmpty(fieldMoney.value) && !isNaN(parseFloat(fieldMoney.value)) ?  parseFloat(fieldMoney.value)  :  0.00);
    fieldMoney.setValue(fieldMoneyT);
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