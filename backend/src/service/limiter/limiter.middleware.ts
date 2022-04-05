import RateLimit from 'express-rate-limit';

export const apiLimiter = RateLimit({
    windowMs: (+process.env.LIMITER_TIME || 120) * 1000,
    max: +process.env.LIMITER_AFTER || 200,
    message: 'Too many requests created from this IP, please try again later',
});
