import { Change } from 'knight-change'
import { Misfit } from 'knight-validation'
import { getConfig, setConfig } from '../Configurable'
import { MqttMessage } from '../MqttMessage'
import { Payload } from '../Payload'
import { ConfigV1, MqttMessageConfigV1, MqttMessageConfigValidatorV1, mqttMessageConfigPropertiesV1, mutableMqttMessageConfigPropertiesV1 } from './ConfigV1'

/**
 * This interface represents the properties which are typically used in the topic to address
 * a specific set of Smart Sensors.
 */
 export interface MqttTopicParametersV1 {
    id?: string
    location?: string
    locationType?: string
    monitored?: string
    monitoredModel?: string
    monitoredType?: string
    project?: string|null
}

/**
 * The base class for any Smart Sensor MQTT message. It adds a parameter `noProject` to the method
 * `receiveSubscription` and the helper method `throwIfSmartSensorIdNotSet`.
 */
export abstract class MqttMessageV1<PayloadParametersType> extends MqttMessage<MqttMessageConfigV1, MqttTopicParametersV1, PayloadParametersType> {
    getConfig(mutableOnly = false): MqttMessageConfigV1 {
        return getConfig(mutableOnly, this, mqttMessageConfigPropertiesV1, mutableMqttMessageConfigPropertiesV1)
    }

    setConfig(config: MqttMessageConfigV1, mutableOnly = false): Change[] {
        return setConfig(config, mutableOnly, this, 'MqttMessage', mqttMessageConfigPropertiesV1, mutableMqttMessageConfigPropertiesV1)
    }

    validateConfig(checkOnlyWhatIsThere?: boolean | undefined): Promise<Misfit<any>[]> {
        const validator = new MqttMessageConfigValidatorV1({ checkOnlyWhatIsThere: checkOnlyWhatIsThere })
        return validator.validate(this)
    }
}

export enum MqttMessagesV1 {
    Config = 'Config',
    Discover = 'Discover',
    GetConfig = 'GetConfig',
    SetConfig = 'SetConfig'
}

/**
 * A Smart Sensor MQTT message which is used on the Smart Sensor side. It is send as soon as
 * the Smart Sensor started up, as a reply to a 'GetProperties' message and every time the 
 * Smart Sensor properties changed.
 */
export abstract class ConfigMqttMessageV1 extends MqttMessageV1<ConfigV1> {
    constructor(topic: string, payload: Payload<ConfigV1>, topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super(MqttMessagesV1.Config, false, topic, payload, topicParameters, payloadParameters)
    }
}

/**
 * A Smart Sensor MQTT message which is used on the server side to discover every Smart Sensor
 * that is currently connected to the MQTT broker. Smart Sensors will reply with a 'Properties'
 * message.
 */
export abstract class DiscoverMqttMessageV1 extends MqttMessageV1<void> {
    constructor(topic: string, topicParameters: MqttTopicParametersV1 = {}) {
        super(MqttMessagesV1.Discover, true, topic, undefined, topicParameters)
    }
}

/**
 * A Smart Sensor MQTT message which is used on the server side to request the properties 
 * of a specific Smart Sensor. The Smart Sensor will reply with a 'Properties' message.
 */
export abstract class GetConfigMqttMessageV1 extends MqttMessageV1<void> {
    constructor(topic: string, topicParameters: MqttTopicParametersV1 = {}) {
        super(MqttMessagesV1.GetConfig, true, topic, undefined, topicParameters)
    }
}

/**
 * A Smart Sensor MQTT message which is used on the server side to change the directly changable
 * properties of a Smart Sensor. If there was a change, the Smart Sensor will reply with a
 * 'Properties' message.
 */
export abstract class SetConfigMqttMessageV1 extends MqttMessageV1<ConfigV1> {
    constructor(topic: string, payload: Payload<ConfigV1>, topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super(MqttMessagesV1.SetConfig, true, topic, payload, topicParameters, payloadParameters)
    }
}
