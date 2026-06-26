import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL_DOC } from '../main';

export const wamanClientInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL_DOC)) {
    return next(req);
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
