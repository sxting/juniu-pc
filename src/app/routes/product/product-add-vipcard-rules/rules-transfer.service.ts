import { Injectable } from '@angular/core';

@Injectable()
export class RulesTransferService {

    step: 0 | 1 | 2 | 3 = 0;

    configId: string;
    moduleId: string;

    again() {
        this.step = 0;
    }

    constructor() {
        this.again();
    }
}
