import { Misfit } from 'knight-validation'
import { Configurable } from './Configurable'
import { Payload } from './Payload'

/**
 * This class represents an MQTT message for both the Smart Sensor and the server side. One side
 * will send the message while the other side will receive it. This class can be used to work on
 * either side. The property `toSmartSensor` denotes the direction the message is traveling.
 * 
 * You can use this class for the purpose of either receiving and sending the MQTT messages which 
 * correspond to exactly one specific Smart Sensor or you can use this class to receive MQTT 
 * messages from different Smart Sensors and to gather the data found in these MQTT messages.
 * 
 * This functionality is realised through the `topicParameter` object which contains the typical 
 * parameters that are used to create the MQTT topic string. If you want to receive and send MQTT
 * messages of exactly one specific Smart Sensor, you will set every topic parameter there is.
 * If you want to receive and evaluate MQTT messages from different Smart Sensors, you will use
 * the topic parameters as a filter with which you can widen or narrow down the relevant MQTT 
 * messages.
 * 
 * There are three methods which handle receiving the MQTT message which are `receiveSubscription`,
 * `receiveTopic` and `receivePayload`. You start with `receiveSubscription` to subscribe to the
 * corresponding MQTT topic. Then, when you receive an MQTT message, you can check with `receiveTopic`
 * if its topic matches the given topic parameters. If so, it will extract the missing topic parameters 
 * from the given topic and stores these inside the `topicParameter` property. If the topic matched, you
 * can use use `receivePayload` which takes the payload in its byte form, converts it to a (hopefully)
 * JSON string and validates its properties.
 * 
 * Also, there are three methods which handle sending of MQTT messages which are `sendPayloadParameter`,
 * `sendTopic` and `sendPayload`. You start with `sendPayloadParameter` which will set and validate
 * the parameters that are being used to create the actual payload. Then you use `sendTopic` to
 * get the MQTT topic that is going to be sent. This method will use the `topicParameter` object that
 * you already passed in the constructor. Pay attention that it had set every parameter correctly. At
 * last you use `sendPayload` to get the payload that you are about to send.
 */
export abstract class MqttMessage<ConfigType, TopicParametersType, PayloadParametersType> extends Configurable<ConfigType> {
    /**
     * The name of the message.
     */
    name: string

    /**
     * The topic template.
     */
    topic: string

    /**
     * The message is either sent to the thing or sent from it.
     */
    toThing: boolean

    /**
     * Does the message have a payload.
     */
    // hasPayload: boolean

    payload?: Payload<PayloadParametersType>

    /**
     * The parameters that are typically used in the MQTT topic.
     */
    topicParameters?: TopicParametersType

    /**
     * The parameters that are used to create a payload for that message. The payload might
     * be composed of completely different properties than given through the payload parameters.
     */
     payloadParameters?: PayloadParametersType

     /**
     * The most important parameter here is `topicParameter`. It will determine if you want to
     * use the message object to receive and to send messages of exactly one Smart Sensor or if
     * you want to use it to receive messages from multiple Smart Sensors. If you want to receive
     * messages from multiple Smart Sensors, the `topicParameter` object serves as a filter.
     * 
     * @param name The name of the MQTT message
     * @param toThing Determines if the message is being sent to the thing or not
     * @param payload The payload implementing object
     * @param topic The topic template
     * @param topicParameters The parameters that are being used to create a subscription, to match received topics and to create topics
     * @param payloadParameters The parameters that are being used to create the payload or which are being set from the given payload
     */
    constructor(
        name: string,
        toThing: boolean, 
        topic: string,
        payload?: Payload<PayloadParametersType>, 
        topicParameters?: TopicParametersType, 
        payloadParameters?: PayloadParametersType
    ) {
        super()

        this.name = name
        this.toThing = toThing
        this.payload = payload
        this.topic = topic
        this.topicParameters = topicParameters
        this.payloadParameters = payloadParameters
    }

    /**
     * Returns the string that can be used to subscribe to the MQTT topic.
     * 
     * @returns Topic string.
     */
    getSubscription(parameters?: TopicParametersType): string {
        parameters = parameters || this.topicParameters

        let subscription: string[] = []

        for (let topicPart of this.topic.split('/')) {
            if (topicPart.startsWith('+')) {
                if (parameters) {
                    let parameterName = topicPart.slice(1)

                    if ((parameters as any)[parameterName] !== undefined) {
                        subscription.push((parameters as any)[parameterName])
                    }
                    else {
                        subscription.push('+')
                    }
                }
                else {
                    subscription.push('+')
                }
            }
            else {
                subscription.push(topicPart)
            }
        }

        return subscription.join('/')
    }

    /**
     * Checks if a given topic matches. If it does, it will assign the parameters found in the
     * topic string to the `topicParameter` property.
     * 
     * @param topic The topic as string
     * @returns True if the topic matches the given topic parameters
     */
    matchTopic(topic: string, parameters?: TopicParametersType): boolean {
        if (parameters == undefined && this.topicParameters == undefined) {
            this.topicParameters = {} as any
        }

        parameters = parameters || this.topicParameters
        const splittedTopic = this.topic.split('/')

        let splitTopic = topic.split('/')

        if (splitTopic.length != splittedTopic.length) {
            return false
        }
        
        for (let i = 0; i < splittedTopic.length; i++) {

            if (splitTopic.length < i + 1) {
                return false
            }
            else {
                if (splittedTopic[i].startsWith('+')) {
                    let parameterName = splittedTopic[i].slice(1)

                    if (parameters && (parameters as any)[parameterName] !== undefined) {
                        if (splitTopic[i] != (parameters as any)[parameterName]) {
                            return false
                        }

                        continue
                    }
                    else {
                        if (parameters) {
                            (parameters as any)[parameterName] = splitTopic[i]
                        }

                        continue
                    }
                }
                else {
                    if (splitTopic[i] != splittedTopic[i]) {
                        return false
                    }
                }
            }
        }

        return true
    }

    /**
     * Creates the topic which is used when sending the MQTT message.
     */
    packTopic(parameters?: TopicParametersType): string {
        if (parameters == undefined && this.topicParameters == undefined) {
            throw new Error('To use this method you need to provide topic parameters either through a parameter or through setting the property "topicParameters"')
        }

        parameters = parameters || this.topicParameters
        const splittedTopic = this.topic.split('/')

        let packedTopic: string[] = []

        for (let topicPart of splittedTopic) {
            if (topicPart.startsWith('+')) {
                let parameterName = topicPart.slice(1)

                if(! parameters || parameters && (parameters as any)[parameterName] === undefined) {
                    throw new Error(`Could not create MQTT topic '${splittedTopic.join('/')}'. Parameter '${parameterName}' was not given.`)
                }

                packedTopic.push((parameters as any)[parameterName])
            }
            else {
                packedTopic.push(topicPart)
            }
        }

        return packedTopic.join('/')
    }    

    /**
     * Assignes the payload the object and validates it. It will return an array of Misfit objects
     * which represent the found misfits.
     * 
     * @param payload The payload as it was received
     * @returns An array of found payload misfits
     */
    async unpackPayload(payload: Uint8Array, parameters?: PayloadParametersType): Promise<Misfit[]> {
        if (this.payload) {
            if (parameters == undefined && this.payloadParameters == undefined) {
                this.payloadParameters = {} as any
            }

            return this.payload.unpack(payload, parameters ? parameters : this.payloadParameters)
        }

        return []
    }

    /**
     * Validates the given payload parameters.
     * 
     * @param parameters The payload parameters to be used to create the final payload
     * @returns An array of found payload parameter misfits
     */
    async validatePayloadParameters(parameters?: PayloadParametersType): Promise<Misfit[]> {
        if (this.payload && (parameters != undefined || this.payloadParameters != undefined)) {
            return this.payload.validate(parameters ? parameters : this.payloadParameters!)
        }

        return []
    }
    
    /**
     * Create the payload which is used when sending the MQTT message.
     */
    packPayload(parameters?: PayloadParametersType): Uint8Array {
        if (this.payload) {
            if (parameters == undefined && this.payloadParameters == undefined) {
                throw new Error('To use this method you need to provide payload parameters either through a parameter or through setting the property "payloadParameters"')
            }

            return this.payload.pack(parameters ? parameters : this.payloadParameters!)
        }

        return new Uint8Array
    }
}
