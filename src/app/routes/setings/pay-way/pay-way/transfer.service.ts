import {Injectable} from '@angular/core';

@Injectable()
export class TransferService {


    step: 0 | 1 | 2 | 3 | 4  = 0;

    //1
    type: string;

    //审核状态
    status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请

    itemData: any;

    imagePath1: string;
    image_id1: string;
    imagePath2: string;
    image_id2: string;
    imagePath3: string;
    image_id3: string;
    imagePath4: string = '/assets/img/yhk_zm.jpg';
    image_id4: string;
    imagePath5: string = '/assets/img/yhk_back.jpg';
    image_id5: string;
    imagePath6: string = '/assets/img/sfz_zm.jpg';
    image_id6: string;
    imagePath7: string = '/assets/img/sfz_back.jpg';
    image_id7: string;
    imagePath8: string = '/assets/img/qyxyxxjt.png';
    image_id8: string;

    again() {
        this.type = 'qiye';
    }

    constructor() {
        this.again();
    }
}
