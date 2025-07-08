import { Injectable } from '@angular/core';
import { API_URL, API_URL_DOC } from '../../main';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications } from '../interfaces/Notifications';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: any;

  constructor(private toastr: ToastrService, private http: HttpClient) {}

  startConnection(): void {
    this.hubConnection = $.hubConnection(API_URL_DOC, {
      transport: ['serverSentEvents', 'longPolling']
    });
    const proxy = this.hubConnection.createHubProxy('notificationHub');

// 🎯 Ricezione notifica con link interattivo
    proxy.on('receiveNotification', (message: string) => {
      const toastRef = this.toastr.info(
        message, 
        "",
        {
          enableHtml: true,
          positionClass: 'toast-top-right',
          timeOut: 10000,   
          closeButton: true,
          tapToDismiss: true, 
          progressBar: true 
        }
    )
   });

    // ▶️ Connessione e registrazione
    this.hubConnection.start().then(() => {
      console.log('✅ Connection established');

      const isLocation = localStorage.getItem('isLocation') === 'true';
      const isEntity = localStorage.getItem('isEntity') === 'true';

      let locationId = 0;
      let entityId = 0;

      if (isLocation) 
      {
        const locObj = JSON.parse(localStorage.getItem('completeLocation')!);
        locationId = locObj.location.id;
      } 
      else if (isEntity) 
      {
        const entityObj = JSON.parse(localStorage.getItem('entity')!);
        entityId = entityObj.id;
      }

      // 📤 Invoca il metodo Register(locationId, entityId)
      proxy.invoke('RegisterByLocationEntity', locationId, entityId)
        .done(() => console.log('📎 Registered locationId:', locationId, 'entityId:', entityId))
        .fail((err: any) => console.error('❌ Error while registering:', err));
    }).catch((error: any) => {
      console.error('❌ Connection error SignalR:', error);
    });
  }

  getUnreadNotifications(locationId: number, entityId: number): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${API_URL}notifications/unread?locationId=${locationId}&entityId=${entityId}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${API_URL}notifications/mark-as-read/${id}`, null);
  }
}
