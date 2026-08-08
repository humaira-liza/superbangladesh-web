import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptors,
  withFetch
} from '@angular/common/http';

import { routes } from './app.routes';

import { authInterceptor }
from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    // ⚠️ HYDRATION FIX: this was missing entirely. Without it, the
    // client bootstrap DESTROYS the server-rendered DOM and rebuilds
    // it from scratch on every full page load/reload — that's why
    // images (logo, banner) flashed "broken" right after reload: the
    // <img> element was torn down and recreated, forcing a fresh
    // fetch, then briefly showed the browser's broken-image icon
    // before it finished loading again. Client-side nav (e.g.
    // clicking the logo) never hit this path, which is why it always
    // looked fine.
    provideClientHydration(
      withEventReplay()
    ),

    provideHttpClient(

      withFetch(),

      withInterceptors([
        authInterceptor
      ])

    )

  ]

};