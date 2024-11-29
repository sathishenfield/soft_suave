import { Component ,inject} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

  cancel(){
    this.dialogRef.close(false);
  }

  delete(){
    this.dialogRef.close(true);
  }
}
