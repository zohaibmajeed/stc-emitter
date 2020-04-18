# Documentation

## `class ListenerClient`

Class representing the Emitter which emits the events to the client (It does not inharit the node's EventEmitter class).

## `constructor(response)`

Creates the instance of ListenerClient.

 * **Parameters:** `{http.ServerResponse}` — response - The response object

## `emit(...args)`

Emit the event to the client.

 * **Parameters:**
   * `{string}` — [event]          - The event being fired
   * `{string}` — data             - Data of the event
   * `{Object}` — [options]        - Other options such as id, retry
   * `{string}` — options.id       - The id of the event. If the connection somehow ends, the browser will try to reconnect and the id you passed to the client last time will be included in the reconnect request as 'Last-Event-ID' http header. Client agent exposes it as he 'lastEventId' property of the event.
   * `{number}` — options.retry    - This is often passed when the server is going to disconnect the client. This specifies that after how many milliseconds the browser should reconnect. For example, if server passes retry with value 5000 and disconnects. The client will try to reconnect after 5000 milliseconds.

## `class Audience`

Class representing the Clients listning the same events.

## `add(listner)`

Adds the client to the Audience.

 * **Parameters:** `{(ListenerClient|http.ServerResponse)}` — listner

## `deliver(...args)`

Emits the events to all the clients in the Audience. Accepts the same arguments as the ListenerClient.emit.