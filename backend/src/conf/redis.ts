export const REDIS = {
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
};
