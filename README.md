# Socket.IO Broadcasting

Socket.IO makes it easy to broadcast events to multiple clients in a Node.js application. Broadcasting can be done in various ways, depending on your specific use case. This cheatsheet covers different scenarios.

## Broadcasting to All Connected Clients

To send an event to all connected clients:

```javascript
io.emit("event_name", data);
```

## Broadcasting to All Connected Clients Except the Sender

To broadcast to all connected clients except the sender:

```javascript
io.on("connection", (socket) => {
  socket.broadcast.emit("event_name", data);
}
```

## Broadcasting to a Specific Socket

To send an event to a specific client (socket):

```javascript
socket.emit("event_name", data);
```

## Broadcasting with Acknowledgements

Starting with Socket.IO 4.5.0, you can broadcast an event to multiple clients and expect an acknowledgement from each of them:

```javascript
io.timeout(5000).emit("event_name", data, (err, responses) => {
  if (err) {
    // Some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // One response per client
  }
});
```

## Broadcasting to Clients in a Room

You can broadcast to clients in a specific room using the to method:

```javascript
io.to("room_name").emit("event_name", data);
```

## Broadcasting with Redis

Broadcast to clients connected to the current server only (local):

```javascript
io.local.emit("event_name", data);
```

## Broadcasting within a Namespace

To broadcast within a specific namespace:

```javascript
io.of("/namespace").emit("event_name", data);
```

# Broadcasting Within Rooms in Socket.IO

Socket.IO allows you to create rooms, which are arbitrary channels that sockets can join and leave. Rooms are a powerful feature that enables you to broadcast events to a specific subset of connected clients. This cheatsheet explains how to broadcast events within rooms.

## Broadcasting to All Clients in a Room

To send an event to all clients in a specific room, use the `io.to(roomName).emit(event, data)` method. Here's an example:

```javascript
io.to("roomName").emit("eventName", eventData);
```

io is the main Socket.IO server instance.
"roomName" is the name of the room you want to target.
"eventName" is the name of the event you want to emit.
eventData is the data you want to send to clients in the room.
Excluding a Room
You can also exclude a specific room when broadcasting an event. Use the io.except(roomName).emit(event, data) method. This sends the event to all rooms except the specified one.

```javascript
io.except("roomToExclude").emit("eventName", eventData);
```

## Broadcasting to Multiple Rooms

You can emit an event to multiple rooms simultaneously using the to or in methods. These methods are used in combination, and a union operation is performed. This means that any socket that belongs to at least one of the specified rooms will receive the event.

```javascript
io.to("room1").to("room2").to("room3").emit("eventName", eventData);
```

## Broadcasting to a Room from a Specific Socket

To broadcast to a room from a specific socket while excluding the sender, you can use the socket.to(roomName).emit(event, data) method within the connection handler.

```javascript
io.on("connection", (socket) => {
  socket.to("roomName").emit("eventName", eventData);
});
```

## Room Use Cases

Rooms are valuable in various use cases, such as:

Broadcast Data to Each Device/Tab of a User: You can use rooms to target specific users and send data to all their connected devices or browser tabs.

```javascript
io.on("connection", async (socket) => {
  const userId = await computeUserIdFromHeaders(socket);
  socket.join(userId);
  // Later, you can broadcast to that user's room.
  io.to(userId).emit("hi");
});
```

Send Notifications About a Specific Entity: Rooms can be used to send notifications about specific entities, such as projects.

```javascript
io.on("connection", async (socket) => {
  const projects = await fetchProjects(socket);
  projects.forEach((project) => socket.join("project:" + project.id));
  // Later, you can broadcast updates to a specific project's room.
  io.to("project:4321").emit("project updated");
});
```

## Disconnection and Rooms

Upon disconnection, sockets automatically leave all the rooms they were part of. You don't need to perform any special teardown. You can access the rooms a socket was in by listening to the disconnecting event.

```javascript
io.on("connection", (socket) => {
  socket.on("disconnecting", () => {
    console.log(socket.rooms); // This Set contains at least the socket ID.
  });

  socket.on("disconnect", () => {
    // socket.rooms.size === 0
  });
});
```
