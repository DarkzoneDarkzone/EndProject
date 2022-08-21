import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 
@Injectable()
export class DataService {
    private inCart = new Subject<any>();
 
    sendData(count: number) {
        this.inCart.next(count);
    }
 
    clearData() {
        this.inCart.next();
    }
 
    getData(): Observable<any> {
        return this.inCart.asObservable();
    }
}