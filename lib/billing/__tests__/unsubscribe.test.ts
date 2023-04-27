import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {LATEST_API_VERSION} from '../../types';
import {shopifyApi, Shopify, BillingInterval} from '../..';

import * as Responses from './responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

describe('shopify.billing.unsubscribe', () => {
  const session = new Session({
    id: '1234',
    shop: DOMAIN,
    state: '1234',
    isOnline: true,
    accessToken: ACCESS_TOKEN,
    scope: 'read_returns',
  });

  let shopify: Shopify;
  beforeEach(() => {
    shopify = shopifyApi({
      ...testConfig,
      billing: {
        basic: {
          amount: 5.0,
          currencyCode: 'USD',
          interval: BillingInterval.OneTime,
        },
      },
    });
  });

  test('After a user unsubscribes the check function should return', async () => {
    queueMockResponses([Responses.UNSUBSCRIBE_RESPONSE]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;
    const response = await shopify.billing.unsubscribe({
      session,
      subscriptionId,
    });

    expect(response).toEqual(JSON.parse(Responses.UNSUBSCRIBE_RESPONSE));
    expect({
      ...GRAPHQL_BASE_REQUEST,
      data: {
        query: expect.stringContaining('appSubscriptionCancel'),
        variables: expect.objectContaining({
          id: subscriptionId,
          prorate: false,
        }),
      },
    });
  });
});
