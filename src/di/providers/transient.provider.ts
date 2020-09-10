import { IDirectDependency, IBuildedDependency, DependencyRegistrationType, injectorType, DependencyType } from '../type';

export function transientProvider(dependency: IDirectDependency, injector: injectorType): IBuildedDependency<any> {
    let ctor: () => any = null as any;
    // try find constructor
    for (const meta of dependency.meta) {
        if (meta.type === DependencyRegistrationType.rootType && meta.ctor) {
            ctor = () => injector(meta.ctor, DependencyType.transient);
            break;
        }
    }
    // validate
    if (!ctor) {
        throw new Error(`Transient can't be build for dependency ${dependency.type}`);
    }

    return {
        instance: ctor
    };
}