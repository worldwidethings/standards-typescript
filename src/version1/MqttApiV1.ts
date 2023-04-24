import { Misfit } from 'knight-validation'
import { MqttApi } from '../MqttApi'
import { ConfigV1 } from './ConfigV1'
import { ConfigMqttMessageV1, DiscoverMqttMessageV1, GetConfigMqttMessageV1, MqttTopicParametersV1, SetConfigMqttMessageV1 } from './MqttMessageV1'

export abstract class MqttThingApiV1 extends MqttApi<MqttTopicParametersV1> {

    onDiscover(handler: (message: DiscoverMqttMessageV1, misfits: Misfit[]) => void) {
        this.on('Discover', handler)
    }
    
    onGetConfig(handler: (message: GetConfigMqttMessageV1, misfits: Misfit[]) => void) {
        this.on('GetConfig', handler)
    }

    onSetConfig(handler: (message: SetConfigMqttMessageV1, misfits: Misfit[]) => void) {
        this.on('SetConfig', handler)
    }

    abstract packConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameters?: ConfigV1): ConfigMqttMessageV1
}

export abstract class MqttServerApiV1 extends MqttApi<MqttTopicParametersV1> {
    onConfig(handler: (message: ConfigMqttMessageV1, misfits: Misfit[]) => void) {
        this.on('Config', handler)
    }

    abstract packDiscoverMessage(topicParameters?: MqttTopicParametersV1): DiscoverMqttMessageV1
    abstract packGetConfigMessage(topicParameters?: MqttTopicParametersV1): GetConfigMqttMessageV1
    abstract packSetConfigMessage(topicParameters?: MqttTopicParametersV1, payloadParameters?: ConfigV1): SetConfigMqttMessageV1
}
