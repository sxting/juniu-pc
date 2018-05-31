import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {

  setLocalstorage(key: any, value: any) {
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key, value);
  }

  getLocalstorage(key: any) {
    return sessionStorage.getItem(key);
  }

  setSessionStorage(key: any, value: any) {
    sessionStorage.removeItem(key);
    sessionStorage.setItem(key, value);
  }

  getSessionStorage(key: any) {
    return sessionStorage.getItem(key);
  }

  clearSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

}
