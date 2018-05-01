"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var NgTableComponent = (function () {
    function NgTableComponent(sanitizer,ElementRef) {
        this.sanitizer = sanitizer;
        // Table values
        this.rows = [];
        // Outputs (Events)
        this.tableChanged = new core_1.EventEmitter();
        this.cellClicked = new core_1.EventEmitter();
        this.btnClicked = new core_1.EventEmitter();
        this.showFilterRow = false;
        this._columns = [];
        this._config = {};
        this.elemento =new core_1.ElementRef(this);
        this.elementoTabla= this.elemento.nativeElement
    }
    Object.defineProperty(NgTableComponent.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (conf) {
            if (!conf.className) {
                conf.className = 'table-striped table-bordered';
            }
            if (conf.className instanceof Array) {
                conf.className = conf.className.join(' ');
            }
            this._config = conf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (values) {
            var _this = this;
            values.forEach(function (value) {
                if (value.filtering) {
                    _this.showFilterRow = true;
                }
                if (value.className && value.className instanceof Array) {
                    value.className = value.className.join(' ');
                }
                var column = _this._columns.find(function (col) { return col.name === value.name; });
                if (column) {
                    Object.assign(column, value);
                }
                if (!column) {
                    _this._columns.push(value);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.sanitize = function (html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    };
    Object.defineProperty(NgTableComponent.prototype, "configColumns", {
        get: function () {
            var sortColumns = [];
            this.columns.forEach(function (column) {
                if (column.sort) {
                    sortColumns.push(column);
                }
            });
            return { columns: sortColumns };
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.onChangeTable = function (column) {
        this._columns.forEach(function (col) {
            if (col.name !== column.name && col.sort !== false) {
                col.sort = '';
            }
        });
        // console.log("cambiooooooooooooooooooooooooooooo")
        this.tableChanged.emit({ sorting: this.configColumns });
    };
    NgTableComponent.prototype.getData = function (row, propertyName,tipo="text") {
        let that=this;
        return propertyName.split('.').reduce(
            function (prev, curr) {
                // console.log("*............*",row)
                let result="";
                if(curr!==null && prev!==null){
                    result=prev[curr];
                }
                 return result; 
            }, row);
    };
    NgTableComponent.prototype.cellClick = function (event ,row, column) {
        this.cellClicked.emit({event:event, row: row, column: column });
    };
    NgTableComponent.prototype.borrarTodo = function (event) {
        this.btnClicked.emit(event);
    };
    NgTableComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ng-tabla',
                    styles:[`td.celda{
                        border: 0;
                        border-bottom:1px solid #ddd;
                    }`,`th.celda-header{
                        border: 0;
                    }`,`table{border-color: white;}`,`td.footer{
                        border: 0;
                    }`,`tfoot tr{background-color: #CFCFCF;
                        color: white;
                        font-size: 22px;
                        font-weight: 900;}`],
                    template:`
                    <div class="table-responsive">
                        <table class="table table-inverse" ngClass="{{config.className || ''}}"
                               role="grid" style="width: 100%;">
                          <thead>
                            <tr class="fila-header" role="row">
                              <th class="celda-header" [ngStyle]="column.style" *ngFor="let column of columns" [ngTableSorting]="config" [column]="column" 
                                  (sortChanged)="onChangeTable($event)" ngClass="{{column.className || ''}}">
                                {{column.title}}
                                <i *ngIf="config && column.sort" class="pull-right fa"
                                  [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                          <tr  *ngIf="showFilterRow">
                            <td  *ngFor="let column of columns">
                              <input *ngIf="column.filtering" placeholder="{{column.filtering.placeholder}}"
                                     [ngTableFiltering]="column.filtering"
                                     class="form-control"
                                     style="width: auto;"
                                     (tableChanged)="onChangeTable(config)"/>
                            </td>
                          </tr>
                            <tr class="fila" *ngFor="let row of rows">
                              <td class="celda" [ngStyle]="column.style" (click)="cellClick($event, row, column.name)" *ngFor="let column of columns" [innerHtml]="sanitize(getData(row, column.name,column.tipo))"></td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td class="footer" [ngStyle]="column.styleFooter" *ngFor="let column of columns">{{column.nameFooter || ""}}</td>
                            </tr>
                          </tfoot>
                        </table>
                    </div>
                  `
                },] },
    ];
    /** @nocollapse */
    NgTableComponent.ctorParameters = [
        { type: platform_browser_1.DomSanitizer, },
    ];
    NgTableComponent.propDecorators = {
        'rows': [{ type: core_1.Input },],
        'config': [{ type: core_1.Input },],
        'tableChanged': [{ type: core_1.Output },],
        'cellClicked': [{ type: core_1.Output },],
        'btnClicked': [{ type: core_1.Output },],
        'columns': [{ type: core_1.Input },],
    };
    return NgTableComponent;
}());
exports.NgTableComponent = NgTableComponent;
