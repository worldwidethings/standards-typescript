import { EventBus } from 'knight-event'
import { MqttMessage } from './MqttMessage'

/**
 * Represents a set of MQTT messages which form an MQTT API. It can be used to decide
 * if a received MQTT message belongs to that API and it can be used to create 'MqttMessage' 
 * objects belonging to that API. This class is meant to be used as the base class for 
 * specific Smart Sensor API's in specific versions.
 * 
 * It will obtain a `topicParameters` object which is used to determine the set of 
 * Smart Sensors this API should decide that their messages belong to it. You can either
 * concentrate on MQTT messages of one specific Smart Sensor or of more. The parameter
 * `topicParameters` serves as a filter for that purpose.
 * 
 * The next step is to register `MqttMessage` factory methods of those MQTT messages that
 * are received. A sub class of this class will already have registered those in its
 * constructor.
 * 
 * 
 * When you create the class you will use the topic parameter to determine if you want
 * to recevice MQTT messages from one specific Smart Sensor, from every Smart Sensor or
 * from a sub set in between.
 * 
 * At first, you register factory methods which can create a message object for
 * every received MQTT message. Sub classes will already have done this. They will
 * provide `on` methods wh
 * 
 * Then you use the method `getSubscriptions` to subscribe
 * to every topic. Then, when you receive an MQTT message with your specific MQTT client,
 * you can call the method `receive` which will find out, if the received topic matches
 * one of the expected topics. If so, it will set the received payload on the MQTT message
 * object and calls the handler that you registered.
 */
export class MqttApi<TopicParameterType> extends EventBus {
    
    name: string
    topicParameters?: TopicParameterType
    messageFactories: ((topicParameters?: TopicParameterType) => MqttMessage<any, any, any>)[] = []

    constructor(name: string, topicParameters?: TopicParameterType) {
        super()
        this.name = name
        this.topicParameters = topicParameters
    }

    addMessageFactory(messageFactory: (topicParameters?: TopicParameterType) => MqttMessage<any, any, any>) {
        this.messageFactories.push(messageFactory)
    }

    getSubscriptions(topicParameters?: TopicParameterType): string[] {
        let subscriptions = []

        for (let incomingMessageFactory of this.messageFactories) {
            let message = incomingMessageFactory(topicParameters ? topicParameters : this.topicParameters)
            subscriptions.push(message.getSubscription())
        }

        return subscriptions
    }

    async unpack(topic: string, payload: Uint8Array, topicParameters?: TopicParameterType) {
        for (let factory of this.messageFactories) {
            let message = factory(topicParameters ? topicParameters : this.topicParameters)

            if (message.matchTopic(topic)) {
                let misfits = await message.unpackPayload(payload)
                this.emit(message.name, message, misfits)
                break
            }
        }
    }
}
