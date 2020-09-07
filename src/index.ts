import express from 'express';

const app = express();

import './controllers';
import { appRouter } from './decorators/action.decorator';

app.use(appRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});