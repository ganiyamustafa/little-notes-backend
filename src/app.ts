import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import healthcheck from 'express-healthcheck';
import notes from './api/notes';
import users from './api/users';
import authentications from './api/authentications';
import groups from './api/groups';
import { json } from 'body-parser';

const app = express();
const router = express.Router();
const port = parseInt(process.env.PORT) || 3000;

// connect mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("connect to mongo")
});

// register routes
authentications(router);
notes(router);
users(router);
groups(router);

// healthcheck initialization
app.use('/health', healthcheck({
  healthy: function () {
      return { message: 'ExpressJS web service is up and running' };
  }
}));

app.use(json());
app.use('/api', router);

app.listen(port, '0.0.0.0', () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});