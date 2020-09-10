import express, { Router } from 'express';
import { IControllerInstance } from '../../decorators';

let usedPortForTest = 3000;

const nodeInstances = new Map<string, any>();

/**
 * Create Express Instance and inject required Controllers into it
 * @param key test unique key
 * @param requiredControllers required Controllers for test
 */
export const canBeTested = (key: string, requiredControllers: IControllerInstance[]) => {

    if (nodeInstances.has(key)) {
        return nodeInstances.get(key);
    } else {
        const nodePromise = new Promise<any[] | Express.Application[] | Router[]>((resolve, reject) => {
            try {
                const app = express();
                const routes = Router();

                // Get routes
                app.use(routes);

                usedPortForTest++;
                app.listen(usedPortForTest, () => {
                    // console.log(`Launched test express instance on port ${usedPortForTest}`);
                    resolve([app, routes]);
                });
            } catch (err) {
                reject(err);
            }
        });

        nodeInstances.set(key, nodePromise);

        return nodePromise;
    }
}
