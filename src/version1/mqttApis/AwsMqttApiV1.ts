import { ConfigV1 } from '../ConfigV1'
import { MqttServerApiV1, MqttThingApiV1 } from '../MqttApiV1'
import { AwsDiscoverMqttMessageV1, AwsGetConfigMqttMessageV1, AwsConfigMqttMessageV1, AwsSetConfigMqttMessageV1 } from '../mqttMessages/AwsMqttMessagesV1'
import { MqttTopicParametersV1 } from '../MqttMessageV1'

export class AwsMqttThingApiV1 extends MqttThingApiV1 {
    constructor(topicParameters?: MqttTopicParametersV1) {
        super('AWS', topicParameters)

        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new AwsDiscoverMqttMessageV1(topicParameters))
        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new AwsGetConfigMqttMessageV1(topicParameters))
        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new AwsSetConfigMqttMessageV1(topicParameters))
    }

    packConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameter?: ConfigV1): AwsConfigMqttMessageV1 {
        return new AwsConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters, payloadParameter)
    }   
}

export class AwsMqttServerApiV1 extends MqttServerApiV1 {
    constructor(topicParameters?: MqttTopicParametersV1) {
        super('AWS', topicParameters)

        this.addMessageFactory((topicParameters?: MqttTopicParametersV1) => new AwsConfigMqttMessageV1(topicParameters))
    }

    packDiscoverMessage(topicParameters?: MqttTopicParametersV1): AwsDiscoverMqttMessageV1 {
        return new AwsDiscoverMqttMessageV1(topicParameters ? topicParameters : this.topicParameters)
    }

    packGetConfigMessage(topicParameters?: MqttTopicParametersV1): AwsGetConfigMqttMessageV1 {
        return new AwsGetConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters)
    }

    packSetConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameter?: ConfigV1): AwsSetConfigMqttMessageV1 {
        return new AwsSetConfigMqttMessageV1(topicParameters ? topicParameters : this.topicParameters, payloadParameter)
    }    
}
