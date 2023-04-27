import {ConfigInterface} from '../base-types';

import {check} from './check';
import {request} from './request';
import {cancel} from './cancel';

/**
 * TODO:
 * I need to add the ability to cancel or downgrade a user from a paid plan
 *  using the appSubscriptionCancel mutation in the graphql api
 *  https://shopify.dev/docs/api/admin-graphql/2023-01/mutations/appSubscriptionCancel
 *
 * it will be a curried function like request and check
 *
 * I will need:
 * config: ConfigInterface
 *
 * Mutation: appSubscriptionCancel
 * Input: id: ID! for the app subscription id
 * Input: returnUrl: String! for the url to redirect the user to after the cancellation
 *
 *  */
export function shopifyBilling(config: ConfigInterface) {
  return {
    check: check(config),
    request: request(config),
    cancel: cancel(config),
  };
}

export type ShopifyBilling = ReturnType<typeof shopifyBilling>;
