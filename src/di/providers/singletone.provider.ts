import { IDirectDependency, IBuildedDependency, DependencyRegistrationType, injectorType, DependencyType } from '../type';

export function singletoneProvider(dependency: IDirectDependency, injector: injectorType): IBuildedDependency<any> {
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
            singleInstance = injector(meta.ctor, DependencyType.singletone);
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