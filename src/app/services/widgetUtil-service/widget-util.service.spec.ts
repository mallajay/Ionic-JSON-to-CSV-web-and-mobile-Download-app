import { TestBed } from "@angular/core/testing";

import { WidgetUtilService } from "./widget-util.service";

describe("WidgetUtilService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WidgetUtilService = TestBed.get(WidgetUtilService);
    expect(service).toBeTruthy();
  });
});
