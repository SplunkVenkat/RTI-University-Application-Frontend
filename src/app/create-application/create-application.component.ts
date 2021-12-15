import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import {ApplicationService} from '../application.service';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MyModalComponent} from './../modals/my-modal/my-modal.component';
import {getDate} from '../utility';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {ApplicationFormComponent} from '../shared-components/application-form/application-form.component';
import {IFields,IForm} from '../shared-components/application-form/Iform';
import {BASE_APPLICATION,FA_SECTION,CA_SECTION} from '../constants';

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.css']
})
export class CreateApplicationComponent implements OnInit , AfterViewInit {
  @ViewChild(ApplicationFormComponent) child: ApplicationFormComponent | any;
  formConfig : any = [];
  isLoading : boolean = false;
  data : Array<IForm> = [];
  dropDownData :any= [];
  mode : string = '';
  applicationId:any;
  dateProcess =  (x: string): string => {
    if (x.length == 1){
      return "0" + x;
    }
    return x;
}
  constructor(private applicationService:ApplicationService,public dialog: MatDialog,private router: Router) { }
  
  ngOnInit(): void {
  this.dropDownData = this.applicationService.applicationDropdown;
  console.log(history.state.data)
  const { mode, id } = history.state.data
  this.mode = mode;
  this.applicationId =id;
  if(mode === 'freshapplication'){
    this.data = [BASE_APPLICATION]
  
  }
  if(mode === 'firstappealapplication'){
    this.data = [BASE_APPLICATION,FA_SECTION];
  }
  if(mode === 'commissionappealapplication' || mode === 'bulkEdit'){
    this.data = [BASE_APPLICATION,FA_SECTION,CA_SECTION];
  }
  
  if(this.data.length == 1){
    debugger;
    let updateDropdown = this.data[0].formFields.find((d:any)=>d.formControlName==='endorsement')
    updateDropdown!.options = this.dropDownData.filter((f:any)=>f.type == 'FE').map((m:any)=>{return {'id':m.id,'value':m.valueData}});
  }
  if(this.data.length == 2 || this.data.length == 3){
    debugger;
    let updateDropdown1 = this.data[0].formFields.find((d:any)=>d.formControlName==='endorsement')
    updateDropdown1!.options = this.dropDownData.filter((f:any)=>f.type == 'FE').map((m:any)=>{return {'id':m.id,'value':m.valueData}});
    let updateDropdown = this.data[1].formFields.find((d:any)=>d.formControlName==='appealEndorsement')
    updateDropdown!.options = this.dropDownData.filter((f:any)=>f.type == 'FAE').map((m:any)=>{return {'id':m.id,'value':m.valueData}});
  }
 
  
  // let applicationDate = this.data.find(d=>d.formControlName==='endorsementDate')
  // applicationDate!.value = getDate();
  
  this.formConfig =  this.data;
  debugger;
  }
  formChange(event:any){ 
    if(this.mode === 'freshapplication') {
    let payload = event.value.forms[0];
    let applicationNumber = this.processApplicationNumber(event.value.forms[0].dateCreated)
    payload = {...payload,...{applicationNumber}};
    debugger;
    payload.endorsement = payload.endorsement.toString()
    this.applicationService.createFreshApplication(payload).subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      this.openDialog(res)
    
    })
    }
    if(this.mode === 'firstappealapplication') {
      debugger;
      let payload = event.value.forms[0];
      payload.appealEndorsement = payload.appealEndorsement.toString();
      this.applicationService.updateFreshApplication({firstAppeal:payload},this.applicationId).subscribe((res:any)=>{
        console.log(res);
        this.isLoading = false;
       // this.openDialog(res)
      
      })
    }
    if(this.mode === 'commissionappealapplication') {
      debugger;
      let payload = event.value.forms[0];
      this.applicationService.updateFreshApplication({commissionAppeal:payload},this.applicationId).subscribe((res:any)=>{
        console.log(res);
        this.isLoading = false;
       // this.openDialog(res)
      
      })
    }
    if(this.mode == 'bulkEdit'){

    }
  }
  ngAfterViewInit(){
    debugger;
 
    this.applicationService.getApplicationById(this.applicationId).subscribe((res:any)=>{
      debugger;
      const {commissionAppeal , firstAppeal} = res;
      delete res.commissionAppeal;
      delete res.firstAppeal;
      delete res.id;
      delete res.applicationNumber;
     if(firstAppeal){
        delete firstAppeal.id
        delete firstAppeal.appealApplicationNumber
      }
      if(commissionAppeal){
        delete commissionAppeal.id
        delete commissionAppeal.commissionApplicationNumber
     }
      if(this.mode === 'firstappealapplication'){
        res.endorsement = res.endorsement.split(",");
        this.child.applicationForm.controls.forms.controls[0].setValue(res);
        this.child.applicationForm.controls.forms.controls[0].disable();
      }
      if(this.mode === 'commissionappealapplication'){
        res.endorsement = res.endorsement.split(",");
        firstAppeal.appealEndorsement = firstAppeal.appealEndorsement.split(",");
        this.child.applicationForm.controls.forms.controls[0].setValue(res)
        this.child.applicationForm.controls.forms.controls[1].setValue(firstAppeal)
        this.child.applicationForm.controls.forms.controls[0].disable();
        this.child.applicationForm.controls.forms.controls[1].disable();
      }
      if(this.mode === "bulkEdit"){
        debugger;
        res.endorsement = res.endorsement.split(",");
        firstAppeal.appealEndorsement = firstAppeal.appealEndorsement.split(",");
        this.child.applicationForm.controls.forms.controls[0].setValue(res)
        this.child.applicationForm.controls.forms.controls[1].setValue(firstAppeal)
        this.child.applicationForm.controls.forms.controls[2].setValue(commissionAppeal)
        console.log(this.child.applicationForm.controls.forms);
        debugger;
      }
      if(this.mode === "freshApplication"){
        debugger;
        this.child.applicationForm.controls.forms.controls[0].setValue(res)
        this.child.applicationForm.controls.forms.controls[2].setValue(commissionAppeal)
        console.log(this.child.applicationForm.controls.forms);
        debugger;
      }
    })
    
    console.log(this.child.applicationForm);
    //this.child.applicationForm.controls.forms.controls[0].controls.endorsement.setValue(['1']);
   
  }

  mapPayloadForSave(data: any) {
    let lastDate = new Date(data.applicationLastDate)
    lastDate.setDate(lastDate.getDate() + 30);
    const applicationNumber = this.processApplicationNumber(data.applicationDate)
    let payload :any= {
      "name": data.name,
      "ofName": data.ofname,
      "date_created":moment(new Date(data.applicationDate)).format('YYYY-MM-DD'),
      "address": data.address,
      "mobilenumber": data.contactNumber,
      "date_receive": moment(new Date(data.applicationReceivingDate)).format('YYYY-MM-DD'),
      "is_svu": data.isSVU === 'yes' ? true : false,
      "last_date": data.applicationLastDate ? moment(new Date(lastDate)).format('YYYY-MM-DD')  : "",
      "endrosement_date": data.endorsementDate ? moment(new Date(data.endorsementDate)).format('YYYY-MM-DD')  : "",
      "endrosement": data.endorsementSection ? data.endorsementSection.toString() : "",
      "application_related": data.applicationRelated,
      "address_transmitted": data.addressTransmit,
      "application_number": applicationNumber
    }
    if(payload.is_svu){
      ['application_related', 'address_transmitted'].forEach(e => delete payload[e]);
    }else {
      ['last_date', 'endrosement_date','endrosement'].forEach(e => delete payload[e]);
    }
    this.isLoading = true;
    this.applicationService.createFreshApplication(payload).subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      this.openDialog(res)
     
    })
    
  }

  public processApplicationNumber(date:any){
    let d = moment(date);
    return parseInt(this.dateProcess(d.date().toString()) + this.dateProcess((d.month()+1).toString()) + d.year().toString().substr(-2))
  }
  generatePdfText(data:any){
    
    let tempMain=`<div style='text-align:left;'>
    <p style="text-indent: 30px;">
     <b> Endorsement No. Legal & RTI/Appl.No. (${data.application_number}), dt:(${new Date(data.date_receive).toDateString()})</b> 
      </p><br>
     <p style="text-indent: 30px;"><b> Copy of the application received from (${data.name})is forwarded to the following sections and informed to provide the information to the applicant  related to their sections with a copy to this section on or before (${new Date(data.date_receive).toDateString()}) without fail.  </b></p>
     <div style="text-align:right;margin-top=300px;">REGISTRAR & PIO</div>
    </div>`
    return tempMain;
    }

    printApplication(data:any){
      var content=this.generatePdfText(data);
      var frame1:any = document.createElement('iframe');
      frame1.name = 'frame3';
      frame1.style.position = "absolute";
      frame1.style.top = "-1000000px";
      document.body.appendChild(frame1);
      var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument['document'] ? frame1.contentDocument['document'] : frame1.contentDocument;
      frameDoc.document.open();
      frameDoc.document.write(`<html><head> <style>
      table, td, th {    
          border: 1px solid #ddd;
          text-align: left;
      }
      
      table {
          border-collapse: collapse;
          width: 100%;
      }
      
      th, td {
          padding: 8px;
      }
      #footer {
          position:absolute;
          bottom:0;
          width:100%;
          height:60px;
          background:#6cf;
       }
     </style>`);
      frameDoc.document.write('</head><body>');
      frameDoc.document.write(content);
      frameDoc.document.write('<div id="footer" style="text-align:center;"><hr></div></body></html>');
      frameDoc.document.close();
      this.child.resetForm();
      setTimeout(()=> {
        let frames:any = window.frames;
        frames["frame3"].focus();
        frames["frame3"].print();
        document.body.removeChild(frame1);
        this.ngOnInit();
      }, 1000);
    }

    openDialog(data1:any): void {
      const dialogRef = this.dialog.open(MyModalComponent, {
        width: '250px',
        data: {id:data1.application_number}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(result.event === 'print'){
          this.printApplication(data1)
        }else{
          this.router.navigate(['edit-application']);
        }
      });
    }

}
