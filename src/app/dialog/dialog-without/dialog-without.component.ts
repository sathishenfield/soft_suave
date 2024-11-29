import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `<div [innerHTML]="data.htmlContent"></div>`,
})
export class DialogWithoutComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogWithoutComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

}
