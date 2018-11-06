import { TestBed, inject } from '@angular/core/testing';

import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionService]
    });
  });

  it('should be created', inject([SelectionService], (service: SelectionService) => {
    expect(service).toBeTruthy();
  }));
  it('should emit RequestSelect on selectItem', inject([SelectionService], (service: SelectionService) => {
    let paths = [];
    service.RequestSelect.subscribe(_ => {
      paths = _.path;
    })
    service.selectItem('hi/123');


    expect(paths.length).toBe(2);
  }));
});
