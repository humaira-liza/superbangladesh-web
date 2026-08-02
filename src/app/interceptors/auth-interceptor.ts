import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // ✅ শুধু আমাদের নিজের API তে token পাঠানো হবে।
  // বাইরের সার্ভিস (যেমন auto-translate) এ Authorization
  // header পাঠালে CORS ভেঙে যেতে পারে, তাই সেগুলো বাদ।
  const isOwnApi = req.url.includes(
    'superbangladesh-api-1.onrender.com'
  );

  if (!isOwnApi) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {

    req = req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`

      }

    });

  }

  return next(req);

};