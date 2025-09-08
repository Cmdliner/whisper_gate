# WHISPER GATE

A real-time video chat application built with **WebRTC**, **WebSockets**, **Hono**, **Bun**, and **Redis**. This project demonstrates peer-to-peer video communication with signaling server architecture.

## Architecture Overview

```
┌─────────────────┐    WebSocket     ┌─────────────────┐    Redis Pub/Sub    ┌─────────────────┐
│   Client A      │ ←──────────────→ │  Hono Server    │ ←─────────────────→ │   Client B      │
│   (Browser)     │                  │  (Signaling)    │                     │   (Browser)     │
└─────────────────┘                  └─────────────────┘                     └─────────────────┘
         │                                    │                                        │
         │              WebRTC P2P Connection │                                        │
         └────────────────────────────────────┼────────────────────────────────────────┘
                       (Direct Video/Audio)   │
                                              │
                                    ┌─────────────────┐
                                    │  MongoDB        │
                                    │  (User/Room)    │
                                    └─────────────────┘
```

## Technology Stack

- **Backend**: Hono.js (Web Framework) + Bun (Runtime)
- **Database**: MongoDB (Users/Rooms) + Redis (Real-time messaging)
- **Frontend**: Vanilla TypeScript + WebRTC APIs
- **Real-time**: WebSocket + Redis Pub/Sub for signaling

## Quick Start

### Prerequisites
- Bun runtime
- MongoDB instance
- Redis instance

### Installation
```bash
bun install
```

### Environment Variables
```bash
# Optional - defaults to localhost
MONGO_URI=mongodb://localhost:27017/whisper_gate
REDIS_PUB_URI=redis://localhost:6379
REDIS_SUB_URI=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

### Development
```bash
# Start server
bun run dev

# Compile TypeScript client (in another terminal)
bun run bundle:script

# Or watch for changes
bun run watch:script
```

Open http://localhost:3001/rooms/123 in multiple browser tabs to test.

## API Documentation

### REST Endpoints

#### Authentication
```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
```

#### Rooms
```bash
POST /api/v1/rooms/create
POST /api/v1/rooms/:roomID/:userID/join
```

#### UI Routes
```bash
GET /                    # Landing page
GET /rooms/:roomID       # Video chat room
GET /healthz            # Health check
```

### WebSocket API

#### Connection
```bash
WS /ws/rooms/:roomID
```

#### Message Types

**Client → Server:**
```typescript
// Join room
{ type: 'join', from: clientId }

// Start video call
{ type: 'start', from: clientId }

// WebRTC Offer
{ type: 'offer', offer: RTCSessionDescription, to: peerId, from: clientId }

// WebRTC Answer
{ type: 'answer', answer: RTCSessionDescription, to: peerId, from: clientId }

// ICE Candidate
{ type: 'ice', candidate: RTCIceCandidate, to: peerId, from: clientId }
```

**Server → Client:**
```typescript
// Peer joined
{ type: 'join', from: peerId }

// Peer started call
{ type: 'start', from: peerId }

// WebRTC signals (offer/answer/ice)
{ type: 'offer'|'answer'|'ice', ...data, from: peerId }

// Peer left
{ type: 'leave', from: peerId }
```

## How It Works

### 1. Signaling Flow
1. **Client connects** via WebSocket to `/ws/rooms/:roomID`
2. **Server subscribes** to Redis channel `room:roomID`
3. **Client sends 'join'** message with unique ID
4. **Server broadcasts** join to other clients via Redis
5. **Clients exchange** WebRTC offers/answers through server
6. **Direct P2P connection** established for video/audio

### 2. WebRTC Connection Process
```typescript
// 1. Client A starts call
startCall() → getUserMedia() → send('start')

// 2. Client B receives 'start', creates offer (if ID > peerID)
receive('start') → createOffer() → send('offer')

// 3. Client A receives offer, creates answer
receive('offer') → setRemoteDescription() → createAnswer() → send('answer')

// 4. Both exchange ICE candidates
onicecandidate → send('ice') → receive('ice') → addIceCandidate()

// 5. P2P connection established
ontrack → display remote video
```

### 3. Key Features

#### ICE Candidate Buffering
```typescript
// Handles candidates arriving before remote description
if (!peer.remoteDescription) {
    pendingIceCandidates[peerId].push(candidate);
} else {
    peer.addIceCandidate(candidate);
}
```

#### Caller/Callee Logic
```typescript
// Prevents both peers from creating offers
if (myId > peerId) {
    await createOffer(peerId);
}
```

#### Connection Recovery
```typescript
// Automatic reconnection on failure
peer.oniceconnectionstatechange = () => {
    if (peer.iceConnectionState === 'failed') {
        peer.restartIce();
    }
};
```

## File Structure

```
src/
├── index.ts                 # Server entry point
├── routes/
│   ├── index.ts            # API router
│   ├── auth.route.ts       # Authentication routes
│   └── room.routes.ts      # Room management
├── controllers/
│   ├── auth.controller.ts  # Auth logic
│   ├── room.controller.ts  # Room logic
│   └── ws.controller.ts    # WebSocket handler
├── lib/
│   └── config.ts          # Database connections
├── models/
│   ├── user.model.ts      # User schema
│   └── room.model.ts      # Room schema
├── ui/
│   ├── index.tsx          # UI router
│   └── room.tsx           # Video chat page
└── static/
    └── script.ts          # Client WebRTC logic

static/
└── script.js              # Compiled client script
```

## Development Notes

### TypeScript Compilation
The client-side TypeScript needs compilation:
```bash
# Manual compile
bun run bundle:script

# Auto-compile on changes
bun run watch:script
```

### Testing Locally
- Use **same device, multiple tabs** for local testing
- **localhost + ngrok** won't work (mixed network context)
- For remote testing, deploy to cloud or use ngrok for both endpoints

### STUN/TURN Servers
- **Localhost**: Uses simple STUN server
- **Production**: Includes TURN servers for NAT traversal
- Free TURN servers may be unreliable for production use

## Common Issues

1. **No video**: Check camera permissions and HTTPS requirement
2. **Connection fails**: Verify STUN/TURN server accessibility
3. **Mixed network**: Don't mix localhost and remote connections
4. **ICE failures**: May need better TURN server configuration

## Learning Outcomes

This project teaches:
- **WebRTC**: Peer-to-peer communication, signaling, ICE
- **Real-time Architecture**: WebSocket + Redis pub/sub scaling
- **Modern Web Stack**: Hono, Bun, TypeScript integration
- **Network Protocols**: Understanding NAT traversal, STUN/TURN
- **Distributed Systems**: Multi-client state synchronization
