import { Component, ElementRef, Inject, Input, SecurityContext, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modaldinamic',
  templateUrl: './modaldinamic.component.html',
  styleUrls: ['./modaldinamic.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModaldinamicComponent {
  description:string;
  //BodyDR: any;
  titleDR: string = "Adicionar Titulo";
  cancelButtonTextDR = "Cancelar";
  saveButtonTextDR = "Continuar";
  componenteDR: string="";
  modelEditar:object

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef: MatDialogRef<ModaldinamicComponent>, private sanitizer: DomSanitizer) {
    if (data) {
      //sanitizer.bypassSecurityTrustHtml((data.message || this.messageDR));
      //this.messageDR = sanitizer.bypassSecurityTrustHtml((data.message || this.messageDR));
      //this.messageDR = sanitizer.sanitize(SecurityContext.HTML, (data.message || this.messageDR));
      //this.formDymanic.nativeElement.innerHTML = data.message || this.formDymanic;
      // if(this.formDymanic !== undefined)
      // {
      //   //this.message = this.formDymanic.createEmbeddedView(data.message || this.formDymanic);
      //   //this.formDymanic.nativeElement.innerHTML(data.message || this.formDymanic);
      // }
      if (data.buttonText) {
        this.cancelButtonTextDR = data.buttonText.cancel || this.cancelButtonTextDR;
        if(data.buttonText.confirm)
        {
          this.saveButtonTextDR = data.buttonText.confirm || this.saveButtonTextDR;
        }
      }
      this.titleDR = data.titleag || this.titleDR;
      this.componenteDR = data.componenteag;
      this.modelEditar = data.dataedit
    }
    this.dialogRef.updateSize(data.widthdiag,data.heightdiag);

    // this.dialogRef.afterClosed().subscribe(result => {
    //   if(result) {
    //   }
    // });
  }

  close() {
    this.dialogRef.close();
  }
}
