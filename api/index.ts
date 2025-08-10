import express from 'express';
import cors from 'cors';
import orderRoute from './routes/order';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('API Microservice is running');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1', (req, res, next) => {
  next();
});
app.post('/order', orderRoute);

app.listen(port, () => {
  console.log(`Main Api is running at http://localhost:${port}`);
});
