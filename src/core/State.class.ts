export default class State {
    values: Array<any>

    constructor() {
        this.values = []
    }

    public setState(key: string, value: any): any {
        this.values[key] = value

        return value
    }

    public getState(key: string, valueIfEmpty = null): any {
        return this.values[key] ?? valueIfEmpty
    }

    public getModel(name: string): any {
        return this.values['models'].filter(model => model.name === name)[0] ?? null
    }

    public getModelsWithoutPlayer(): any {
        return this.values['models'].filter(model => model.name !== 'player')
    }

    public getModelsWithHitbox(): any {
        return this.getModelsWithoutPlayer().filter(model => model.hitbox)
    }

    public getClickableModels(): any {
        return this.getModelsWithoutPlayer().filter(model => model.config.clickable)
    }
}