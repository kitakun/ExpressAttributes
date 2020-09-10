export interface Type<T> {
    name?: string;

    new(...args: any): T;
}

export declare interface AbstractType<T> extends Function {
    prototype: T;
}

export interface IServiceContainer {
    /** Register dependency as Transient */
    registerType<T>(target: Type<any>): IRegisteredService<T>;
    /** Register dependency as Singletone */
    registerSingletone<T>(target: Type<any>): IRegisteredService<T>;
}

export interface IRegisteredService<BaseType> {
    /** Register as passed type */
    As<ImplementedType, BaseType>(target: Type<ImplementedType>): IRegisteredService<BaseType>;
    /** This dependency is Instance */
    asObject<ImplementedType>(instance: ImplementedType): IRegisteredService<BaseType>;
    /** This dependency is constructor */
    asCtor<ImplementedType>(target: Type<ImplementedType>): IRegisteredService<BaseType>;
    /** Register by name */
    byName(name: string): IRegisteredService<BaseType>;
}

export interface IServiceProvider {
    resolve<T>(target: Type<T> | string): T;
}

export interface IDirectDependency {
    type: DependencyType;
    meta: IDependencyMeta[];
}

export interface IDependencyMeta {
    type: DependencyRegistrationType;
    instance?: any;
    ctor?: any;
    key?: string;
    provider?: IBuildedDependency<any>;
}

export enum DependencyRegistrationType {
    instance = 0,
    name = 1,
    constructor = 2,
    rootType = 3,
}

export interface IBuildedDependency<T> {
    instance: () => T;
}

export enum DependencyType {
    /** Once in entire application time */
    singletone = 0,
    /** One on a request */
    scoped = 1,
    /** Every time new one */
    transient = 2,
    /** Injecting @Controller */
    controller = 3,
    /** unknown type, will be deleted after container build */
    unknown = 255
}

export declare type injectorType = (target: Type<any>, injectionScope: DependencyType) => any;
