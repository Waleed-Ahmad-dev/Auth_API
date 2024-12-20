import dotenv from 'dotenv';

dotenv.config();

const DatabaseURL = process.env.DATABASE_URL;

if (!DatabaseURL) {
     console.error('DATABASE_URI is not defined in .env');
     throw new Error('DATABASE_URI is not defined in .env');
}

export const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

if (!SECRET_ACCESS_TOKEN) {
     console.error('SECRET_ACCESS_TOKEN is not defined in .env');
     throw new Error('SECRET_ACCESS_TOKEN is not defined in .env');
}

export default DatabaseURL;