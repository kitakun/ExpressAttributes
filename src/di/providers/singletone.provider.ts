import { IDirectDependency, IBuildedDependency, DependencyRegistrationType } from '../type';

export function singletoneProvider(dependency: IDirectDependency): IBuildedDependency<any> {
    let singleInstance: any = null;
    // try find existing instance
    for (const meta of dependency.meta) {
        if (meta.type === DependencyRegistrationType.instance && meta.instance) {
            singleInstance = meta.instance;
        }
    }
    // try find constructor
    for (const meta of dependency.meta) {
        if (meta.type === DependencyRegistrationType.rootType && meta.ctor) {
            singleInstance = new meta.ctor();
        }
    }
    // validate
    if (!singleInstance) {
        throw new Error(`Singletone can't be build for dependency ${dependency.type}`);
    }

    return {
        instance: () => singleInstance
    };
}