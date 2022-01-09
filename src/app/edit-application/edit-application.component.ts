import {AfterViewInit, Component, ViewChild,ElementRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import {ApplicationService} from './../application.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.css']
})
export class EditApplicationComponent implements AfterViewInit {
  records : appRecords[] | any = [];
  showAlertApplicants:boolean = false;
  recordsAlert : appRecords[] | any = [];
  displayedColumns: string[] = ['actions','applicationId', 'name', 'mobilenumber', 'dateCreated','firstAppeal','commissionAppeal','status'];
  dataSource = new MatTableDataSource<appRecords>(this.records);
  dataSourceAlert = new MatTableDataSource<appRecords>(this.recordsAlert);
  @ViewChild('input') input: ElementRef|any;
  value :string='';
  @ViewChild(MatPaginator) paginator: MatPaginator|any;
  @ViewChild(MatPaginator) paginatorAlert: MatPaginator|any;
  isLoading : boolean = false;
  alertRecordCount :number = 0;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceAlert.paginator = this.paginatorAlert;
    fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(1000),
                distinctUntilChanged(),
                tap((text) => {
                  console.log("test",this.input.nativeElement.value)
                  this.paginator.pageIndex=0;
                  this.onPageChange("");
                })
            )
            .subscribe();
    this.getApplicationRecords("?page=1");
    this.applicationService.getApplicationAlertRecords("?page=1").subscribe(res=>{
      this.alertRecordCount = res;
    })
    //this.getApplicationRecordsAlert("?page=1");
  }
  onValChange(val:any){
    console.log(val);
    this.showAlertApplicants = val.checked;
    this.paginator.pageIndex=0;
    this.getApplicationRecords("?page=1");
  }

  constructor(private applicationService:ApplicationService,private router:Router){}
  public getApplicationRecords(query:string){
    this.isLoading = true;
   this.applicationService.getApplicationRecords(query,this.showAlertApplicants).subscribe((records:any)=>{
     let data:any =[];
     records.results.forEach((element:any) => {
       data.push({id :element.id ,name:element.name,applicationId:element.applicationNumber,dateCreated:element.dateCreated,mobilenumber:element.mobilenumber,firstAppeal:element.firstAppeal ? true : false,commissionAppeal:element.commissionAppeal ? true :false,actions:true,status:element.applicationStatus})
     });
     this.paginator.length=records.count;
     console.log(this.paginator)
     console.log(data)
     this.dataSource = data;
     this.isLoading = false;
   })
  }

  // public getApplicationRecordsAlert(query:string){
  //   this.isLoading = true;
  //  this.applicationService.getApplicationAlertRecords(query).subscribe((records:any)=>{
  //    let data:any =[];
  //    records.results.forEach((element:any) => {
  //      data.push({id :element.id ,name:element.name,applicationId:element.applicationNumber,dateCreated:element.dateCreated,mobilenumber:element.mobilenumber,firstAppeal:element.firstAppeal ? true : false,commissionAppeal:element.commissionAppeal ? true :false,actions:true,status:element.applicationStatus})
  //    });
  //    this.paginatorAlert.length=records.count;
  //    this.dataSourceAlert = data;
  //    this.isLoading = false;
  //  })
  // }

  onPageChange(evt:any){
    let params = '';
    console.log(evt)
    if(this.value){
      params = `?search=${this.value}&search_fields=name&search_fields=application_number`
    }
    if(evt){
    if(params){
      params = params + `&page=${evt.pageIndex + 1}`
    }else{
      params =  `?page=${evt.pageIndex + 1}`
    }
    }
    this.getApplicationRecords(params);
    console.log(params)
  }
  onPageChange1(evt:any){
    let params = '';
    console.log(evt)
    if(this.value){
      params = `?search=${this.value}&search_fields=name&search_fields=application_number`
    }
    if(evt){
    if(params){
      params = params + `&page=${evt.pageIndex + 1}`
    }else{
      params =  `?page=${evt.pageIndex + 1}`
    }
    }
    //this.getApplicationRecordsAlert(params);
    console.log(params)
  }
  fa(element:any ,mode:string){
    debugger
    this.router.navigateByUrl('/create-application', { state:{data:{ mode,id:element.id } }});
  }
  bulkEdit(id:any){
    console.log(id);
   // this.router.navigateByUrl('/create-application', { state:{data:{ mode,id:element.id } }});
  }
  exportToCSV(){
    window.open(this.applicationService.REST_API_SERVER+'csvdownload')
  }
}

export interface appRecords {
  id:any;
  name: string;
  applicationId: number;
  dateCreated: string;
  mobilenumber: string;
  firstAppeal:any;
  commissionAppeal:any;

}

