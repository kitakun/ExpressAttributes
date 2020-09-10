export const stringToUrl = (input: string) => {
    if (!input.startsWith('/')) {
        return `/${input}`;
    }
    return input;
}

export const appendControllerToUrl = (controllerPath: string, input: string) => {
    if (controllerPath.toLocaleLowerCase() !== 'index') {
        if (input === '/') {
            // direct to controller as is
            return `/${controllerPath}`;
        }
        // to controller and nesting
        return `/${controllerPath}/${input}`;
    } else {
        if (input === '/') {
            return '/'
        }
        return `/${input}`;
    }
};

export const splitUrlsToRouteInfo = (url: string) => {
    if (url.startsWith('/')) {
        url = url.substring(1, url.length);
    }
    if (url === '/')
        return ['index', '/'];

    const splitted = url.split('/');

    let controllerName: string | null = null;
    let actionName: string | null = null;

    for (const urlPart of splitted) {
        if (urlPart.length) {
            if (!controllerName) {
                controllerName = urlPart;
            } else {
                actionName = urlPart;
                break;
            }
        }
    }

    if (splitted.length === 1) {
        if (actionName?.toLowerCase() === 'index') {
            actionName = '/';
        }
        return ['index', controllerName || '/'];
    }

    return [controllerName, actionName];
}