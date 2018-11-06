import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  RequestSelect: EventEmitter<{path: string[]}> = new EventEmitter<{path: string[]}>();
  CollapseAll: EventEmitter<{}> = new EventEmitter();
  constructor() { }
  selectItem(path: string) {
    let paths = path.split('/');
    this.RequestSelect.emit({path: paths});
  }
}
