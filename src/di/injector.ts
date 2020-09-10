// Locals
import { Type, IServiceContainer, IRegisteredService, IDirectDependency, IBuildedDependency, DependencyType, DependencyRegistrationType, IDependencyMeta } from './type';
// Providers
import { singletoneProvider, transientProvider } from './providers';

export class Injector implements IServiceContainer {

    private _buildedDeps: Map<Type<any> | string, IDependencyMeta> = new Map();
    private _directs?: IDirectDependency[] = [];

    registerType<TRegistered>(target?: Type<TRegistered>): IRegisteredService<TRegistered> {
        return this._registration(DependencyType.transient, target);
    }

    registerSingletone<TRegistered>(target?: Type<TRegistered>): IRegisteredService<TRegistered> {
        return this._registration(DependencyType.singletone, target);
    }

    /** Fill Container with dependencies and delete temp data */
    public build(): void {
        // parametless injections first
        this._directs = this._directs!.sort(f => {
            const rootType = f.meta.find(ff => ff.type === DependencyRegistrationType.rootType && !!ff.ctor);
            if (rootType) {
                const tokens: any[] = Reflect.getMetadata('design:paramtypes', rootType?.ctor) || [];
                return tokens.length;
            }
            return 0;
        });
        // create providers for injections
        for (const dep of this._directs!) {
            let dependencyProvider: IBuildedDependency<any>;
            switch (dep.type) {
                case DependencyType.singletone:
                    dependencyProvider = singletoneProvider(dep, this.inject.bind(this));
                    break;

                case DependencyType.transient:
                    dependencyProvider = transientProvider(dep, this.inject.bind(this));
                    break;

                default:
                    throw new Error(`Type ${dep.type} not implemented!`);
            }

            for (const depMeta of dep.meta) {
                depMeta.provider = dependencyProvider;
                this._buildedDeps.set(depMeta.ctor || depMeta.key, depMeta);
            }
        }

        delete this._directs;
    }

    private _registration<TRegistered>(dependencyType: DependencyType, targetCtor?: Type<TRegistered>): IRegisteredService<TRegistered> {
        const registredService = {
            type: dependencyType,
            meta: []
        } as IDirectDependency;

        if (targetCtor) {
            registredService.meta.push({
                type: DependencyRegistrationType.constructor,
                ctor: targetCtor
            });
            registredService.meta.push({
                type: DependencyRegistrationType.rootType,
                ctor: targetCtor
            });
        }

        this._directs!.push(registredService);

        return this._wrapProvider(registredService);
    }

    private _wrapProvider<TRegistered>(dependency: IDirectDependency): IRegisteredService<TRegistered> {
        const wrapper = {
            As: (otherType: Type<any>) => {
                dependency.meta.push({
                    type: DependencyRegistrationType.constructor,
                    ctor: otherType
                });
                return wrapper;
            },
            asCtor: (otherCtr: Type<any>) => {
                dependency.meta.push({
                    type: DependencyRegistrationType.constructor,
                    ctor: otherCtr
                });
                return wrapper;
            },
            asObject: (objInstance: { prototype: any } | any) => {
                if (!!objInstance) {
                    dependency.meta.push({
                        type: DependencyRegistrationType.instance,
                        instance: objInstance,
                        ctor: objInstance.prototype
                    });
                }
                return wrapper;
            },
            byName: (objName: string) => {
                dependency.meta.push({
                    type: DependencyRegistrationType.name,
                    key: objName
                });
                return wrapper;
            }
        };

        return wrapper;
    }

    public resolve<T>(expectedType: Type<T> | string): T {

        if (typeof expectedType === 'string') {
            // search in map by key
            if (this._buildedDeps.has(expectedType)) {
                return this._buildedDeps.get(expectedType)?.provider?.instance();
            }
            // search in values by key
            for (const mapPair of this._buildedDeps) {
                if (mapPair[1].key === expectedType) {
                    return mapPair[1].provider?.instance() || null;
                }
            }

            throw new Error(`${expectedType} not registered.`);
        } else {
            const dependency = this._buildedDeps.get(expectedType);

            const instance = dependency?.provider?.instance();

            return instance || null;
        }
    }

    public inject<T>(target: Type<T>, injectionScope: DependencyType): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: Type<any>) => this.resolve<any>(token)) as any[];
        if (injections.find(f => f === null || f === undefined)) {
            throw new Error(`${target.name} can't be injected`);
        }

        const newClassInstance = new target(...injections);

        return newClassInstance;
    }
}