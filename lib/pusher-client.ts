import Pusher from 'pusher-js';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!pusherKey || !pusherCluster) {
  if (typeof window !== 'undefined') {
    console.warn('Pusher environment variables are missing. Real-time chat will be disabled.');
  }
}

// Ensure Pusher is only initialized on the client side to avoid SSR errors
export const pusherClient = (typeof window !== 'undefined' && pusherKey && pusherCluster)
  ? new Pusher(pusherKey, {
      cluster: pusherCluster,
    })
  : null;
