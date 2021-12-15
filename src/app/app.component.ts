import { Component ,OnInit } from '@angular/core';
import {ApplicationService} from './application.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'college';
  headerTitle='';

  constructor(private applicationService:ApplicationService){}

  ngOnInit() { 
    this.applicationService.getApplicationDropdown()
  }

}
