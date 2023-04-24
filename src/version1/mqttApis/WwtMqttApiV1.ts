import { ConfigV1 } from '../ConfigV1'
import { MqttServerApiV1, MqttThingApiV1 } from '../MqttApiV1'
import { WwtDiscoverMqttMessageV1, WwtGetConfigMqttMessageV1, WwtConfigMqttMessageV1, WwtSetConfigMqttMessageV1 } from '../mqttMessages/WwtMqttMessagesV1'
import { ConfigMqttMessageV1, MqttTopicParametersV1 } from '../MqttMessageV1'

/**
 * Represents the Coderitter Smart Sensor API on the Smart Sensor side.
 */
export class WwtMqttThingApiV1 extends MqttThingApiV1 {
    constructor(topicParameters?: MqttTopicParametersV1) {
        super('WWT', topicParameters)

        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new WwtDiscoverMqttMessageV1(topicParameters))
        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new WwtGetConfigMqttMessageV1(topicParameters))
        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new WwtSetConfigMqttMessageV1(topicParameters))
    }

    packConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameters?: ConfigV1): ConfigMqttMessageV1 {
        return new WwtConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters, payloadParameters)
    }
}

/**
 * Represents the Coderitter Smart Sensor API on the server side.
 */
 export class WwtMqttServerApiV1 extends MqttServerApiV1 {
    constructor(topicParameters?: MqttTopicParametersV1) {
        super('WWT', topicParameters)

        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new WwtConfigMqttMessageV1(topicParameters))
    }

    packDiscoverMessage(topicParameters?: MqttTopicParametersV1): WwtDiscoverMqttMessageV1 {
        return new WwtDiscoverMqttMessageV1(topicParameters ? topicParameters : this.topicParameters)
    }

    packGetConfigMessage(topicParameters?: MqttTopicParametersV1): WwtGetConfigMqttMessageV1 {
        return new WwtGetConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters)
    }

    packSetConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameters?: ConfigV1): WwtSetConfigMqttMessageV1 {
        return new WwtSetConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters, payloadParameters)
    }    
}
