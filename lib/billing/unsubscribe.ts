import {ConfigInterface} from '../base-types';
import {graphqlClientClass} from '../clients/graphql/graphql_client';
import {BillingError} from '../error';

import {UnsubscribeParams, UnsubscribeResponse} from './types';

const UNSUBSCRIBE_MUTATION = `
  mutation appSubscriptionCancel($id: ID!, $returnUrl: String!) {
    appSubscriptionCancel(id: $id) {
      appSubscription {
        id
        name
        test
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function unsubscribe(config: ConfigInterface) {
  return async function (
    subscriptionInfo: UnsubscribeParams,
  ): Promise<UnsubscribeResponse> {
    const {session, subscriptionId, prorate = true} = subscriptionInfo;

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    const response = await client.query<UnsubscribeResponse>({
      data: {
        query: UNSUBSCRIBE_MUTATION,
        variables: {
          id: subscriptionId,
          prorate,
        },
      },
    });

    if (response.body.errors?.length) {
      throw new BillingError({
        message: 'Error while canceling a subscription',
        errorData: response.body.errors,
      });
    }

    return response.body;
  };
}
