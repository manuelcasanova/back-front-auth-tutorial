//Apply cors ASAP but after the logger
const allowedOrigins = [
  //Remove unnecessary after development
  'https://www.yourdomain.com',
  'https://127.0.0.1:5500',
  'https://localhost:3500',
  'https://localhost:3000',

];

module.exports = allowedOrigins;