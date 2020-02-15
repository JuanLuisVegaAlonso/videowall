import { TestBed } from '@angular/core/testing';

import { JlvVideowallService } from './jlv-videowall.service';

describe('JlvVideowallService', () => {
  let service: JlvVideowallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JlvVideowallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
