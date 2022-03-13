import { Component, OnInit, Input ,EventEmitter, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder ,Validators, FormArray } from '@angular/forms';
import { IFields,IForm } from './Iform';
import {getDate} from '../../utility';
import * as moment from 'moment';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  @Input() applicationFields : Array<IForm> = [];
  @Output() valueChange = new EventEmitter();
  @Output() printpdf = new EventEmitter();
  @Output() revoke = new EventEmitter();
  applicationForm: FormGroup | any ;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.applicationForm = this.createForm();
    // let data1 = ['applicationRelated', 'addressTransmit']
    // data1.forEach(a => {
    //   this.applicationForm.get(a).disable();
    // })
    this.applicationForm.controls.forms.controls[0].get('lastDate').disable();
  }

  createForm():FormGroup{
    let fields = [];
    
    const group = this.formBuilder.group({
      forms: this.formBuilder.array([])
    });
    let forms = group.get("forms") as FormArray
    this.applicationFields.forEach((data: IForm) => {
      //group.addControl(data.formControlName, this.formBuilder.control(data.value,data.required ? Validators.required : []))
      forms.push(this.buildForm(data.formFields))

    })
    return group;
  }
  get forms() : FormArray {
    return this.applicationForm.get("forms") as FormArray
  }
  buildForm(form:IFields[]):FormGroup{
    const group = this.formBuilder.group({});
    form.forEach((data: IFields) => {
      group.addControl(data.formControlName, this.formBuilder.control(data.value,data.required ? Validators.required : []))
    })
    return group;
  }
  data(){
  }
  onValueChange(type:number, formname :string, value?: any){
   let data1 = ['applicationRelated', 'addressTransmitted'];
  let data2 = ['endorsementDate', 'endorsement', 'lastDate'];
  if(formname === 'isSvu' && value === 1){
    data1.forEach(a=>{
      this.applicationForm.controls.forms.controls[type].get(a).reset();
      this.applicationForm.controls.forms.controls[type].get(a).disable();
    })
    data2.forEach(a => {
          if(a=='endorsementDate'){
            this.applicationForm.controls.forms.controls[type].get(a).enable();
            this.applicationForm.controls.forms.controls[type].get(a).setValue(getDate());
          }else if( a=='lastDate'){
            if(this.applicationForm.controls.forms.controls[type].get('dateCreated').value){
            const d = new Date(this.applicationForm.controls.forms.controls[type].get('dateCreated').value);
          d.setDate(d.getDate() + 30);
         this.applicationForm.controls.forms.controls[type].get('lastDate').setValue(moment(new Date(d)).format('YYYY-MM-DD'));
            }
          } else{
            this.applicationForm.controls.forms.controls[type].get(a).enable();
          }
  })
  }
  if(formname === 'isSvu' && value === 2){
         data2.forEach(a => {
          this.applicationForm.controls.forms.controls[type].get(a).reset();
          this.applicationForm.controls.forms.controls[type].get(a).disable();
      })
      data1.forEach(a => {
        if(a!=='lastDate'){
          this.applicationForm.controls.forms.controls[type].get(a).enable();
        }
      })
  }
    if(formname == 'dateReceive'){
      const d = new Date(this.applicationForm.controls.forms.controls[type].get('dateReceive').value);
      d.setDate(d.getDate() + 29);
      this.applicationForm.controls.forms.controls[type].get('lastDate').setValue(moment(new Date(d)).format('YYYY-MM-DD'));
    }
}
  save(type: string, formname: string, value?: string) {
    // let data1 = ['applicationRelated', 'addressTransmitted'];
    // let data2 = ['endorsementDate', 'endorsement', 'lastDate'];
    // if(formname == 'applicationDate'){
    //   const d = new Date(this.applicationForm.get('applicationDate').value);
    //   d.setDate(d.getDate() + 30);
    //   this.applicationForm.get('applicationLastDate').setValue(moment(new Date(d)).format('YYYY-MM-DD'));
    // }
    // if(formname == 'applicationDate'){
    //   const d = new Date(this.applicationForm.get('applicationDate').value);
    //   d.setDate(d.getDate() + 30);
    //   this.applicationForm.get('applicationLastDate').setValue(moment(new Date(d)).format('YYYY-MM-DD'));
    // }
    // if (formname == 'isSVU' && value == 'yes') {
    //   data1.forEach(a => {
    //     this.applicationForm.get(a).reset();
    //     this.applicationForm.get(a).disable();
    //   })
    //   data2.forEach(a => {
    //     if(a=='endorsementDate'){
    //       this.applicationForm.get(a).enable();
    //       this.applicationForm.get(a).setValue(getDate());
    //     }else{
    //       this.applicationForm.get(a).enable();
    //     }
        
    //   })
    // } else if (formname == 'isSVU' && value == 'no') {
    //   data2.forEach(a => {
    //     this.applicationForm.get(a).reset();
    //     this.applicationForm.get(a).disable();
    //   })
    //   data1.forEach(a => {
    //     this.applicationForm.get(a).enable();
    //   })
    // }
     this.valueChange.emit({ type, formname, value })
  }
  public resetForm(){
    this.applicationForm.reset();
    this.ngOnInit()
  }

  public updateApplicationNumber(slot:number , appId:string){
    let header = ['Fresh Application','First Appeal','Commission Appeal'];
    if(this.applicationFields[slot]){
      this.applicationFields[slot].title = appId ? header[slot] +" - "+appId :   header[slot];
    }else{
      //this.applicationFields[slot].title = header[slot]
    }
    
  }
  printPDF(type:any){
    switch (type) {
      case 0:
        this.printpdf.emit('fresh')
        break;
      case 1:
        this.printpdf.emit('fa')
        break;
      case 2:
        this.printpdf.emit('ca')
        break;
    
      default:
        break;
    }
    
  }
  revokeApplication(type:any){
    switch (type) {
      case 0:
        this.revoke.emit('')
        break;
      case 1:
        this.revoke.emit('?appeal=fa')
        break;
      case 2:
        this.revoke.emit('?appeal=ca')
        break;
    
      default:
        break;
    }
  }

}
