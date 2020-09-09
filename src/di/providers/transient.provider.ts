import { IDirectDependency, IBuildedDependency, DependencyRegistrationType } from '../type';

export function transientProvider(dependency: IDirectDependency): IBuildedDependency<any> {
    let ctor: any = null;
    // try find constructor
    for (const meta of dependency.meta) {
        if (meta.type === DependencyRegistrationType.rootType && meta.ctor) {
            ctor = new meta.ctor;
        }
    }
    // validate
    if (!ctor) {
        throw new Error(`Transient can't be build for dependency ${dependency.type}`);
    }

    return {
        instance: () => new ctor()
    };
}