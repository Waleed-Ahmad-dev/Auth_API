import dotenv from 'dotenv';

dotenv.config();

const DatabaseURI = process.env.DATABASE_URI;

if (!DatabaseURI) {
     throw new Error('DATABASE_URI is not defined in .env');
}

export default DatabaseURI;
