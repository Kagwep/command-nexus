import { Event } from '../utils/events';
import { gql } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { BehaviorSubject, Observable } from 'rxjs';

export async function createEventSubscription(keys: string[]): Promise<Observable<Event | null>> {
  const wsClient = createClient({ url: import.meta.env.VITE_PUBLIC_TORII_WS });

  const lastUpdate$ = new BehaviorSubject<Event | null>(null);

  const formattedKeys = keys.map((key) => `"${key}"`).join(',');

  wsClient.subscribe(
    {
      query: gql`
        subscription {
          eventEmitted(keys: [${formattedKeys}]) {
            id
            keys
            data
            createdAt
            transactionHash
          }
        }
      `,
    },
    {
      next: ({ data }) => {
        try {
          const event = data?.eventEmitted as Event;
          if (event) {
            lastUpdate$.next(event);
          }
        } catch (error) {
          console.log({ error });
        }
      },

      error: (error) => console.log({ error }),
      complete: () => console.log('complete'),
    }
  );
  return lastUpdate$;
}
