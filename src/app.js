import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import pkg from '../package.json';

import { createRoles } from './libs/initialSetup';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();
createRoles();

app.set('pkg', pkg);

app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));


app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        description: app.get('pkg').description,
        version: app.get('pkg').version, 
        author: app.get('pkg').author,
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

export default app;