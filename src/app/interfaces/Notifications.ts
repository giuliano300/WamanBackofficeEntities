
export interface Notifications {
    id: number;
    message: string;
    locationId?: number | null;
    entityId?: number | null;
    seen: boolean;
    createdAt: string;  
  }