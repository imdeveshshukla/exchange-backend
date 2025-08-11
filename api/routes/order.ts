import express from 'express';
import { pubSubClient, redisClient } from '../redisClient';

const orderRoute = express.Router();
interface Trade_Data {
  id: number;
  name: string;
  type: "SELL" | "BUY";
  price: number;
  quantity: number;
}

orderRoute.post('/', (req, res) => {
  const orderData: Trade_Data = req.body;
  console.log('[Order] Received:', orderData);
  redisClient.lPush('trade_queue', JSON.stringify(orderData))
  // pubSubClient.publish('trade_queue', JSON.stringify(orderData))
  pubSubClient.subscribe('trade_results', (message:string) => {
    console.log("Engine Processed")
    res.status(201).send({ 
      status: 'success',
      orderData: { ...JSON.parse(message) },
   });
  });
});

export default orderRoute;
