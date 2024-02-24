const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




const userRoutes = require('./src/routes/user.route.js');
const taskRoute = require('./src/routes/Task.route.js');
const healthRoute = require('./src/routes/health.route.js');




app.get("/", async (req, res) => {
  res.status(200).json({
    status: "active",
    service: process.env.SERVER,
    time: new Date(),
  });
});

app.use('/api/task', taskRoute);
app.use('/api/user', userRoutes);
app.use('/api/health', healthRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(new Date());
});
