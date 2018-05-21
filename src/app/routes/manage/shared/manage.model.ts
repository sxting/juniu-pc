export interface stafflistQueryReq {
  pageIndex: number;
  pageSize: number;
  storeId: string;
  staffName: string;
  staffId: string;
}
export interface shoplistQueryReq {
  pageIndex: number;
  pageSize: number;
  cityId: string;
  releaseChannel: string;
  storeName: string;
}
export interface staffsave {
  belongType: string,
  headPortrait: string,
  phone: string,
  roleId: string,
  staffId: string,
  staffName: string,
  storeId: string,
  nickName: string,
  storeRole: string,
  faceId?: string,
  faceImg?: string,
  staffType : string
}
export interface rolesave {
  belongType: string,
  moduleIds: any,
  roleId: string,
  roleName: string
}
export interface ImageArray {
  id: number;
  imageId: string;
  name: string;
  src: string;
  showDelete: boolean;
}
