require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET', NODE_ENV } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  NODE_ENV,
  DB_ADDRESS,
};
