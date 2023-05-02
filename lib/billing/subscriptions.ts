import {BillingError} from '../error';
import {ConfigInterface} from '../base-types';
import {graphqlClientClass} from '../clients/graphql/graphql_client';
import {Session} from '../session/session';

import {AppSubscription, SubscriptionResponse} from './types';

const SUBSCRIPTION_QUERY = `
  query appSubscription() {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        test
      }
  }
`;

export function subscriptions(config: ConfigInterface) {
  return async function (session: Session): Promise<AppSubscription> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to look for purchases without billing configs',
        errorData: [],
      });
    }

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    const response = await client.query<SubscriptionResponse>({
      data: {
        query: SUBSCRIPTION_QUERY,
      },
    });

    return response.body.data.appSubscription;
  };
}
