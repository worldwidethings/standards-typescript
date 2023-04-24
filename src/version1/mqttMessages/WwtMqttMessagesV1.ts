import { ConfigV1 } from '../ConfigV1'
import { ConfigMqttMessageV1, DiscoverMqttMessageV1, GetConfigMqttMessageV1, MqttTopicParametersV1, SetConfigMqttMessageV1 } from '../MqttMessageV1'
import { WwtConfigPayloadV1, WwtSetConfigPayloadV1 } from '../PayloadV1'

export class WwtConfigMqttMessageV1 extends ConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super('wwt/+id/config', new WwtConfigPayloadV1, topicParameters, payloadParameters)
    }
}

export class WwtDiscoverMqttMessageV1 extends DiscoverMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}) {
        super('wwt/discover', topicParameters)
    }
}

export class WwtGetConfigMqttMessageV1 extends GetConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}) {
        super('wwt/+id/config/get', topicParameters)
    }
}

export class WwtSetConfigMqttMessageV1 extends SetConfigMqttMessageV1 {
    constructor(topicParameters: MqttTopicParametersV1 = {}, payloadParameters?: ConfigV1) {
        super('wwt/+id/config/set', new WwtSetConfigPayloadV1, topicParameters, payloadParameters)
    }
}
