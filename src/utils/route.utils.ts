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
