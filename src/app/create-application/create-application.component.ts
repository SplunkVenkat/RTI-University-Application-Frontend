import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import {ApplicationService} from '../application.service';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MyModalComponent} from './../modals/my-modal/my-modal.component';
import {getDate,addDaysToDate} from '../utility';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {ApplicationFormComponent} from '../shared-components/application-form/application-form.component';
import {IFields,IForm} from '../shared-components/application-form/Iform';
import {BASE_APPLICATION,FA_SECTION,CA_SECTION} from '../constants';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.css'],
  providers: [DatePipe]
})
export class CreateApplicationComponent implements OnInit , AfterViewInit {
  @ViewChild(ApplicationFormComponent) child: ApplicationFormComponent | any;
  formConfig : any = [];
  isLoading : boolean = false;
  data : Array<IForm> = [];
  dropDownData :any= [];
  mode : string = '';
  applicationId:any;
  dataForBulkEdit :any;
  dateProcess =  (x: string): string => {
    if (x.length == 1){
      return "0" + x;
    }
    return x;
}
  constructor(private applicationService:ApplicationService,public dialog: MatDialog,private router: Router,public datepipe: DatePipe) { }
  
  ngOnInit(): void {
  this.dropDownData = this.applicationService.applicationDropdown;
  console.log(history.state.data)
  const { mode, id } = history.state.data
  this.mode = mode;
  this.applicationId =id;
  debugger;
 if(mode === 'freshapplication'){
    this.data = [BASE_APPLICATION]
    this.data[0].title = "Fresh Application";
  
  }
  if(mode === 'firstappealapplication'){
    this.data = [BASE_APPLICATION,FA_SECTION];
  }
  if(mode === 'commissionappealapplication' || mode === 'bulkEdit'){
    this.data = [BASE_APPLICATION,FA_SECTION,CA_SECTION];
  }
  this.data.forEach(d=>{
    d.showPrintButton = false;
  });
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
  if(this.data.length === 3){
    this.data.forEach(d=>{
     // d.showRevokeButton = true;
    })
  }
 
  
  // let applicationDate = this.data.find(d=>d.formControlName==='endorsementDate')
  // applicationDate!.value = getDate();
  
  this.formConfig =  this.data;
  debugger;
  }
  formChange(event:any){ 
    if(this.mode === 'freshapplication') {
    let payload = event.value.forms[0];
    let applicationNumber = this.processApplicationNumber(event.value.forms[0].dateCreated);
    debugger;
    if (this.child.applicationForm.controls.forms.controls[0].get('isSvu').value == "1"){
      let lastDate = this.child.applicationForm.controls.forms.controls[0].get('lastDate').value;
      payload={...payload,...{lastDate}}
      payload.endorsement = payload.endorsement.toString()
    }
    payload = {...payload,...{applicationNumber}};
    debugger;
    
    this.applicationService.createFreshApplication(payload).subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      debugger;
      let endorsement = res.endorsement.split(",").map((a:any)=>this.dropDownData.find((b:any)=>b.id == Number(a)).valueData);
      this.openDialog("fresh",res.applicationNumber,res)
    
    })
    }
    if(this.mode === 'firstappealapplication') {
      debugger;
      let payload = event.value.forms[0];
      payload.appealEndorsement = payload.appealEndorsement.toString();
      this.applicationService.updateFreshApplication({firstAppeal:payload},this.applicationId).subscribe((res:any)=>{
        console.log(res);
        this.isLoading = false;
       this.openDialog("fa",res.firstAppeal.appealApplicationNumber,res)
      
      })
    }
    if(this.mode === 'commissionappealapplication') {
      debugger;
      let payload = event.value.forms[0];
      this.applicationService.updateFreshApplication({commissionAppeal:payload},this.applicationId).subscribe((res:any)=>{
        console.log(res);
        this.isLoading = false;
       this.openDialog("ca",res.commissionAppeal.commissionApplicationNumber,res)
      
      })
    }
    if(this.mode == 'bulkEdit'){
      let application = event.value.forms[0];
      debugger;
      if (this.child.applicationForm.controls.forms.controls[0].get('isSvu').value == "1"){
        let lastDate = this.child.applicationForm.controls.forms.controls[0].get('lastDate').value;
        application={...application,...{lastDate}}
        application.endorsement = application.endorsement.toString()
      }
      //----------------------------->
      
      let firstAppeal = event.value.forms[1];
      firstAppeal.appealEndorsement = firstAppeal.appealEndorsement.toString();
      let commissionAppeal = event.value.forms[2];
      debugger;
      let payload = {...application,...{firstAppeal},...{commissionAppeal}}
      console.log(payload)
      this.applicationService.updateFreshApplication(payload,this.applicationId).subscribe((res:any)=>{
        console.log(res);
        this.isLoading = false;
       //this.openDialog(res.commissionAppeal.applicationNumber)
      
      })

    }
  }
  ngAfterViewInit(){
    debugger;
 
    this.applicationService.getApplicationById(this.applicationId).subscribe((res:any)=>{
      debugger;
      this.dataForBulkEdit = JSON.parse(JSON.stringify(res));
      const {commissionAppeal , firstAppeal} = res;
      this.child.updateApplicationNumber(0,res.applicationNumber);
      this.child.updateApplicationNumber(1,firstAppeal ? firstAppeal.appealApplicationNumber : null);
      this.child.updateApplicationNumber(2,commissionAppeal ? commissionAppeal.commissionApplicationNumber : null);
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
        if(this.child.applicationForm.controls.forms.controls[0].get('isSvu').value == "1"){
          this.child.applicationForm.controls.forms.controls[0].get('applicationRelated').disable();
          this.child.applicationForm.controls.forms.controls[0].get('addressTransmitted').disable();
        }else{
          this.child.applicationForm.controls.forms.controls[0].get('endorsement').disable();
          this.child.applicationForm.controls.forms.controls[0].get('endorsementDate').disable();
        }
      }
      if(this.mode === "freshApplication"){
        // debugger;
        // this.child.applicationForm.controls.forms.controls[0].setValue(res)
        // this.child.applicationForm.controls.forms.controls[2].setValue(commissionAppeal)
        // this.child.updateApplicationNumber(0,null);
        // console.log(this.child.applicationForm.controls.forms);
        // debugger;
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
     // this.openDialog(res)
     
    })
    
  }

  public processApplicationNumber(date:any){
    let d = moment(date);
    return parseInt(this.dateProcess(d.date().toString()) + this.dateProcess((d.month()+1).toString()) + d.year().toString().substr(-2))
  }
  generatePdfText(type: any, data: any) {
    debugger;
    // const d = new Date(data.dateReceive);
    // d.setDate(d.getDate() + 20);
    // let tempMain=`<div style='text-align:left;'>
    // <p style="text-indent: 30px;">
    //  <b> Endorsement No. Legal & RTI/Appl.No. (${data.applicationNumber}), dt:(${data.dateReceive})</b> 
    //   </p><br>
    //  <p style="text-indent: 30px;"><b> Copy of the application received from (${data.name})  is forwarded to the following sections and informed to provide the information to the applicant  related to their sections with a copy to this section on or before (${this.datepipe.transform(d, 'yyyy-MM-dd')}) without fail.  </b></p><br>
    //  ${this.generateOrderedList(type,data)}
    //  <div style="text-align:right;margin-top=300px;">REGISTRAR & PIO</div>
    // </div>`
    // return tempMain;


    let res = ""
    switch (type) {
      case "fresh": {
        const d = new Date(data.dateReceive);
        d.setDate(d.getDate() + 20);
        res = `<div style='text-align:left;'>
    <p style="text-indent: 30px;">
     <b> Endorsement No. Legal & RTI/Appl.No. (${data.applicationNumber}), dt:(${data.dateReceive})</b> 
      </p><br>
     <p style="text-indent: 30px;"><b> Copy of the application received from (${data.name})  is forwarded to the following sections and informed to provide the information to the applicant  related to their sections with a copy to this section on or before (${this.datepipe.transform(d, 'yyyy-MM-dd')}) without fail.  </b></p><br>
     ${this.generateOrderedList(type, data)}
     <div style="text-align:right;margin-top=300px;">REGISTRAR & PIO</div>
    </div>`
        break;
      }
      case "fa": {
res = `<div style='text-align:left;'>
<p style="text-indent: 30px;">
 <b> Endorsement No. Legal & RTI/Appl.No. (${data.firstAppeal.appealApplicationNumber}), dt:(${data.firstAppeal.appealDateReceive})</b> 
  </p><br>
 <p style="text-indent: 30px;"><b>Copy of the First appeal is forwarded to the following sections (${this.getFirstAppealReasons(data.firstAppeal.appealReason)}) within the period of 30 days from the date of receipt of the application by the University i.e. (${this.datepipe.transform(addDaysToDate(data.dateReceive,30), 'yyyy-MM-dd')}). The applicant has filed First Appeal to provide the relevant information. The following sections is hereby directed to provide the information within (${this.datepipe.transform(addDaysToDate(data.firstAppeal.appealDateReceive,25), 'yyyy-MM-dd')}) to the applicant  related to their sections with a copy to this section. Failing which the concerned section head & concerned assistant will be held responsible and need to face the consequences in the order of the Hon’ble Commisison, RTI.
 </b></p><br>
 ${this.generateOrderedList(type, data)}
 <div style="text-align:right;margin-top=300px;">REGISTRAR & PIO</div>
</div>`
    break;
      }
      case "ca": {
        res = `<div style='text-align:left;'>
    <p style="text-indent: 30px;">
     <b> Endorsement No. Legal & RTI/Appl.No. (${data.commissionAppeal.commissionApplicationNumber}), dt:(${data.commissionAppeal.noticeDate})</b> 
      </p><br>
     <p style="text-indent: 30px;"><b>Copy of the Notice received from the Hon’ble RTI Commission is forwarded to the following sections to submit a brief report along with the supporting documents to the undersigned within 2 days from the date of receipt of this letter.</b></p><br>
     <div style="text-align:right;margin-top=300px;">REGISTRAR & PIO</div>
    </div>`
        break;
      }
    }
    return res;
  }
  public generateOrderedList(type: string,data:any) {
    let res = "" 
    switch (type) {
      case "fresh": {
        let endorsement = data.endorsement ? data.endorsement.split(",").map((a:any)=>this.dropDownData.find((b:any)=>b.id == Number(a)).valueData) : [];
        let ol = "";
        endorsement.forEach((element:any) => {
          ol += `<li>${element}</li>`
        });
        res = `<ol>${ol}</ol>`
        break;
      }
      case "fa": {
        let endorsement = data.firstAppeal.appealEndorsement.split(",").map((a:any)=>this.dropDownData.find((b:any)=>b.id == Number(a)).valueData);
        let ol = "";
        endorsement.forEach((element:any) => {
          ol += `<li>${element}</li>`
        });
        res = `<ol>${ol}</ol>`
        break;
      }
      case "ca": {
        break;
      }
    }
    return res;
  }
    printApplication(type:any,pdfContent:any){
      var content=this.generatePdfText(type , pdfContent);
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
      //this.child.resetForm();
      setTimeout(()=> {
        let frames:any = window.frames;
        frames["frame3"].focus();
        frames["frame3"].print();
        document.body.removeChild(frame1);
       // this.ngOnInit();
      }, 1000);
    }

    openDialog(type:any,applicationNumber:any, pdfData:any): void {
      const dialogRef = this.dialog.open(MyModalComponent, {
        width: '250px',
        data: {id:applicationNumber}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(result.event === 'print'){
          this.printApplication(type ,pdfData)
        }else{
          this.router.navigate(['edit-application']);
        }
      });
    }
    getFirstAppealReasons(appealReason:any):string{
      let data:any = [{
        "id": 1,
        "value": "Non receipt of the information"
      },
      {
        "id": 2,
        "value": "Not satisfied by the information"
      },
      {
        "id": 3,
        "value": "Non receipt of the information & Not satisfied by the information"
      }]
      return data[Number(appealReason)-1].value;
    }
    printPDF(type:string){
      this.printApplication(type ,this.dataForBulkEdit)
    }
    deleteOrRevokeApplication(type:string){
      debugger;
      this.applicationService.deleteApplicationById(this.applicationId+type).subscribe((res)=>{
        console.log("deleted");
      })
    }

}
