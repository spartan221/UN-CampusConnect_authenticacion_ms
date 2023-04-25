import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { getDatabase } from './database';
import { createRoles, createAdmin } from './libs/initialSetup';


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
    app.listen(process.env.PORT);
    console.log('Server listening on port', process.env.PORT);
};

main();