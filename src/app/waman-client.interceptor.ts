import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL_DOC } from '../main';

export const wamanClientInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL_DOC)) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      'X-Waman-Client': 'waman-frontend'
    }
  }));
};
