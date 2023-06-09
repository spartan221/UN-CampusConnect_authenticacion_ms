import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { getDatabase } from './database';
import { createRoles, createAdmin } from './libs/initialSetup';
import { listenMessagesFromRabbitMQ } from './libs/consumer';
import { authToMailService } from './libs/nodemailer';

export let transporter;

const main = async () => {
    console.log("Server is starting...");
    try {
        await getDatabase(process.env.ENV === 'DEV' || false);
        console.log('MongoDB is working');
        await createRoles();
        console.log('Roles has been created');
        try {
            await createAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
            console.log('Admin Account has been created');
        } catch (error) {
            console.log('ERROR:', error.message);
        }
    } catch (error) {
        console.log('MongoDB is not working');
    }
    listenMessagesFromRabbitMQ();
    console.log('Getting transporter for nodemailer...');
    transporter = authToMailService();
    app.listen(process.env.PORT || 3000);
    console.log('Server listening on port', process.env.PORT || 3000);
};

main();