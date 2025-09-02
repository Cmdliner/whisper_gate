import { Context } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import { redisPub, redisSub } from '../lib/config';

const { upgradeWebSocket, websocket } = createBunWebSocket()

export const webSocketHandler = upgradeWebSocket((c: Context) => {
    const { roomID } = c.req.param();
    const channel = `room:${roomID}`
    let subCount = 0

    return {
        onOpen: async (_event, ws) => {
            console.log(`Websocket opened for room ${roomID}`)
            if (subCount == 0) {
                await new Promise((resolve, reject) => {
                    redisSub.subscribe((channel, err) => {
                        if (err) {
                            console.error('Redis subscribe error: ', err)
                            reject(err)
                        }
                        else {
                            subCount++
                            resolve(undefined)
                        }
                    });
                });
            }
            redisSub.on('message', (ch, msg) => {
                if (ch == channel) ws.send(msg)
            });
            redisPub.publish(channel, JSON.stringify({ type: 'join', user: 'anonymous' }))
        },
        onMessage: (event, _ws) => {
            const msg = event.data.toString()
            redisPub.publish(channel, msg)
        },
        onClose: () => {
            console.log(`Websocket closed for room ${roomID}`)
            subCount--;
            if (subCount <= 0) redisSub.unsubscribe(channel)
        },
        onError: (event) => {
            console.error(`Websocket error in room ${roomID}: `, event)
        }
    }
})

export  { websocket }