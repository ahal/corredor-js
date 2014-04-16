Transport
=========

This module contains a collection of socket patterns that roughly map to
`ZeroMQ socket types`_. They wrap the ZeroMQ socket to ensure the proper message
format is always used.

.. _`ZeroMQ socket types`: http://api.zeromq.org/2-1:zmq-socket

ExclusivePair
-------------

The ExclusivePair pattern maps to zmq's `PAIR sockets`_. Exclusive pairs must only
connect or bind to one other PAIR socket. They may send and receive data bi-directionally
and in any order. That is, they may call send/recv multiple times in a row.

.. _`PAIR sockets`: http://api.zeromq.org/2-1:zmq-socket#toc14

.. js:class:: ExclusivePair()

.. js:function:: ExclusivePair.bind(address)

    :param string address: 
        Address to bind the socket to. An address consists of a protocol,
        location and port. E.g::
        
            inproc:///thread_name
            ipc:///tmp/process_name
            tcp://localhost:5554

.. js:function:: ExclusivePair.connect(address)

    :param string address:
        Address to connect the socket to. An address consists of a protocol,
        location and port. E.g::

            inproc:///thread_name
            ipc:///tmp/process_name
            tcp://localhost:5554

.. js:attribute:: ExclusivePair.address

    The address that the socket was bound or connected to. Will be undefined
    if accessed prior to being bound or connected.

.. js:function:: ExclusivePair.send(data)

    Send a json object over the socket.

    :param object data: A json object to send over the socket. Must contain an
                        `action` key to identify the kind of data being sent.

.. js:function:: ExclusivePair.registerAction(action, callback)

    Registers a callback to an action. The callback will be invoked anytime
    `action` is received.

    :param string action: Name of action to register callback to.
    :param function callback: Function to be called when `action` received.

.. js:function:: ExclusivePair.close()

    Closes the socket.


Publisher
---------

The publisher pattern maps to zmq's `PUB sockets`_. Publishers can only send
data, they are not capable of receiving anything.

.. _`PUB sockets`: http://api.zeromq.org/2-1:zmq-socket#toc9

.. js:class:: Publisher()

.. js:function:: Publisher.bind(address)

    :param string address: 
        Address to bind the socket to. An address consists of a protocol,
        location and port. E.g::

            inproc:///thread_name
            ipc:///tmp/process_name
            tcp://localhost:5554

.. js:function:: Publisher.connect(address)

    :param string address:
        Address to connect the socket to. An address consists of a protocol,
        location and port. E.g::

            inproc:///thread_name
            ipc:///tmp/process_name
            tcp://localhost:5554

.. js:attribute:: Publisher.address

    The address that the socket was bound or connected to. Will be undefined
    if accessed prior to being bound or connected.

.. js:function:: Publisher.send(data)

    Send a json object over the socket.

    :param object data: A json object to send over the socket. Must contain an
                        `action` key to identify the kind of data being sent.

.. js:function:: Publisher.close()

    Closes the socket.


StreamPublisher
---------------

Same as publisher, except one extra method is available.

.. js:function:: StreamPublisher.bindStreamToAction(stream, action)

    Hooks into a stream (such as stdout) and forwards all output over the socket
    with the specified `action`.

    :param stream: The stream to bind, e.g process.stdout.
    :param string action: The action to bind the stream to.

    For example, the following example binds process.stdout to the `stdout` action.
    This means that any applications listening on the other end will receive this
    processes' stdout::

        var streamPub = new StreamPublisher();
        streamPub.connect(address);
        streamPub.bindToAction(process.stdout, 'stdout');
        console.log('hello over there!'); // this sends the following over the socket: { 'action': 'stdout', 'message': 'hello over there!' }

