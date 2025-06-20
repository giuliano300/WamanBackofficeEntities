import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isEntitySubject = new BehaviorSubject<boolean>(this.getBooleanFromStorage('isEntity'));
  private isLocationSubject = new BehaviorSubject<boolean>(this.getBooleanFromStorage('isLocation'));
  private loginNameSubject = new BehaviorSubject<string>("");

  // Osservabili pubblici
  isEntity$ = this.isEntitySubject.asObservable();
  isLocation$ = this.isLocationSubject.asObservable();
  loginName$ = this.loginNameSubject.asObservable();

  // Imposta valori
  setIsEntity(value: boolean) {
    localStorage.setItem('isEntity', JSON.stringify(value));
    this.isEntitySubject.next(value);
  }

  setLoginName(value: string) {
    localStorage.setItem('loginName', JSON.stringify(value));
    this.loginNameSubject.next(value);
  }

  setIsLocation(value: boolean) {
    localStorage.setItem('isLocation', JSON.stringify(value));
    this.isLocationSubject.next(value);
  }

  // Pulisce i ruoli
  clearRoles() {
    localStorage.removeItem('isEntity');
    localStorage.removeItem('isLocation');
    localStorage.removeItem('loginName');
    this.isEntitySubject.next(false);
    this.isLocationSubject.next(false);
    this.loginNameSubject.next("");
  }

  // Legge da localStorage
  private getBooleanFromStorage(key: string): boolean {
    return localStorage.getItem(key) === 'true';
  }
}
