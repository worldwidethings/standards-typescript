import { expect } from 'chai'
import { Misfit } from 'knight-validation'
import 'mocha'
import { MqttApi, MqttMessage } from '../src'
import { TestMqttMessage, TestMqttPayloadParameters, TestMqttTopicParameters } from './TestMqttMessage'

describe('MqttApi', function() {
    describe('getSubscriptions', function() {
        it('should create an array containing all topic subscriptions using the topic parameters provided through the constructor', function() {
            let api = new MqttApi<TestMqttTopicParameters>('TestApi', { id: 'test1' })
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg1', 'smartsensor/+id/module1', topicParameters))
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg2', 'smartsensor/+id/module2', topicParameters))

            let subscriptions = api.getSubscriptions()

            expect(subscriptions.length).to.equal(2)
            expect(subscriptions[0]).to.equal('smartsensor/test1/module1')
            expect(subscriptions[1]).to.equal('smartsensor/test1/module2')
        })

        it('should create an array containing all topic subscriptions using the topic parameters provided through a parameter', function() {
            let api = new MqttApi<TestMqttTopicParameters>('TestApi', { id: 'test1' })
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg1', 'smartsensor/+id/module1', topicParameters))
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg2', 'smartsensor/+id/module2', topicParameters))

            let subscriptions = api.getSubscriptions({ id: 'test2' })

            expect(subscriptions.length).to.equal(2)
            expect(subscriptions[0]).to.equal('smartsensor/test2/module1')
            expect(subscriptions[1]).to.equal('smartsensor/test2/module2')
        })
    })

    describe('receive', function() {
        it('should call the corresponding handler if a matching topic is received using topic parameters provided through the constructor', async function() {
            let api = new MqttApi<TestMqttTopicParameters>('TestApi', { id: 'test1' })
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg1', 'smartsensor/+id/module1', topicParameters))
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg2', 'smartsensor/+id/module2', topicParameters))

            let msg1Received = false
            let msg1Misfits = false            

            api.on('Msg1', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => {
                msg1Received = true
                msg1Misfits = misfits.length > 0
            })
            
            let msg2Received = false

            api.on('Msg2', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => { msg2Received = true })

            let payloadParameters = {
                parameter: 10
            } as TestMqttPayloadParameters

            let payloadParameterJson = JSON.stringify(payloadParameters)
            let encoder = new TextEncoder
            let payload = encoder.encode(payloadParameterJson)
    
            await api.unpack('smartsensor/test1/module1', payload)

            expect(msg1Received).to.be.true
            expect(msg1Misfits).to.be.false
            expect(msg2Received).to.be.false
        })

        it('should call the corresponding handler if a matching topic is received using the topic parameters provided by a parameter', async function() {
            let api = new MqttApi<TestMqttTopicParameters>('TestApi', { id: 'test1' })
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg1', 'smartsensor/+id/module1', topicParameters))
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg2', 'smartsensor/+id/module2', topicParameters))

            let msg1Received = false
            let msg1Misfits = false            

            api.on('Msg1', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => {
                msg1Received = true
                msg1Misfits = misfits.length > 0
            })
            
            let msg2Received = false
            let msg2Misfits = false

            api.on('Msg2', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => {
                msg2Received = true
                msg2Misfits = misfits.length > 0
            })

            let payloadParameters = {
                parameter: 10
            } as TestMqttPayloadParameters

            let payloadParameterJson = JSON.stringify(payloadParameters)
            let encoder = new TextEncoder
            let payload = encoder.encode(payloadParameterJson)
    
            await api.unpack('smartsensor/test2/module2', payload, { id: 'test2' })

            expect(msg1Received).to.be.false
            expect(msg1Misfits).to.be.false
            expect(msg2Received).to.be.true
            expect(msg2Misfits).to.be.false
        })

        it('should forward misfits if there were any', async function() {
            let api = new MqttApi<TestMqttTopicParameters>('TestApi', { id: 'test1' })
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg1', 'smartsensor/+id/module1', topicParameters))
            api.addMessageFactory((topicParameters?: TestMqttTopicParameters) => new TestMqttMessage('Msg2', 'smartsensor/+id/module2', topicParameters))

            let msg1Received = false
            let msg1Misfits = false            

            api.on('Msg1', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => {
                msg1Received = true
                msg1Misfits = misfits.length > 0
            })
            
            let msg2Received = false

            api.on('Msg2', (message: MqttMessage<any, any, any>, misfits: Misfit[]) => { msg2Received = true })

            let payloadParameters = {
                parameter: -10
            } as TestMqttPayloadParameters

            let payloadParameterJson = JSON.stringify(payloadParameters)
            let encoder = new TextEncoder
            let payload = encoder.encode(payloadParameterJson)
    
            await api.unpack('smartsensor/test1/module1', payload)

            expect(msg1Received).to.be.true
            expect(msg1Misfits).to.be.true
            expect(msg2Received).to.be.false
        })
    })
})