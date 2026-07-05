export interface IBodyComposition {
  id?: number;
  patientDetailsId: number;
  recordedAt: Date;
  weight: number;
  height: number;
  bmi: number;
  muscleMass: number;
  bodyFatMass: number;
  bodyFatPercentage: number;
  totalBodyWater: number;
  intracellularWater: number;
  extracellularWater: number;
  ecwTbwRatio: number;
  proteinMass: number;
  minerals: number;
  visceralFat: number;
  phaseAngle: number;
  basalMetabolicRate: number;
  boneMass?: number;
  metabolicAge?: number;
  waistHipRatio?: number;
  bodyWaterPercentage?: number;
  bmr: number;

  segmentalLean?: ISegmentalLean;
  segmentalLeanRightArm?: number;
  segmentalLeanLeftArm?: number;
  segmentalLeanTrunk?: number;
  segmentalLeanRightLeg?: number;
  segmentalLeanLeftLeg?: number;

  source?: string;
  inbodyResultId?: string;
  bwImported: boolean;

  notes?: string;
  createdAt?: Date;
}

export interface ISegmentalLean {
  rightArm: number;
  leftArm: number;
  trunk: number;
  rightLeg: number;
  leftLeg: number;
}

export interface IBodyCompositionHistory {
  entries: IBodyComposition[];
  trends: {
    weight: ITrendData;
    skeletalMuscleMass: ITrendData;
    bodyFatPercentage: ITrendData;
    visceralFatLevel: ITrendData;
  };
}

export interface ITrendData {
  start: number;
  current: number;
  change: number;
  changePercentage: number;
}
