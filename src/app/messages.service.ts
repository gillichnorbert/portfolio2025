import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private afs: AngularFirestore) {}

  sendMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<any> {
    // Firestore add() visszaad egy Promise-t, amit RxJS Observable-re alakítunk
    return from(this.afs.collection('messages').add(data)).pipe(
      catchError((error) => {
        console.error('Hiba az üzenet küldése közben:', error);
        return throwError(() => new Error('Üzenet küldése sikertelen.'));
      })
    );
  }
}
