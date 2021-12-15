import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private REST_API_SERVER = "http://127.0.0.1:8000/playground/";
  public applicationDropdown : any =[];

  constructor(private http: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 

  public getApplicationDropdown() {
    if (this.applicationDropdown.length === 0) {
      return this.http.get(this.REST_API_SERVER + 'applicationdropdown').subscribe(res=>{
        this.applicationDropdown = res;
      })
    }
    return of(this.applicationDropdown)
  }

  public createFreshApplication(data: any) {
    return this.http.post(this.REST_API_SERVER + 'application', data, this.httpHeader);
  }
  public updateFreshApplication(data: any,id:any) {
    return this.http.patch(this.REST_API_SERVER + 'application?id='+id, data, this.httpHeader);
  }
  public getApplicationRecords(query:string){
    return this.http.get(this.REST_API_SERVER + 'applicationsrecords'+query)
  }
  public getApplicationById(id:string){
    return this.http.get(this.REST_API_SERVER + 'application/'+id)
  }
  public deleteApplicationById(queryParams:string){
    return this.http.delete(this.REST_API_SERVER +  'application/'+queryParams)
  }
}
