export interface WorkerBonus {
  id: number;
  workerId: number;
  locationId: number;
  entityId: number;
  year: number;
  quarter: number;
  reviewerName: string;
  reviewerRole: string;
  date: Date;
  finalEvaluation: number;
  sensitivityTowardsEntityEnvironment: number;
  timeManagement: number;
  respectingAdministrativeProcedures: number;
  appropriateGoodUseEquipmentAndOrMachineryITEquipment: number;
  teamPlayer: number;
  energyDeterminationWorkRate: number;
  respectTowardsAuthorityAndIntegrity: number;
  adaptabilityFlexibilityAndMobility: number;
  personalAppearanceAndImage: number;
  communicationsSkills: number;
  deleted: boolean;
}
