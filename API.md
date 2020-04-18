# Documentation

## `class ListenerClient`

Class representing the Emitter which emits the events to the client (It does not inharit the node's EventEmitter class).

## `constructor(response)`

Create the instance of ListenerClient.

 * **Parameters:** `response` — `http.ServerResponse` — The response object

## `emit(...args)`

Emit the event to the client.

 * **Parameters:**
   * `[event]` — `string` — The event being fired
   * `data` — `string` — Data of the event
   * `[options]` — `Object` — Other options such as id, retry
   * `options.id` — `string` — 
   * `options.retry` — `number` — 

## `class Audience`

Class representing the Clients listning the same events.

## `add(listner)`

Add the client to the Audience.

 * **Parameters:** `listner` — `(ListenerClient|http.ServerResponse)` — 

## `deliver(...args)`

Emits the events to all the clients in the Audience.

 * **Parameters:**
   * `[event]` — `string` — The event being fired
   * `data` — `string` — Data of the event
   * `[options]` — `object` — Other options such as id, retry