import express from 'express';
import cors from 'cors';
import orderRoute from './routes/order';
import { initRedis } from './redisClient';
const app = express();
const port = 3000;

await initRedis()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1', (req, res, next) => {
  next();
});
app.get('/order', (req, res) => {
  res.send('API Microservice is running');
});
app.use('/order', orderRoute);

app.listen(port, () => {
  console.log(`Main Api is running at http://localhost:${port}`);
});
