import { TestBed } from '@angular/core/testing';

import { GlobalfunctionService } from './globalfunction.service';

describe('GlobalfunctionService', () => {
  let service: GlobalfunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalfunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
