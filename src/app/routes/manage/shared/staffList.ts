export class Register {
  constructor(public staffName: string,
    public phone: string,
    public staffNick: string, ) { }
}
export class shophasPrinter {
  constructor(
    public deviceName: string,

    public yunType: string,

    public yunUsername: string,

    public yunUserId: string,

    public yunApiKey: string,

    public yunDeviceId: string,

    public yunDeviceKey: string,

    public yunDeviceSimNo: string,
    public storeId: string) { }
}
export class WxminiApps {
  constructor(
    public storeId: any,
    public showCard: any,
    public showProduct: any,
    public showStaff: any,
    public merchantId?: any,
    public picIds?: any,
    public productIds?: any,
    public ruleIds?: any,
    public staffIds?: any
  ) { }
}
