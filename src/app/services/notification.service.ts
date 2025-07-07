import { Injectable } from '@angular/core';
import { API_URL_DOC } from '../../main';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: any;

  constructor(private toastr: ToastrService, private router: Router) {}

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
          tapToDismiss: true,       // permette anche click per chiuderlo
          progressBar: true         // facoltativo: barra di avanzamento        
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
        entityId = locObj.location.entityId;
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
}
