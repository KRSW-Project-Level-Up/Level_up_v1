import { TestBed } from '@angular/core/testing';

import { Neo4jServiceService } from './neo4j.service.service';

describe('Neo4jServiceService', () => {
  let service: Neo4jServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Neo4jServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
