import { TestBed } from "@angular/core/testing";
import { StoryService } from "./story.service";

describe("StoryService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: StoryService = TestBed.inject(StoryService);
    expect(service).toBeTruthy();
  });
});
