import {Session} from '../session/session';
import {
  BillingInterval,
  BillingReplacementBehavior,
  RecurringBillingIntervals,
} from '../types';

export interface BillingConfigPlan {
  amount: number;
  currencyCode: string;
}

export interface BillingConfigOneTimePlan extends BillingConfigPlan {
  interval: BillingInterval.OneTime;
}

export interface BillingConfigSubscriptionPlan extends BillingConfigPlan {
  interval: RecurringBillingIntervals;
  trialDays?: number;
  replacementBehavior?: BillingReplacementBehavior;
}

export interface BillingConfigUsagePlan extends BillingConfigPlan {
  interval: BillingInterval.Usage;
  usageTerms: string;
  trialDays?: number;
  replacementBehavior?: BillingReplacementBehavior;
}

export interface BillingConfig {
  [plan: string]:
    | BillingConfigOneTimePlan
    | BillingConfigSubscriptionPlan
    | BillingConfigUsagePlan;
}

export interface CheckParams {
  session: Session;
  plans: string[] | string;
  isTest?: boolean;
}

export interface RequestParams {
  session: Session;
  plan: string;
  isTest?: boolean;
}

export interface CancelParams {
  session: Session;
  subscriptionId: number;
  prorate?: boolean;
  isTest?: boolean;
}

export interface ActiveSubscription {
  id: string;
  name: string;
  test: boolean;
}

export interface ActiveSubscriptions {
  activeSubscriptions: ActiveSubscription[];
}

interface OneTimePurchase {
  name: string;
  test: boolean;
  status: string;
}

interface OneTimePurchases {
  oneTimePurchases: {
    edges: {
      node: OneTimePurchase;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

export type CurrentAppInstallation = OneTimePurchases & ActiveSubscriptions;

export interface CurrentAppInstallations {
  userErrors: string[];
  data: {
    currentAppInstallation: CurrentAppInstallation;
  };
}

export interface RequestResponse {
  userErrors: string[];
  confirmationUrl: string;
}

export interface RecurringPaymentResponse {
  data: {
    appSubscriptionCreate: RequestResponse;
  };
  errors?: string[];
}

export interface SinglePaymentResponse {
  data: {
    appPurchaseOneTimeCreate: RequestResponse;
  };
  errors?: string[];
}

export interface AppSubscription {
  createdAt: string;
  currentPeriodEnd: string;
  id: string;
  lineItems?: [any];
  name: string;
  returnUrl: string;
  status: string;
  test: boolean;
  trialDays: number;
}

export interface SubscriptionResponse {
  data: {
    appSubscription: AppSubscription;
  };
}

export interface CancelResponse {
  data: {
    appSubscription: AppSubscription;
  };
  errors?: string[];
}
