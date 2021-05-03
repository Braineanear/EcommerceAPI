import redis from 'redis';

import config from './config';
import logger from './logger';

// Redis Port
const redisPort = config.redis.port;

/**
 * Create Redis Client
 * @param {number} redisPort
 * @returns {Object}
 */
const client = redis.createClient(redisPort);

// Redis Client Error Handler
client.on('error', (err) => {
  logger.error(`Redis Error: ${err}`);
});

export default client;
