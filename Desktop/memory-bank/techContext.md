# Technical Context: Slipstream

## Technology Stack

### Core Technologies

- **Runtime**: [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime
- **Language**: TypeScript - Strongly typed programming language that builds on JavaScript
- **WebSockets**: [ws](https://github.com/websockets/ws) - WebSocket implementation for Node.js
- **Database**: SQLite - Embedded relational database for message persistence
- **Metrics**: [prom-client](https://github.com/siimon/prom-client) - Prometheus client for Node.js
- **ID Generation**: [@jetit/id](https://github.com/jetit/id) - ID generation library

### Development Tools

- **Package Manager**: Bun - Fast package manager and runtime
- **Testing**: Bun test framework - Built-in testing capabilities
- **Linting**: ESLint - Static code analysis tool
- **Formatting**: Prettier - Code formatter
- **Build System**: Custom scripts with Bun

## Project Structure

```
apps/slipstream/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── environment.ts          # Environment configuration
│   ├── connection/             # WebSocket connection management
│   │   ├── index.ts            # Connection module exports
│   │   ├── manager.ts          # Connection management logic
│   │   ├── message.ts          # Message handling logic
│   │   └── registry.ts         # Connection registry
│   ├── db/                     # Database operations
│   │   ├── db.ts               # Database implementation
│   │   └── index.ts            # Database module exports
│   ├── logging/                # Logging functionality
│   │   └── logger.ts           # Logger implementation
│   ├── metrics/                # Metrics collection
│   │   ├── metrics.ts          # Metrics definitions
│   │   └── server.ts           # Metrics server
│   ├── types/                  # TypeScript type definitions
│   │   ├── connection.types.ts # Connection-related types
│   │   ├── db.types.ts         # Database-related types
│   │   ├── index.ts            # Type exports
│   │   └── message.types.ts    # Message-related types
│   └── utils/                  # Utility functions
│       ├── index.ts            # Utility exports
│       └── url.ts              # URL parsing utilities
└── memory-bank/                # Application-specific memory bank
```

## Key Components

### Connection Management

The connection management system is responsible for establishing and maintaining WebSocket connections between Slipstream instances. It includes:

- **Connection Manager**: Creates and manages WebSocket connections
- **Connection Registry**: Tracks active connections and their status
- **Heartbeat Mechanism**: Sends periodic pings to detect connection issues

```typescript
// Example: Creating a WebSocket connection
function createWSConnection(url: string, options?: ISecureConnectionOptions) {
    const wsOptions: WebSocket.ClientOptions = cleanObject({
        ca: options?.ca,
        cert: options?.cert,
        key: options?.key,
        rejectUnauthorized: options?.rejectUnauthorized,
    });

    const connection = new WebSocket(url, wsOptions);
    return connection;
}
```

### Message Handling

The message handling system processes incoming messages and routes them to appropriate destinations. It includes:

- **Message Validation**: Ensures messages are properly formed
- **Message Routing**: Determines which connections should receive each message
- **Message Acknowledgment**: Confirms receipt of messages

```typescript
// Example: Message handling flow
export function handleMessage(connectionId: ConnectionId, message: TMessage, originRouteId: ConnectionId, db: TSlipStreamDatabase) {
    // Validate the message
    if (!validateMessage(connectionId, message)) {
        return;
    }

    // Initialize message properties
    initializeMessage(message, connectionId, originRouteId);

    // Handle ACK messages separately
    if (message.type === 'ACK') {
        processAcknowledgement(connectionId, message, db);
        return;
    }

    // Send acknowledgement for non-ACK messages
    sendAcknowledgement(connectionId, message.messageId);

    // Determine which connections should receive this message
    const publishableInstances = determinePublishableInstances(connectionId, message);

    // Record and forward the message
    recordAndForwardMessage(connectionId, message, originRouteId, publishableInstances, db);
}
```

### Database Operations

The database system stores messages and tracks their delivery status. It includes:

- **Message Storage**: Stores messages in SQLite database
- **Delivery Tracking**: Tracks which connections have received each message
- **Message Retrieval**: Retrieves pending messages for delivery

### Metrics Collection

The metrics system collects and exposes performance metrics. It includes:

- **System Metrics**: CPU and memory usage
- **Connection Metrics**: Active connections, connection errors
- **Message Metrics**: Messages processed, message latency

```typescript
// Example: Metrics definitions
export const activeConnectionsGauge = new Gauge({
    name: 'slipstream_active_connections',
    help: 'Number of active WebSocket connections',
});

export const messagesProcessedCounter = new Counter({
    name: 'slipstream_messages_processed_total',
    help: 'Total number of messages processed',
    labelNames: ['type', 'origin'],
});
```

## Dependencies

### Internal Dependencies

- **surfboard:utils**: Utility functions from the Surfboard project
- **surfboard:type-utils**: TypeScript utility types from the Surfboard project

### External Dependencies

- **ws**: WebSocket implementation for Node.js
- **@jetit/id**: ID generation library
- **prom-client**: Prometheus client for Node.js

## Configuration

Slipstream is configured through environment variables, which are loaded and validated at startup:

```typescript
// Example: Environment configuration
export const environment = {
    urlConfig: validatedEnvironment.SLIPSTREAM.URL_CONFIG,
    storageLocation: validatedEnvironment.SLIPSTREAM.SLIPSTREAM_STORAGE_PATH,
    reconnectionAttempts: parseInt(validatedEnvironment.SLIPSTREAM.SLIPSTREAM_CONNECTION_RETRY_ATTEMPTS ?? '10'),
    retryTimer: parseInt(validatedEnvironment.SLIPSTREAM.SLIPSTREAM_RETRY_IN_N_SECONDS ?? '5') * 1000,
    metricsPort: parseInt(validatedEnvironment.SLIPSTREAM.METRICS_PORT ?? '8080'),
    enableMessageLogs: (validatedEnvironment.SLIPSTREAM.ENABLE_MESSAGE_LOGS ?? 'true') === 'true',
    enableDebugLogs: validatedEnvironment.SLIPSTREAM.ENABLE_DEBUG_LOGS === 'true',
    maxMessageRepublishAttempts: parseInt(validatedEnvironment.SLIPSTREAM.MAX_MESSAGE_REPUBLISH_ATTEMPTS ?? '3'),
    // ...
};
```

### Required Environment Variables

- **URL_CONFIG**: Base64 encoded JSON array of URL configurations
- **SLIPSTREAM_STORAGE_PATH**: Path to store the SQLite database

### Optional Environment Variables

- **SLIPSTREAM_RETRY_IN_N_SECONDS**: Retry interval in seconds (default: 5)
- **SLIPSTREAM_CONNECTION_RETRY_ATTEMPTS**: Max reconnection attempts (default: 10)
- **METRICS_PORT**: Port for the Prometheus metrics endpoint (default: 8080)
- **ENABLE_MESSAGE_LOGS**: Enable/disable message logging (default: true)
- **ENABLE_DEBUG_LOGS**: Enable/disable debug logging (default: false)
- **MAX_MESSAGE_REPUBLISH_ATTEMPTS**: Max message republish attempts (default: 3)

## Development Setup

### Prerequisites

- Bun runtime
- Git for version control
- Access to the Surfboard monorepo

### Development Workflow

1. Clone the Surfboard repository
2. Install dependencies with `bun install`
3. Configure environment variables
4. Run Slipstream with `bun run apps/slipstream/src/main.ts`

## Testing

Slipstream includes unit tests for core functionality:

- **URL Configuration Tests**: Tests for URL parsing utilities
- **Database Tests**: Tests for database operations

```typescript
// Example: URL configuration test
describe('url-config', () => {
    it('should parse URL configuration', () => {
        // Test implementation
    });
});
```

## Deployment

Slipstream is deployed as part of the Surfboard Payments system across multiple cloud environments:

- **AWS**: Deployed in Amazon Web Services
- **Azure**: Deployed in Microsoft Azure
- **GCP**: Deployed in Google Cloud Platform

## Performance Considerations

- **Message Volume**: Slipstream is designed to handle a high volume of messages
- **Connection Limits**: WebSocket connections are limited by system resources
- **Database Performance**: SQLite performance depends on disk I/O
- **Memory Usage**: Message buffering can impact memory usage

## Security Considerations

- **WebSocket Security**: Connections can be secured with SSL/TLS
- **Message Validation**: All messages are validated before processing
- **Error Handling**: Errors are logged and don't expose sensitive information

## Future Technical Considerations

- **Enhanced Message Types**: Support for additional message patterns
- **Performance Optimizations**: Reduced message overhead
- **Advanced Routing**: More sophisticated tag-based routing
- **Clustering**: Support for clustered deployment
- **Alternative Storage**: Support for alternative storage backends
