import { Change } from 'knight-change'
import { Misfit } from 'knight-validation'
import { Configurable, getConfig, setConfig } from '../Configurable'
import { AiConfigV1, AiConfigValidatorV1, BluetoothConfigV1, BluetoothConfigValidatorV1, ConfigV1, ConfigValidatorV1, LanConfigV1, LanConfigValidatorV1, MqttConfigV1, MqttConfigValidatorV1, MqttMessageConfigV1, SensorConfigV1, SensorConfigValidatorV1, WifiConfigV1, WifiConfigValidatorV1, aiConfigPropertiesV1, bluetoothConfigPropertiesV1, configPropertiesV1, lanConfigPropertiesV1, mqttConfigPropertiesV1, mutableAiConfigPropertiesV1, mutableBluetoothConfigPropertiesV1, mutableConfigPropertiesV1, mutableLanConfigPropertiesV1, mutableMqttConfigPropertiesV1, mutableSensorConfigPropertiesV1, mutableWifiConfigPropertiesV1, sensorConfigPropertiesV1, wifiConfigPropertiesV1 } from './ConfigV1'
import { MqttMessageV1, MqttMessagesV1 } from './MqttMessageV1'
import { WwtConfigMqttMessageV1, WwtDiscoverMqttMessageV1, WwtGetConfigMqttMessageV1, WwtSetConfigMqttMessageV1 } from './mqttMessages/WwtMqttMessagesV1'

export class ThingV1
    <
        AiType extends AiV1 = AiV1,
        BluetoothType extends BluetoothV1 = BluetoothV1,
        LanType extends LanV1 = LanV1,
        MqttType extends MqttV1 = MqttV1,
        SensorType extends SensorV1 = SensorV1,
        WifiType extends WifiV1 = WifiV1
    > implements ConfigV1, Configurable<ConfigV1> {

    ais?: AiType[]
    bluetooth?: BluetoothV1
    country?: string
    firmware?: string
    firmwareVersion?: string
    id?: string
    lan?: LanV1
    location?: string | null
    locationType?: string | null
    monitored?: string | null
    monitoredModel?: string | null
    monitoredType?: string | null
    mqtt?: MqttV1
    name?: string | null
    project?: string | null
    sensors?: SensorType[]
    wifi?: WifiV1

    instantiateAi: (config: AiConfigV1, mutableOnly: boolean) => AiType
    instantiateBluetooth: (config: BluetoothConfigV1, mutableOnly: boolean) => BluetoothType
    instantiateLan: (config: LanConfigV1, mutableOnly: boolean) => LanType
    instantiateMqtt: (config: MqttConfigV1, mutableOnly: boolean) => MqttType
    instantiateSensor: (config: SensorConfigV1, mutableOnly: boolean) => SensorType
    instantiateWifi: (config: WifiConfigV1, mutableOnly: boolean) => WifiType

    constructor(
        config?: ConfigV1, 
        instantiateAi: (config: AiConfigV1, mutableOnly: boolean) => AiType = (config: AiConfigV1) => new AiV1(config) as any, 
        instantiateBluetooth: (config: BluetoothConfigV1, mutableOnly: boolean) => BluetoothType = (config: BluetoothConfigV1) => new BluetoothV1(config) as any, 
        instantiateLan: (config: LanConfigV1, mutableOnly: boolean) => LanType = (config: LanConfigV1) => new LanV1(config) as any, 
        instantiateMqtt: (config: MqttConfigV1, mutableOnly: boolean) => MqttType = (config: MqttConfigV1) => new MqttV1(config) as any, 
        instantiateSensor: (config: SensorConfigV1, mutableOnly: boolean) => SensorType = (config: SensorConfigV1) => new SensorV1(config) as any,
        instantiateWifi: (config: WifiConfigV1, mutableOnly: boolean) => WifiType = (config: WifiConfigV1) => new WifiV1(config) as any
    ) {
        this.instantiateAi = instantiateAi
        this.instantiateBluetooth = instantiateBluetooth
        this.instantiateLan = instantiateLan
        this.instantiateMqtt = instantiateMqtt
        this.instantiateSensor = instantiateSensor
        this.instantiateWifi = instantiateWifi

        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): ConfigV1 {
        return getConfig(mutableOnly, this, configPropertiesV1, mutableConfigPropertiesV1)
    }

    setConfig(config: ConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Thing', configPropertiesV1, mutableConfigPropertiesV1, {
            'ais': {
                type: 'array',
                entityName: 'Ai',
                instantiator: this.instantiateAi,
                idProperty: 'slot'
            },
            'bluetooth': {
                type: 'object',
                entityName: 'Bluetooth',
                instantiator: this.instantiateBluetooth
            },
            'lan': {
                type: 'object',
                entityName: 'Lan',
                instantiator: this.instantiateLan
            },
            'mqtt': {
                type: 'object',
                entityName: 'Mqtt',
                instantiator: this.instantiateMqtt
            },
            'sensors': {
                type: 'array',
                entityName: 'Sensor',
                instantiator: this.instantiateSensor,
                idProperty: 'slot'
            },
            'wifi': {
                type: 'object',
                entityName: 'Wifi',
                instantiator: this.instantiateWifi
            },
        })
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new ConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class AiV1 implements AiConfigV1, Configurable<AiConfigV1> {

    model?: string
    slot?: number
    training?: number
    type?: string
    version?: number

    constructor(config?: AiConfigV1) {
        if (config) (
            this.setConfig(config)
        )
    }

    getConfig(mutableOnly = false): AiConfigV1 {
        return getConfig(mutableOnly, this, aiConfigPropertiesV1, mutableAiConfigPropertiesV1)
    }

    setConfig(config: AiConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Ai', aiConfigPropertiesV1, mutableAiConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new AiConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class BluetoothV1 implements BluetoothConfigV1, Configurable<BluetoothConfigV1> {

    address?: string

    constructor(config?: BluetoothConfigV1) {
        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): BluetoothConfigV1 {
        return getConfig(mutableOnly, this, bluetoothConfigPropertiesV1, mutableBluetoothConfigPropertiesV1)
    }

    setConfig(config: BluetoothConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Bluetooth', bluetoothConfigPropertiesV1, mutableBluetoothConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new BluetoothConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class LanV1 implements LanConfigV1, Configurable<LanConfigV1> {

    ip?: string
    mac?: string

    constructor(config?: LanConfigV1) {
        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): LanConfigV1 {
        return getConfig(mutableOnly, this, lanConfigPropertiesV1, mutableLanConfigPropertiesV1)
    }

    setConfig(config: LanConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Lan', lanConfigPropertiesV1, mutableLanConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new LanConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class MqttV1<MessageType extends MqttMessageV1<any> = MqttMessageV1<any>> implements MqttConfigV1, Configurable<MqttConfigV1> {

    host?: string|null
    messages?: MessageType[]
    password?: string|null
    port?: number|null
    username?: string|null

    instantiateMessage: (config: MqttMessageConfigV1) => MessageType

    constructor(
        config?: MqttConfigV1,
        instantiateMessage: (config: MqttMessageConfigV1) => MessageType = (config: MqttMessageConfigV1) => {
            if (! config.name) {
                throw new Error('Cannot instantiate MQTT message class because the configration property name is missing')
            }

            switch (config.name) {
                case MqttMessagesV1.Config: return new WwtConfigMqttMessageV1() as any
                case MqttMessagesV1.Discover: return new WwtDiscoverMqttMessageV1() as any
                case MqttMessagesV1.GetConfig: return new WwtGetConfigMqttMessageV1() as any
                case MqttMessagesV1.SetConfig: return new WwtSetConfigMqttMessageV1() as any
            }

            throw new Error('Unkown MQTT message')
        }
    ) {
        this.instantiateMessage = instantiateMessage

        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): MqttConfigV1 {
        return getConfig(mutableOnly, this, mqttConfigPropertiesV1, mutableMqttConfigPropertiesV1)
    }

    setConfig(config: MqttConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Mqtt', mqttConfigPropertiesV1, mutableMqttConfigPropertiesV1, {
            'message': {
                type: 'array',
                entityName: 'MqttMessage',
                instantiator: this.instantiateMessage,
                idProperty: 'name'
            }
        })
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new MqttConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class SensorV1 implements SensorConfigV1, Configurable<SensorConfigV1> {

    model?: string
    slot?: number
    type?: string

    constructor(config?: SensorConfigV1) {
        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): SensorConfigV1 {
        return getConfig(mutableOnly, this, sensorConfigPropertiesV1, mutableSensorConfigPropertiesV1)
    }

    setConfig(config: SensorConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Sensor', sensorConfigPropertiesV1, mutableSensorConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new SensorConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export class WifiV1 implements WifiConfigV1, Configurable<WifiConfigV1> {

    ip?: string
    mac?: string
    password?: string|null
    ssid?: string|null    

    constructor(config?: WifiConfigV1) {
        if (config) {
            this.setConfig(config)
        }
    }

    getConfig(mutableOnly = false): WifiConfigV1 {
        return getConfig(mutableOnly, this, wifiConfigPropertiesV1, mutableWifiConfigPropertiesV1)
    }

    setConfig(config: WifiConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'Wifi', wifiConfigPropertiesV1, mutableWifiConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere = false): Promise<Misfit[]> {
        let validator = new WifiConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}
