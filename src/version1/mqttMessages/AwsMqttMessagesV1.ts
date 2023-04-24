import { ConfigV1 } from '../ConfigV1'
import { ConfigMqttMessageV1, DiscoverMqttMessageV1, GetConfigMqttMessageV1, MqttTopicParametersV1, SetConfigMqttMessageV1 } from '../MqttMessageV1'
import { AwsConfigPayloadV1, AwsSetConfigPayloadV1 } from '../PayloadV1'

export class AwsDiscoverMqttMessageV1 extends DiscoverMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}) {
        super('$aws/things', topicParameters)
    }
}

export class AwsGetConfigMqttMessageV1 extends GetConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}) {
        super('$aws/things/+id/shadow/get', topicParameters)
    }
}

export class AwsConfigMqttMessageV1 extends ConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super('$aws/things/+id/shadow/update', new AwsConfigPayloadV1, topicParameters, payloadParameters)
    }
}

export class AwsSetConfigMqttMessageV1 extends SetConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super('$aws/things/+id/shadow/update', new AwsSetConfigPayloadV1, topicParameters, payloadParameters)
    }
}
