import {Injectable} from '@angular/core';

@Injectable()
export class TransferService {


    step: 0 | 1 | 2 | 3 | 4  = 0;

    //1
    type: string;

    //审核状态
    status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请

    itemData: any;

    step2ProvinceId: string = '';
    step2CityId: string = '';
    step2DistrictId: string = '';

    step2ProvinceName: string = '';
    step2CityName: string = '';
    step2DistrictName: string = '';

    step3ProvinceId: string = '';
    step3CityId: string = '';
    step3DistrictId: string = '';

    step3ProvinceName: string = '';
    step3CityName: string = '';
    step3DistrictName: string = '';

    again() {
        this.type = 'qiye';
    }

    constructor() {
        this.again();
    }
}
