import dotenv from 'dotenv';
dotenv.config();

export const {
    DEBUG_MODE,
    APP_PORT,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL
} = process.env;