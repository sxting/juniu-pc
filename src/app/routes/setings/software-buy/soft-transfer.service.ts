import {Injectable} from '@angular/core';

@Injectable()
export class SoftTransferService {


  step: 0 | 1 | 2 | 3 = 0;
  package: any;
  storeArr: any = [];
  totalPrice: any = 0;

  orderNo: any ='';

  storeId: any = '';

    again() {
        this.step = 0;
    }

    constructor() {
        this.again();
    }
}
