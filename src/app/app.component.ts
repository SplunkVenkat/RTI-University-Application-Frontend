import { Component ,OnInit } from '@angular/core';
import {ApplicationService} from './application.service';
import {LoaderService} from './loader.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'college';
  headerTitle='';
  loading:boolean = false;

  constructor(private applicationService:ApplicationService,
    private loaderService: LoaderService){
      this.loaderService.isLoading.subscribe((v) => {
        console.log(v);
        this.loading = v;
      });
    }

  ngOnInit() { 
    this.applicationService.getApplicationDropdown()
  }

}
