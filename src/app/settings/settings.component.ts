import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../application.service';
import {DialogData,EditAddComponent} from '../modals/edit-add/edit-add.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfirmationDialogComponent,ConfirmationDialogModel} from '../modals/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  dropdownData:any = [];

  constructor(private applicationService:ApplicationService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.applicationService.getAppDropdown().subscribe(res=>{
      this.dropdownData = res;
    })
  }
  edit(value:any,index:any){
    console.log(this.dropdownData[index])
    const dialogRef = this.dialog.open(EditAddComponent, {
      width: '250px',
      data:{id:value.id,valueData:value.valueData,heading:"Edit option"}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.applicationService.patchAppDropdown(result.id,{valueData:result.valueData}).subscribe(res=>{
        this.dropdownData[index].valueData=result.valueData;
        console.log(res)
      })
    });
  }

  
  delete(data:any,index:any){
    const dialogData = new ConfirmationDialogModel('Confirm',"Are you sure you want to delete option ?");
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: '400px',
        closeOnNavigation: true,
        data: dialogData
    })
    console.log(index)
    dialogRef.afterClosed().subscribe(dialogResult => {
    
        if (dialogResult) {
           this.applicationService.deletAppDropdown(data.id).subscribe(res=>{
             console.log(res)
             this.dropdownData.splice(index, 1)
           })
        }
    });
  }
  add(value:any){
    const dialogRef = this.dialog.open(EditAddComponent, {
      width: '250px',
      data:{id:"",valueData:value.valueData,heading:"Add option"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.applicationService.postAppDropdown({valueData:result.valueData}).subscribe(res=>{
        console.log(res)
        this.dropdownData.push(res)
      })
    });
  }

}
