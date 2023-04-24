import { Change } from 'knight-change'
import { Misfit } from 'knight-validation'
import { getConfig, setConfig } from '../src/Configurable'
import { MqttMessage } from '../src/MqttMessage'
import { Payload } from '../src/Payload'

export interface TestMqttMessageConfig {
    name?: string
    topic?: string
    toThing?: boolean
}

export interface TestMqttTopicParameters {
    id?: string
}

export interface TestMqttPayloadParameters {
    parameter?: number
}

export class TestMqttPayload extends Payload<TestMqttPayloadParameters> {

    async unpack(payload: Uint8Array, parameters?: Partial<TestMqttPayloadParameters> | undefined): Promise<Misfit<any>[]> {
        let decoder = new TextDecoder
        let json = decoder.decode(payload)

        let jsonObject
        try {
            jsonObject = JSON.parse(json)
        }
        catch (e) {

        }

        let misfits: Misfit[] = []

        if (jsonObject == undefined) {
            misfits.push(new Misfit('Required'))
        }
        else if (typeof jsonObject != 'object') {
            misfits.push(new Misfit('TypeOf'))
        }
        else if (jsonObject.parameter == undefined) {
            misfits.push(new Misfit('Required'))
        }
        else if (typeof jsonObject.parameter != 'number') {
            misfits.push(new Misfit('TypeOf'))
        }
        else if (jsonObject.parameter < 0 || jsonObject.parameter > 100) {
            misfits.push(new Misfit('Bounds'))
        }

        if (parameters) {
            Object.assign(parameters, jsonObject)
        }

        return misfits
    }

    async validate(parameters: Partial<TestMqttPayloadParameters>): Promise<Misfit<any>[]> {
        let misfits: Misfit[] = []

        if (parameters.parameter == undefined) {
            misfits.push(new Misfit('Required'))
        }
        else if (typeof parameters.parameter != 'number') {
            misfits.push(new Misfit('TypeOf'))
        }
        else if (parameters.parameter < 0 || parameters.parameter > 100) {
            misfits.push(new Misfit('Bounds'))
        }

        return misfits
    }

    pack(parameters: TestMqttPayloadParameters): Uint8Array {
    
        let encoder = new TextEncoder
        return new Uint8Array(encoder.encode(JSON.stringify(parameters)))
    }
}

export class TestMqttMessage extends MqttMessage<TestMqttMessageConfig, TestMqttTopicParameters, TestMqttPayloadParameters> {
    constructor(name: string, topic: string, topicParameter?: TestMqttTopicParameters) {
        super(name, true, topic, new TestMqttPayload, topicParameter ? topicParameter : {})
    }

    getConfig(mutableOnly = false): TestMqttMessageConfig {
        return getConfig(mutableOnly, this, [ 'name', 'topic', 'toThing' ], [])
    }

    setConfig(config: TestMqttMessageConfig, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'MqttMessage', [ 'name', 'topic', 'toThing' ], [])
    }

    async validateConfig(checkOnlyWhatIsThere?: boolean | undefined): Promise<Misfit<any>[]> {
        return []
    }
}
