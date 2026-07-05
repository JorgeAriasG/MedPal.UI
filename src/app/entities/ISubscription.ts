export interface ISubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  maxTeamMembers: number;
  maxClinics: number;
  maxActiveCalendars: number;
  isActive: boolean;
  trialDays: number;
  stripePriceId: string | null;
}

export interface ISubscription {
  id: number;
  accountId: number;
  subscriptionPlanId: number;
  plan: ISubscriptionPlan;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  maxTeamMembers: number;
  maxClinics: number;
  maxActiveCalendars: number;
  currentTeamMembers: number;
  currentClinics: number;
  isActive: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface ISubscriptionStatus {
  hasAccess: boolean;
  status: string;
  planName: string | null;
  trialEndsAt: string | null;
}

export interface ICheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface IPortalSessionResponse {
  url: string;
}
