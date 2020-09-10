import { Injectable } from '../../decorators';

@Injectable()
export class OtherGlobalService {
    private createdAt: number;
    constructor() {
        this.createdAt = Date.now();
    }
    public getNumber(): number {
        return this.createdAt;
    }
}

@Injectable()
export class DateServiceWithDependency implements IDateService {
    public readonly createdAt: Date;
    constructor(
        public readonly numbService: OtherGlobalService) {
        this.createdAt = new Date();
    }
    public getDate(): Date {
        return new Date(2020, this.numbService.getNumber(), this.numbService.getNumber());
    }
}

@Injectable()
export class DateServiceWithoutDependency implements IDateService {
    public getDate(): Date {
        return new Date(2020, 10, 10);
    }
}

export class IDateService {
    public getDate(): Date {
        throw new Error('not implemented');
    }
}

@Injectable()
export class TestDateService {
    static staticDate = new Date(2000, 7, 7);
    public getDate(): Date {
        return TestDateService.staticDate;
    }
}

@Injectable()
export class TransientTestService {
    public getDate(): number {
        return Date.now();
    }
}