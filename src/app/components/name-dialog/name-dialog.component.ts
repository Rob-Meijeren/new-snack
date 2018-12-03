import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss']
})
export class NameDialogComponent implements OnInit {
  public name: string;

  constructor(public dialogRef: MatDialogRef<NameDialogComponent>) {
    this.name = '';
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  setName() {
    this.dialogRef.close(this.name);
  }

}
