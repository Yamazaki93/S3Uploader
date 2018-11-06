import { TestBed, inject } from '@angular/core/testing';

import { RequestUploadService } from './request-upload.service';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';

describe('RequestUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule],
      providers: [RequestUploadService]
    });
  });

  it('should be created', inject([RequestUploadService], (service: RequestUploadService) => {
    expect(service).toBeTruthy();
  }));
});
