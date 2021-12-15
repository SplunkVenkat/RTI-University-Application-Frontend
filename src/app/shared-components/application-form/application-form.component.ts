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
  applicationForm: FormGroup | any ;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.applicationForm = this.createForm();
    // let data1 = ['applicationRelated', 'addressTransmit']
    // data1.forEach(a => {
    //   this.applicationForm.get(a).disable();
    // })
    // this.applicationForm.get('applicationLastDate').disable();
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
   // this.applicationForm.get('endorsementSection').disable();
    console.log(this.applicationForm.value)
  }
  onValueChange(type: string, formname: string, value?: string) {
    debugger;
    // let data1 = ['applicationRelated', 'addressTransmit'];
    // let data2 = ['endorsementDate', 'endorsementSection', 'applicationLastDate'];
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
    console.log("child")
    this.applicationForm.reset();
    this.ngOnInit()
  }

}
