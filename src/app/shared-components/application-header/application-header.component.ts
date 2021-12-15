import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.css']
})
export class ApplicationHeaderComponent implements OnInit {
  @Input() header = ''; 

  constructor() { }

  ngOnInit(): void {
  }

}
