import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = localStorage.getItem('user');
    if (user) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${user}`
        }
      });
    }

    this.requests.push(req);

    this.loaderService.isLoading.next(true);
    return  new Observable((observer: Observer<any>) => {
     // observer.next();
      const subscription = next.handle(req)
      .subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        err => {
          alert('error' + err);
          this.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        });
        return () => {
          this.removeRequest(req);
          subscription.unsubscribe();
        };
     
    });
    // return Observable.create(observer => {
    //   const subscription = next.handle(req)
    //     .subscribe(
    //       event => {
    //         if (event instanceof HttpResponse) {
    //           this.removeRequest(req);
    //           observer.next(event);
    //         }
    //       },
    //       err => {
    //         alert('error' + err);
    //         this.removeRequest(req);
    //         observer.error(err);
    //       },
    //       () => {
    //         this.removeRequest(req);
    //         observer.complete();
    //       });
    //   // remove request from queue when cancelled
    //   return () => {
    //     this.removeRequest(req);
    //     subscription.unsubscribe();
    //   };
    // });
  }
}
