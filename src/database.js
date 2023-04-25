import mongoose from 'mongoose';

const DB_URI = Object.freeze({
    DEV: 'mongodb://127.0.0.1:27017/UN-CampusConnect_autenticacion_db',
    PROD: 'mongodb+srv://uncampus-admin:uncampus2023@auth-ms-db.azcborv.mongodb.net/UN-CampusConnect_autenticacion_db?retryWrites=true&w=majority&authMechanism=DEFAULT'
});

export const getDatabase = async (isDevEnv) => {
    const uri = isDevEnv ? DB_URI.DEV : DB_URI.PROD;
    return new Promise((resolve, reject) => {
        mongoose.connect( uri )
            .then(() => resolve())
            .catch((error) => reject(error));
    });
};