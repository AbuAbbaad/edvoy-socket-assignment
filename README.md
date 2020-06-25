# Edvoy Backend Socket Assessment

### Brief
Convert the following requirements into working prototype.

### Requirements
- Use Nodejs
- Use Realtime Sockets, Pubsub
- Two Endpoints
    - One for websocket (i.e "/ws")
    - One for sendingMessages (i.e "/sendMessage")
- Two pages
    - One for listing number of active connections and messages passed With uid (i.e "/dash")
    - One for sending messages ( i.e "/user")
        - Establish WS connection on init
        - Textbox to send message
- Every new tab to the socket URL adds one active connection.
- No need to store any messages. Everything should be stateless.
- Optional bonus - Consider running multiple nodes while publishing events, Graphql

### Coding Standards
- Managing Configurations
- Follow java naming conventions
- Follow a consistent coding style (ESLint)