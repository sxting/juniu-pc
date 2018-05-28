export interface OrderQueryReq {
  pageIndex: number;
  pageSize: number;
  phone: string;
}

export interface OrderQueryRes {
  pageInfo: {
    pageIndex: number;
    pageSize: number;
    countTotal: number;
    countPage: number;
  };
  orders: Order[];
}

export interface Order {
  statusName?: string;
  cardType?: string;
  payTypeName?: string;
  bizTypeName?: string;
  orderId: string;
  merchantId: string;
  storeId: string;
  customerName: string;
  phone: string;
  gender: number;
  birthday: string;
  bizType: string;
  payType: string;
  cardId: string;
  originMoney: number;
  preferentialMonery: number;
  money: number;
  memo: string;
  operationUserId: string;
  operationUserName: string;
  status: string;
  juniuoModel: {
    dateCreated: number;
    isDeleted: number;
    lastUpdated: number;
    version: number;
  };
}

export interface CreateOrder {
  customerName: string;
  gender: number;
  recordType: string;
  authCode: string; //条形码
  phone: string;
  birthday: string;
  cardId: string;
  cardType: string;
  originMoney: number;   //原价 (分)
  preferentialMonery: number; //优惠价格 (分)
  money: number; //实收价格 (分)
  bizType: string;
  payType: string;
  memo: string;
  orderItem: OrderItem[];
  cardNum?: string;
  storeId?: string;
  couponId?: string;
  wipeDecimal?: boolean;
  faceId?: string;
  customerId?: string;
  settleCardDTOList?: any;
}

export interface OpenCardOrder {
  customerName: string;
  gender: number;
  authCode: string; //条形码
  recordType: string;
  phone: string;
  birthday: string;
  cardId: string;
  cardType: string;
  originMoney: number;   //原价 (分)
  preferentialMonery: number; //优惠价格 (分)
  money: number; //实收价格 (分)
  bizType: string;
  payType: string;
  memo: string;
  orderItem: OpenCard[];
  cardNum?: string;
}
export interface OpenCard {
  typeName: string;
  cardConfigId: string;
  cardConfigName: string;
  cardConfigType: string;
  ruleId: string;
  balance: number;
  price: number;
  validate: number;
}
export interface OrderItem {
  productId: string;
  typeName: string; //商品订单固定值
  originalPrice: number;
  price: number;
  productName: string;
  rebate: number;  //折扣
}
