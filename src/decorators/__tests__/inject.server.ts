import express from 'express';

const app = express();

import { appRouter } from '../action.decorator';

app.use(appRouter);
let usedPortForTest = 3000;
let launched = false;

export const canBeTested = new Promise<Express.Application>((resolve, reject) => {
    try {
        if (!launched) {
            usedPortForTest++;
            app.listen(usedPortForTest, () => {
                launched = true;
                console.log(`Launched test express instance on port ${usedPortForTest}`);
                resolve(app);
            });
        } else {
            resolve(app);
        }
    } catch (err) {
        reject(err);
    }
});
