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

  constructor(private loaderService: LoaderService){
      this.loaderService.isLoading.subscribe((v) => {
        this.loading = v;
      });
    }

  ngOnInit() { 
  }

}
