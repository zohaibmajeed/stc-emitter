# Documentation

## `class ListenerClient`

Class representing the Emitter which emits the events to the client (It does not inharit the node's EventEmitter class).

## `constructor(response)`

Creates the instance of ListenerClient.

 * **Parameters:** `response` — `http.ServerResponse` — The response object

## `emit(...args)`

Emit the event to the client. Pass arguments like this: emit(event, data) or emit(data, options) or emit(event, data, options) or emit(data).

 * **Parameters:**
   * `[event]` — `string` — The event being fired. If this is skipped, data will be sent without an event name, client has to listen the 'message' event to recieve the data.
   * `data` — `(string|object)` — Data of the event. If object is passed, it will be converted to string using JSON.stringify() and the client has to parse it using JSON.parse().
   * `[options]` — `Object` — Other options such as id, retry
   * `options.id` — `string` — The id of the event. If the connection somehow ends, the browser will try to reconnect and the id you passed to the client last time will be included in the reconnect request as 'Last-Event-ID' http header. Client agent exposes it as the 'lastEventId' property of the event.
   * `options.retry` — `number` — This is often passed when the server is going to disconnect the client. This specifies that after how many milliseconds the browser should reconnect. For example, if server passes retry with value 5000 and disconnects. The client will try to reconnect after 5000 milliseconds.

## `class Audience`

Class representing the Clients listning the same events.

## `add(listner)`

Adds the client to the Audience.

 * **Parameters:** `listner` — `(ListenerClient|http.ServerResponse)` — 

## `deliver(...args)`

Emits the events to all the clients in the Audience. Accepts the same arguments as the ListenerClient.emit.
