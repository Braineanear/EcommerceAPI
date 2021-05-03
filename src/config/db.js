import mongoose from 'mongoose';
import logger from './logger';
import config from './config';

const connectDB = async () => {
  const DB = config.db.url.replace('<PASSWORD>', config.db.password);

  mongoose.set('autoIndex', true);

  const con = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: true
  });

  logger.info(`MongoDB Connected: ${con.connection.host}.`);

  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to Database');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Mongoose Connected to Database');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose Connection is Disconnected.');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default connectDB;
