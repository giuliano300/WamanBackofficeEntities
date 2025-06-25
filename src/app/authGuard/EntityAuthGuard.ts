import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EntityAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isEntity = localStorage.getItem('isEntity') === 'true';
    if (isEntity) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
