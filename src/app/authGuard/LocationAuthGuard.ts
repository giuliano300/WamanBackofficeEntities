import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class LocationAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLocation = localStorage.getItem('isLocation') === 'true';
    if (isLocation) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
