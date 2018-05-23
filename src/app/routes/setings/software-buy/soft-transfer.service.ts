import {Injectable} from '@angular/core';

@Injectable()
export class SoftTransferService {


    step: 0 | 1 | 2  = 0;

    again() {
        this.step = 0;
    }

    constructor() {
        this.again();
    }
}