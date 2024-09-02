import GameState from "../state/Game.state";

export default class State {
    values: Array<any>

    constructor() {
        this.values = []
    }

    setState(key: string, value: any): any {
        this.values[key] = value

        return value
    }

    getState(key: string): any {
        return this.values[key]
    }
}