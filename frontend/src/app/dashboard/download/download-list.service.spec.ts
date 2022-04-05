import { TestBed, inject } from '@angular/core/testing';

import { DownloadListService } from './download-list.service';

describe('DownloadListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DownloadListService]
    });
  });

  it('should be created', inject([DownloadListService], (service: DownloadListService) => {
    expect(service).toBeTruthy();
  }));
});
