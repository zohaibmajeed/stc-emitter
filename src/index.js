const http = require('http');

const doesNotIncludeOtherThan = (arr, ...entries) => {
    for (const elm of arr) {
        if ( !entries.includes(elm) ) return false;
    }
    return true;
}

/**
 * Class representing the Emitter which emits the events to the
 * client (It does not inharit the node's EventEmitter class).
 */

class ListenerClient {

    /**
     * Creates the instance of ListenerClient.
     * @param {http.ServerResponse} response - The response object
     */

    constructor(response) {
        this.response = response;
        this.response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        });
    }

    /**
     * Emit the event to the client.
     * @param   {string} [event]          - The event being fired
     * @param   {string} data             - Data of the event
     * @param   {Object} [options]        - Other options such as id, retry
     * @param   {string} options.id       - The id of the event. If the connection somehow ends, the browser will try to reconnect and the id you passed to the client last time will be included in the reconnect request as 'Last-Event-ID' http header. Client agent exposes it as he 'lastEventId' property of the event.
     * @param   {number} options.retry    - This is often passed when the server is going to disconnect the client. This specifies that after how many milliseconds the browser should reconnect. For example, if server passes retry with value 5000 and disconnects. The client will try to reconnect after 5000 milliseconds.
     */

    emit(...args) {
        if (this.response.writableFinished) {
            return;
        }

        let event, data, options = {};

        switch (args.length) {
            case 3:
                [ event, data, options ] = args;
            break;

            case 2:
                const keys = Object.keys(args[1]);
                if (
                    typeof args[1] === 'object' &&
                    ( 'retry' in args[1] || 'id' in args[1] ) &&
                    ( keys.length <= 2 ) &&
                    ( doesNotIncludeOtherThan(keys, 'id', 'retry') )
                ) {
                    [ data, options ] = args;
                } else {
                    [ event, data ] = args;
                }
            break;

            case 1:
                data = args[0];
            break;
        
            default:
                throw new TypeError(`You called emit functon with ${args.lenth === 0 ? 'no' : args.lenth} arguments wherease minimum one and maximum three arguments are expected.`)
            break;
        }

        // Validating Data
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        } else if (typeof data === 'number') {
            data = String(data);
        } else if (typeof data === 'string') {
            data = data.split('\n').join('\ndata: ');
        } else {
            throw new TypeError(`First argument 'data' is expected to be string or object.`);
        }

        // Validating options
        if ('retry' in options) {
            if ('retry' instanceof Date) options.retry = Date.parse(retry) - Date.now();
            else parseInt(options.retry);
        }

        // Sending Fully validated response
        if (event) this.response.write(`event: ${event}\n`);
        this.response.write(`data: ${data}\n`);
        if ('id' in options) this.response.write(`id: ${options.id}\n`);
        if ('retry' in options) this.response.write(`retry: ${options.retry}\n`);
        this.response.write('\n');
    }

}

/**
 * Class representing the Clients listning the same events.
 */

class Audience {

    constructor() {
        this.lastId = 0;
        this.listners = [];
    }

    /**
     * Adds the client to the Audience.
     * @param {(ListenerClient|http.ServerResponse)} listner
     */

    add(listner) {
        let emitter, emitterId = ++this.lastId;

        if (listner instanceof ListenerClient) {
            emitter = listner;
        } else if (listner instanceof http.ServerResponse) {
            emitter = new ListenerClient(listner);
        }
        emitter.response.emitterId = emitterId;

        emitter.response.once('close', () => {
            this.listners = this.listners.filter(elm => elm.response.emitterId !== emitterId);
            emitter.response.end();
        });

        this.listners.push(emitter);
    }

    /**
     * Emits the events to all the clients in the Audience.
     * Accepts the same arguments as the ListenerClient.emit.
     */

    deliver(...args) {
        for (const listner of this.listners) {
            setImmediate(() => {
                listner.emit(...args);
            });
        }
    }

}

module.exports = { ListenerClient, Audience };