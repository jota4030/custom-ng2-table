import { Component, OnInit,ElementRef,Sanitizer,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'ng-tabla',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
	config;
	columns=[];
	configColumns;
	sanitizer;
	showFilterRow=false;
	@Output() tableChanged= new EventEmitter();
	@Output() cellClicked= new EventEmitter();
	@Output() btnClicked= new EventEmitter();

  constructor(sanitizer:Sanitizer) { 
  	let _this = this;
  	this.sanitizer=sanitizer;
  }

  ngOnInit() {
  }
  sanitize(html){
	return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  onChangeTable(column){
  	this.columns.forEach(function (col) {
            if (col.name !== column.name && col.sort !== false) {
                col.sort = '';
            }
        });
        this.tableChanged.emit({ sorting: this.configColumns });
  }

  getData(row, propertyName,tipo="text"){
  	let that=this;
    return propertyName.split('.').reduce(
    function (prev, curr) {
        let result="";
        if(curr!==null && prev!==null){
            result=prev[curr];
        }
         return result; 
    }, row);
  }
  cellClick(event ,row, column){
  	this.cellClicked.emit({event:event, row: row, column: column });
  }

  borrarTodo(event){
  	 this.btnClicked.emit(event);
  }


}
