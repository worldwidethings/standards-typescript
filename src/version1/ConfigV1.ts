import { Bounds, Enum, Length, Required, TypeOf, Validator, ValidatorOptions } from 'knight-validation'

export const configPropertiesV1 = [ 'ais', 'bluetooth', 'country', 'firmware', 'firmwareVersion', 'id', 'lan', 'latitude', 'longitude', 'mqtt', 'name', 'project', 'sensors', 'site', 'wifi' ]
export const mutableConfigPropertiesV1 = [ 'country', 'latitude', 'location', 'locationType', 'longitude', 'monitored', 'monitoredModel', 'monitoredType', 'name', 'project', 'site' ]

export interface ConfigV1 {
    ais?: AiConfigV1[]
    bluetooth?: BluetoothConfigV1
    country?: string
    firmware?: string
    firmwareVersion?: string
    id?: string
    lan?: LanConfigV1
    latitude?: number|null
    location?: string|null
    locationType?: string|null
    longitude?: number|null
    monitored?: string|null
    monitoredModel?: string|null
    monitoredType?: string|null
    mqtt?: MqttConfigV1
    name?: string|null
    project?: string|null
    sensors?: SensorConfigV1[]
    site?: string|null
    wifi?: WifiConfigV1
}

export const aiConfigPropertiesV1 = [ 'model', 'slot', 'store', 'training', 'type', 'version' ]
export const mutableAiConfigPropertiesV1 = [  ] as string[]

export interface AiConfigV1 {
    model?: string
    slot?: number
    training?: number
    type?: string
    version?: number
}

export const bluetoothConfigPropertiesV1 = [ 'address' ]
export const mutableBluetoothConfigPropertiesV1 = [ ] as string[]

export interface BluetoothConfigV1 {
    address?: string
}

export const lanConfigPropertiesV1 = [ 'ip', 'mac' ]
export const mutableLanConfigPropertiesV1 = [ ] as string[]

export interface LanConfigV1 {
    ip?: string
    mac?: string
}

export const mqttConfigPropertiesV1 = [ 'host', 'password', 'port', 'username' ]
export const mutableMqttConfigPropertiesV1 = [ 'host', 'password', 'port', 'username' ]

export interface MqttConfigV1 {
    api?: string
    host?: string|null
    messages?: MqttMessageConfigV1[]
    password?: string|null
    port?: number|null
    username?: string|null
}

export const mqttMessageConfigPropertiesV1 = [ 'name', 'topic' ]
export const mutableMqttMessageConfigPropertiesV1 = [ 'topic' ]

export interface MqttMessageConfigV1 {
    name?: string
    topic?: string
}

export const sensorConfigPropertiesV1 = [ 'model', 'slot', 'type' ]
export const mutableSensorConfigPropertiesV1 = [ ] as string[]

export interface SensorConfigV1 {
    model?: string
    slot?: number
    type?: string
}

export const wifiConfigPropertiesV1 = [ 'ip', 'mac', 'password', 'ssid' ]
export const mutableWifiConfigPropertiesV1 = [ 'password', 'ssid' ]

export interface WifiConfigV1 {
    ip?: string
    mac?: string
    password?: string|null
    ssid?: string|null
}

export class ConfigValidatorV1 extends Validator<ConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('ais', new Required)
        this.add('ais', new TypeOf(Array))
        this.add('ais', new AiConfigValidatorV1)

        this.add('bluetooth', new BluetoothConfigValidatorV1(options))

        this.add('country', new Required)
        this.add('country', new TypeOf('string'))
        this.add('country', new Length({ exact: 2 }))

        this.add('firmware', new Required)
        this.add('firmware', new TypeOf('string'))
        this.add('firmware', new Length({ min: 1, max: 200 }))

        this.add('firmwareVersion', new Required)
        this.add('firmwareVersion', new TypeOf('string'))
        this.add('firmwareVersion', new Length({ min: 1, max: 20 }))

        this.add('id', new Required)
        this.add('id', new TypeOf('string'))
        this.add('id', new Length({ exact: 5 }))

        this.add('lan', new LanConfigValidatorV1(options))

        this.add('latitude', new TypeOf('number', null))
        this.add('latitude', new Bounds({ greaterThanEqual: -90, lesserThanEqual: 90 }))

        this.add('location', new TypeOf('string', null))
        this.add('location', new Length({ min: 1, max: 200 }))

        this.add('locationType', new TypeOf('string', null))
        this.add('locationType', new Length({ min: 1, max: 200 }))

        this.add('longitude', new TypeOf('number', null))
        this.add('longitude', new Bounds({ greaterThanEqual: -180, lesserThanEqual: 180 }))

        this.add('monitored', new TypeOf('string', null))
        this.add('monitored', new Length({ min: 1, max: 200 }))

        this.add('monitoredModel', new TypeOf('string', null))
        this.add('monitoredModel', new Length({ min: 1, max: 200 }))

        this.add('monitoredType', new TypeOf('string', null))
        this.add('monitoredType', new Length({ min: 1, max: 200 }))

        this.add('mqtt', new MqttConfigValidatorV1(options))

        this.add('name', new TypeOf('string', null))
        this.add('name', new Length({ min: 1, max: 200 }))

        this.add('project', new TypeOf('string', null))
        this.add('project', new Length({ min: 1, max: 200 }))

        this.add('sensors', new Required)
        this.add('sensors', new TypeOf(Array))
        this.add('sensors', new SensorConfigValidatorV1(options))

        this.add('site', new TypeOf('string', null))
        this.add('site', new Length({ min: 1, max: 200 }))

        this.add('wifi', new WifiConfigValidatorV1(options))
    }
}

export class AiConfigValidatorV1 extends Validator<AiConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('model', new Required)
        this.add('model', new TypeOf('string'))
        this.add('model', new Length({ min: 1, max: 200 }))

        this.add('slot', new Required)
        this.add('slot', new TypeOf('number'))

        this.add('training', new Required)
        this.add('training', new TypeOf('number'))

        this.add('type', new Required)
        this.add('type', new TypeOf('string'))
        this.add('type', new Length({ min: 1, max: 200 }))

        this.add('version', new Required)
        this.add('version', new TypeOf('number'))
    }
}

export class BluetoothConfigValidatorV1 extends Validator<BluetoothConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('address', new Required)
        this.add('address', new TypeOf('string'))
        this.add('address', new Length({ exact: 17 }))
    }
}

export class LanConfigValidatorV1 extends Validator<LanConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('ip', new TypeOf('string'))
        this.add('ip', new Length({ exact: 15 }))

        this.add('mac', new Required)
        this.add('mac', new TypeOf('string'))
        this.add('mac', new Length({ exact: 17 }))
    }
}

export class MqttConfigValidatorV1 extends Validator<MqttConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('host', new TypeOf('string', null))
        this.add('host', new Length({ min: 1, max: 200}))

        this.add('password', new TypeOf('string', null))
        this.add('password', new Length({ min: 1, max: 200 }))

        this.add('port', new TypeOf('number', null))

        this.add('username', new TypeOf('string', null))
        this.add('username', new Length({ min: 1, max: 200 }))
    }
}

export class MqttMessageConfigValidatorV1 extends Validator<MqttMessageConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('name', new Required)
        this.add('name', new TypeOf('string'))
        this.add('name', new Length({ min: 1, max: 30 }))

        this.add('topic', new Required)
        this.add('topic', new TypeOf('string'))
        this.add('topic', new Length({ min: 1, max: 200 }))
    }
}

export class SensorConfigValidatorV1 extends Validator<SensorConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('model', new Required)
        this.add('model', new TypeOf('string'))
        this.add('model', new Length({ min: 1, max: 200 }))

        this.add('slot', new Required)
        this.add('slot', new TypeOf('number'))

        this.add('type', new Required)
        this.add('type', new TypeOf('string'))
        this.add('type', new Length({ min: 1, max: 200 }))
    }
}

export class WifiConfigValidatorV1 extends Validator<WifiConfigV1> {

    constructor(options?: ValidatorOptions) {
        super(options)

        this.add('ip', new TypeOf('string'))
        this.add('ip', new Length({ exact: 15 }))

        this.add('mac', new Required)
        this.add('mac', new TypeOf('string'))
        this.add('mac', new Length({ exact: 17 }))

        this.add('password', new TypeOf('string', null))
        this.add('password', new Length({ min: 1, max: 63 }))

        this.add('ssid', new TypeOf('string', null))
        this.add('ssid', new Length({ min: 1, max: 32 }))
    }
}
