import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.css']
})

export class MyModalComponent {

  public applicationId: string ='';

  constructor(
    public dialogRef: MatDialogRef<MyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  print(): void {
    this.dialogRef.close({
      event: "print"
    });
  }
  close(): void {
    this.dialogRef.close({
      event: "close"
    });
  }


}