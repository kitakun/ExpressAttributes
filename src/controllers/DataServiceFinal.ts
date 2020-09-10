import { Injectable } from "../decorators";

@Injectable()
export class DataFinale {
    private numba: number;
    constructor() {
        this.numba = Date.now();
    }
    getNumber(): number {
        return this.numba;
    }
}