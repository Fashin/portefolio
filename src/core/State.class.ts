export default class State {
    values: Array<any>

    constructor() {
        this.values = []
    }

    public setState(key: string, value: any): any {
        this.values[key] = value

        return value
    }

    public getState(key: string): any {
        return this.values[key]
    }
}