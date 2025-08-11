// src/app.ts
import { redisClient, pubSubClient, initRedis } from './redisClient';

(async () => {
  await initRedis();

  // Continuously process jobs from the queue
  while (true) {
    const job: any = await redisClient.brPop('trade_queue', 0);
    const data = JSON.parse(job.element);
    console.log('[Engine] Processing:', data);

    await new Promise(r => setTimeout(r, 3000)); // simulate processing
    console.log('[Engine] Processed:', data);
    await redisClient.publish('trade_results', JSON.stringify({
      jobId: data.id,
      status: 'done',
      timestamp: Date.now()
    }));

    //TODO:Another pub/sub which is connected to websockets
    //TODO:Send to queue which stores trades into db
  }
})();
