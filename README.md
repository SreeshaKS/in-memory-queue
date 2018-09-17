# in-memory-queue
In Memory Low Latency Queue

![https://github.com/SreeshaKS/in-memory-queue/blob/master/art/Internet%20of%20Things%20Architecture.png](https://github.com/SreeshaKS/in-memory-queue/blob/master/art/Internet%20of%20Things%20Architecture.png)

# Running the example

1. ``` bash
   npm install
   ```

2. ```bash
   node index.js
   ```

# Architecture

- Infinite Polling With Events for De-Queue and En-Queue
- De-Queue
  - Every Dequeue sends a event to with the 'EventName' as the routing key
  - Consumers subscribe to the event associated with the routing key
  - Queue acquires a mutex lock , and waits for an event from a consumer which is sent to the queue once the message is consumed
  - Queue releases the mutex , de-queues and acquires the mutex once more
  - Producers push the message with a particular event name as the routing key
- En-Queue
  - Producer pushes the message with the particular event name as the routing key
- Dependency between Consumers
  - Consumers resolve the Dependency on a FIFO basis
  - Consumers can register dependencies and un-register at run-time
