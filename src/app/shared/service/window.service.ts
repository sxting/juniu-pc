import { Injectable } from '@angular/core';

declare var win: any;
export { win as window };

@Injectable()
export class WindowService {
  //----------------------------------------------------------------------------------------------
  // Constructor Method Section:
  //----------------------------------------------------------------------------------------------
  constructor() {
    //
  }

  //----------------------------------------------------------------------------------------------
  // Public Properties Section:
  //----------------------------------------------------------------------------------------------
  get nativeWindow() : Window
  {
    return window;
  }
}
