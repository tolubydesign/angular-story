import { TestBed } from '@angular/core/testing';

import { UserCommentsService } from './user-comments.service';

describe('UserCommentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserCommentsService = TestBed.get(UserCommentsService);
    expect(service).toBeTruthy();
  });
});
