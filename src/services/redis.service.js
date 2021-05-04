import logger from '../config/logger';
import client from '../config/redis';

/**
 * Get Cached Data For a Specific Key From Memory
 * @param {String} key
 * @returns {Object}
 */
const get = (key) =>
  new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
        logger.error(err, { from: 'redis get' });
      }

      resolve(data);
    });
  });

/**
 * Set Cached Data With a Specific Key in Memory
 * @param {String} key
 * @param {JSON} data
 * @param {String} timeunit [EX: seconds, PX: milliseconds]
 * @param {Number} timeout
 * @returns {Object}
 */
const set = (key, data, timeunit, timeout) =>
  client.set(key, data, timeunit, timeout);

/**
 * Generate Caching Key
 * @param {Array} params
 * @returns {String}
 */
const generateCacheKey = (...params) => params.join('-').trim();

export { set, get, generateCacheKey };
