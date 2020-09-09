export class DateService1 implements IDateService {
    public readonly createdAt: Date;
    constructor() {
        this.createdAt = new Date();
    }
    public getDate(): Date {
        return new Date(2020, 10, 10);
    }
}

export class DateService2 implements IDateService {
    public getDate(): Date {
        return new Date(2020, 10, 10);
    }
}

export class IDateService {
    public getDate(): Date {
        throw new Error('not implemented');
    }
}