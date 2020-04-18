Introduction
============
stc-emitter (Server to client emitter) sends the events to the client.
The client can listen the events using EventSource API. It is
excellent when the client has to listen the events but has no need
to emit the events.

Installation
============
```bash
$ npm install stc-emitter
```

Usage
=====
Server can send the events like this:

```js
const express = require('express');
const { ListenerClient, Audience } = require('stc-emitter');

const app = express();
const scoreAud = new Audience();
foo.on( 'bar', baz => scoreAud.deliver('scoreUpdate', baz) );

app.get('/score-emitter', (req, res) => {
    scoreAud.add(res);
});
```

If sending events to each client separately is desired:

```js
const express = require('express');
const { ListenerClient, Audience } = require('stc-emitter');

const app = express();

app.get('/score-emitter', (req, res) => {
    const client = new ListenerClient(res);

    foo.on('bar', sendEvent);
    function sendEvent(baz) {
        client.emit('scoreUpdate', baz);
    }

    // Note: Audience takes care of ending the respone automatically,
    // if you are using ListenerClient, you have to take care of it.
    res.on('close', () => {
        foo.off('bar', sendEvent);
        res.end();
    });
});
```

Client can listen events like this:

```js
const source = new EventSource('/score-emitter');
source.addEventListener('scoreUpdate', e => {
    console.log(e.data);
});
```

For complete client-side guide [visit MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

API
===
See [API documentation](https://github.com/zohaibmajeed/stc-emitter/blob/master/API.md).