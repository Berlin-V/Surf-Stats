# Project Brief: Slipstream

## Overview

Slipstream is a synchronization server designed to enable real-time data synchronization across multiple cloud environments and server instances within the Surfboard Payments system. It serves as the communication backbone that connects Payment Isolate (PI) instances deployed across different cloud providers.

## Purpose

The primary purpose of Slipstream is to ensure data consistency across distributed Payment Isolate instances by providing a reliable, real-time message passing system. This enables the Surfboard Payments system to operate as a cohesive unit despite being distributed across multiple cloud environments.

## Core Functionality

1. **Cross-Environment Communication**

    - Establishes and maintains WebSocket connections between server instances
    - Handles connection management, including reconnection attempts and heartbeat monitoring
    - Provides a reliable communication channel across different cloud environments

2. **Message Routing**

    - Implements path-based routing to prevent message loops
    - Supports tag-based routing for targeted message delivery
    - Ensures messages are delivered to appropriate destinations

3. **Message Persistence**

    - Stores messages in a SQLite database for reliability
    - Tracks message delivery status and acknowledgments
    - Implements message republishing for unacknowledged messages

4. **Monitoring and Observability**
    - Exposes Prometheus metrics for system monitoring
    - Provides structured logging for troubleshooting
    - Includes health check endpoints for system status

## Technical Approach

- Built with Bun and TypeScript for improved performance
- Uses WebSockets for real-time communication
- Implements a SQLite database for message persistence
- Follows a modular architecture with clear separation of concerns
- Supports secure connections with SSL/TLS options

## Key Differentiators

1. **Tag-Based Message Routing**

    - Allows for targeted message delivery based on connection tags
    - Enables efficient communication patterns in a complex distributed system

2. **Message Path Tracking**

    - Prevents message loops by tracking the path of each message
    - Ensures efficient message delivery in a mesh network topology

3. **Configurable Retry Mechanism**

    - Implements a controlled message republishing strategy
    - Provides reliability without overwhelming the system

4. **Multi-Cloud Support**
    - Designed to work across different cloud providers (AWS, Azure, GCP)
    - Enables a truly distributed payment processing system

## Current Status

Slipstream is operational with core functionality implemented. It currently supports the basic message types (SK, SA, ACK) and provides the foundation for cross-environment synchronization in the Surfboard Payments system.
