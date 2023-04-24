import { Misfit, Required, TypeOf, TypeOfMisfitValues, Validator } from 'knight-validation'
import { Payload } from '../Payload'
import { ConfigV1, ConfigValidatorV1 } from './ConfigV1'

export class WwtConfigPayloadV1 extends Payload<ConfigV1> {

    async unpack(payload: Uint8Array, parameters?: ConfigV1): Promise<Misfit<any>[]> {
        let decoder = new TextDecoder
        let json = decoder.decode(payload)

        let jsonObject
        try {
            jsonObject = JSON.parse(json)
        }
        catch (e) {
            return [ new Misfit('ValidJson') ]
        }

        if (jsonObject instanceof Array) {
            return [ new Misfit(new TypeOf().name, { types: [ 'object' ], actual: 'Array' } as TypeOfMisfitValues) ]
        }

        let validator = new ConfigValidatorV1
        let misfits = await validator.validate(jsonObject)

        if (parameters) {
            Object.assign(parameters, jsonObject)
        }

        return misfits
    }
    
    validate(parameters: ConfigV1): Promise<Misfit<any>[]> {
        let validator = new ConfigValidatorV1
        return validator.validate(parameters)
    }

    pack(parameters: ConfigV1): Uint8Array {
        let encoder = new TextEncoder
        return new Uint8Array(encoder.encode(JSON.stringify(parameters)))
    }
}

export class WwtSetConfigPayloadV1 extends Payload<ConfigV1> {

    async unpack(payload: Uint8Array, parameters?: ConfigV1): Promise<Misfit<any>[]> {
        let decoder = new TextDecoder
        let json = decoder.decode(payload)

        let jsonObject
        try {
            jsonObject = JSON.parse(json)
        }
        catch (e) {
            return Promise.resolve([ new Misfit('ValidJson') ])
        }

        if (jsonObject instanceof Array) {
            return [ new Misfit(new TypeOf().name, { types: [ 'object' ], actual: 'Array' } as TypeOfMisfitValues) ]
        }

        if (parameters) {
            Object.assign(parameters, jsonObject)
        }
        
        let validator = new ConfigValidatorV1
        return validator.validate(jsonObject, { checkOnlyWhatIsThere: true })
    }

    validate(parameters: ConfigV1): Promise<Misfit<any>[]> {
        let validator = new ConfigValidatorV1
        return validator.validate(parameters, { checkOnlyWhatIsThere: true })
    }

    pack(parameters: ConfigV1): Uint8Array {
        let encoder = new TextEncoder
        return new Uint8Array(encoder.encode(JSON.stringify(parameters)))
    }
}

export interface AwsConfigPayloadDataV1 {
    state: {
        reported: ConfigV1
    }
}

export class AwsConfigPayloadDataValidatorV1 extends Validator<AwsConfigPayloadDataV1> {
    constructor() {
        super()

        this.add('state', new Required)
        this.add('state', new TypeOf('object'))
        
        this.add('state.reported', new Required)
        this.add('state.reported', new TypeOf('object'))
        this.add('state.reported', new ConfigValidatorV1)
    }
}

export class AwsConfigPayloadV1 extends Payload<ConfigV1> {

    async unpack(payload: Uint8Array, parameters?: Partial<ConfigV1>): Promise<Misfit<any>[]> {
        let decoder = new TextDecoder
        let json = decoder.decode(payload)

        let jsonObject
        try {
            jsonObject = JSON.parse(json)
        }
        catch (e) {
            return Promise.resolve([ new Misfit('ValidJson') ])
        }

        if (jsonObject instanceof Array) {
            return [ new Misfit(new TypeOf().name, { types: [ 'object' ], actual: 'Array' } as TypeOfMisfitValues) ]
        }

        let validator = new AwsConfigPayloadDataValidatorV1
        let misfits = await validator.validate(jsonObject)

        if (parameters) {
            Object.assign(parameters, jsonObject['state']['reported'])
        }

        return misfits
    }

    validate(parameters: Partial<ConfigV1>): Promise<Misfit<any>[]> {
        let validator = new ConfigValidatorV1
        return validator.validate(parameters)
    }
    
    pack(parameters: ConfigV1): Uint8Array {
        let encoder = new TextEncoder
        return new Uint8Array(encoder.encode(JSON.stringify({ state: { reported: parameters }})))
    }    
}

export interface AwsSetConfigPayloadDataV1 {
    state: {
        desired: ConfigV1
    }
}

export class AwsSetConfigPayloadDataValidatorV1 extends Validator<AwsSetConfigPayloadDataV1> {
    constructor() {
        super()

        this.add('state', new Required)
        this.add('state', new TypeOf('object'))
        
        this.add('state.desired', new Required)
        this.add('state.desired', new TypeOf('object'))
        this.add('state.desired', new ConfigValidatorV1)
    }
}

export class AwsSetConfigPayloadV1 extends Payload<ConfigV1> {

    async unpack(payload: Uint8Array, parameters?: Partial<ConfigV1>): Promise<Misfit<any>[]> {
        let decoder = new TextDecoder
        let json = decoder.decode(payload)

        let jsonObject
        try {
            jsonObject = JSON.parse(json)
        }
        catch (e) {
            return Promise.resolve([ new Misfit('ValidJson') ])
        }

        if (jsonObject instanceof Array) {
            return [ new Misfit(new TypeOf().name, { types: [ 'object' ], actual: 'Array' } as TypeOfMisfitValues) ]
        }

        let validator = new AwsSetConfigPayloadDataValidatorV1
        let misfits = await validator.validate(jsonObject, { checkOnlyWhatIsThere: true })

        if (parameters) {
            Object.assign(parameters, jsonObject['state']['desired'])
        }

        return misfits
    }

    validate(parameters: Partial<ConfigV1>): Promise<Misfit<any>[]> {
        let validator = new ConfigValidatorV1
        return validator.validate(parameters, { checkOnlyWhatIsThere: true })
    }

    pack(parameters: ConfigV1): Uint8Array {
        let encoder = new TextEncoder
        return new Uint8Array(encoder.encode(JSON.stringify({ state: { desired: parameters }})))
    }
}
