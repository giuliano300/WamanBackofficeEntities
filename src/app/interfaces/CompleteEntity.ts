import { City } from "./City";
import { WamEntities } from "./Entities";
import { EntityType } from "./EntityType";

export interface CompleteEntity {
    entity: WamEntities;
    entityType: EntityType;
    city: City;
  }