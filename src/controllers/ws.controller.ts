import { Context } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import { redisPub, redisSub } from '../lib/config';

const { upgradeWebSocket, websocket } = createBunWebSocket()

// track subscribed channels; avoids duplication
const subscribedChannels = new Set<string>();

export const webSocketHandler = upgradeWebSocket((c: Context) => {
    const { roomID } = c.req.param();
    const channel = `room:${roomID}`;
    let clientId: string | null = null;

    return {
        onOpen: async (_event, ws) => {
            console.log(`WebSocket opened for room ${roomID}`);
            
            if (!subscribedChannels.has(channel)) {
                try {
                    await redisSub.subscribe(channel);
                    subscribedChannels.add(channel);
                    console.log(`Subscribed to Redis channel: ${channel}`);
                } catch (err) {
                    console.error('Redis subscribe error:', err);
                    return;
                }
            }

            const messageHandler = (ch: string, msg: string) => {
                if (ch === channel) {
                    try {
                        const parsedMsg = JSON.parse(msg);
                        // Dont send message back tothe sender
                        if (!clientId || parsedMsg.from !== clientId) {
                            console.log(`Broadcasting message from ${parsedMsg.from} to client ${clientId}: ${parsedMsg.type}`);
                            ws.send(msg);
                        }
                    } catch (err) {
                        console.error('Error parsing Redis message:', err);
                    }
                }
            };

            redisSub.on('message', messageHandler);

            (ws as any).messageHandler = messageHandler;
        },
        
        onMessage: (event, _ws) => {
            try {
                const msg = event.data.toString();
                const parsedMsg = JSON.parse(msg);
                
                if (parsedMsg.from && !clientId) {
                    clientId = parsedMsg.from;
                    console.log(`Client ${clientId} connected to room ${roomID}`);
                }

                redisPub.publish(channel, msg);
            } catch (err) {
                console.error('Error processing WebSocket message:', err);
            }
        },
        
        onClose: (_event, ws) => {
            console.log(`WebSocket closed for room ${roomID}, client: ${clientId}`);
            
            if (clientId) {
                redisPub.publish(channel, JSON.stringify({ 
                    type: 'leave', 
                    from: clientId 
                }));
            }
            
            if ((ws as any).messageHandler) {
                redisSub.off('message', (ws as any).messageHandler);
            }

            // NB: I dontt unsubscribe from Redis here as other connections might still need it
            // Redis subscriptions are cleaned up when no clients are connected to the channel
        },
        
        onError: (event) => {
            console.error(`WebSocket error in room ${roomID}:`, event);
        }
    }
})

export  { websocket }