import { Change } from 'knight-change'
import { Misfit } from 'knight-validation'

export abstract class Configurable<ConfigType> {
    abstract getConfig(mutableOnly?: boolean): ConfigType
    abstract setConfig(config: ConfigType , mutableOnly: boolean): Change[]
    abstract validateConfig(checkOnlyWhatIsThere?: boolean): Promise<Misfit[]>
}

export function getConfig<T>(mutableOnly: boolean, obj: any, properties: string[], mutableProperties: string[]): T {
    const config = {}
    
    for (const property of mutableOnly ? mutableProperties : properties) {
        if (obj[property] instanceof Array) {
            (config as any)[property] = obj[property]?.map((configurable: Configurable<T>) => configurable.getConfig(mutableOnly))
        }
        else {
            (config as any)[property] = obj[property]
        }
    }

    return config as T
}

export function setConfig(
    config: any, 
    mutableOnly: boolean, 
    obj: any, 
    entityName: string, 
    properties: string[], 
    mutableProperties: string[], 
    propertyDescriptions?: {
        [key: string] : {
            type: 'array'|'object',
            entityName: string,
            instantiator: (config: any, mutableOnly: boolean) => Configurable<any>,
            idProperty?: string
        }
    }
): Change[] {
    
    if (config == undefined || obj == undefined) {
        return []
    }

    let objChange: Change|null = null
    let changes: Change[] = []

    for (const property of mutableOnly ? mutableProperties : properties) {
        if (propertyDescriptions && property in propertyDescriptions) {
            if (propertyDescriptions[property].type == 'array' && propertyDescriptions[property].idProperty) {
                const idProperty = propertyDescriptions[property].idProperty!

                if (config[property] instanceof Array && config[property].length > 0) {
                    if (obj[property] instanceof Array) {
                        for (const originalItem of (obj[property] as Configurable<any>[])) {
                            let itemFound = false

                            for (const newItem of (config[property] as Configurable<any>[])) {
                                if ((originalItem as any)[idProperty] === (newItem as any)[idProperty]) {
                                    itemFound = true
                                    const change = originalItem.setConfig(newItem, mutableOnly)

                                    if (change && change.length > 0) {
                                        changes.push(...change)
                                        break
                                    }
                                }
                            }

                            if (! itemFound && ! mutableOnly) {
                                const instantiated = propertyDescriptions[property].instantiator(config, mutableOnly)
                                ;(obj[property] as Configurable<any>[]).push(instantiated)
                                changes.push(new Change(propertyDescriptions[property].entityName, instantiated, 'create'))
                            }
                        }
                    }
                    else if (! mutableOnly) {
                        obj[property] = []
                        const instantiated = propertyDescriptions[property].instantiator(config, mutableOnly)
                        ;(obj[property] as Configurable<any>[]).push(instantiated)
                        changes.push(new Change(propertyDescriptions[property].entityName, instantiated, 'create'))
                    }
                }
            }
            else if (propertyDescriptions[property].type == 'object') {
                if (typeof config[property] == 'object' && config[property] !== null) {
                    if (obj[property] instanceof Configurable) {
                        const change = (obj[property] as Configurable<any>).setConfig(config[property], mutableOnly)

                        if (change && change.length > 0) {
                            changes.push(...change)
                            break
                        }
                    }
                    else if (! mutableOnly) {
                        const instantiated = propertyDescriptions[property].instantiator(config, mutableOnly)
                        obj[property] = instantiated
                        changes.push(new Change(propertyDescriptions[property].entityName, instantiated, 'create'))
                    }
                }
            }
        }
        else if (config[property] !== undefined && config[property] !== obj[property]) {
            obj[property] = config[property]

            if (! objChange) {
                objChange = new Change(entityName, obj, 'update', [])
                changes.push(objChange)
            }

            objChange.props!.push(property)
        }
    }

    return changes
}
