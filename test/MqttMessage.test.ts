import { expect } from 'chai'
import 'mocha'
import { TestMqttMessage } from './TestMqttMessage'

describe('MqttMessage', function() {
    describe('getSubscription', function() {
        it('should create a subscription for an empty string', function() {
            let message = new TestMqttMessage('Msg', '')
            expect(message.getSubscription()).to.equal('')
        })

        it('should create a subscription for two empty strings', function() {
            let message = new TestMqttMessage('Msg', '/')
            expect(message.getSubscription()).to.equal('/')
        })

        it('should create a subscription for one parameter', function() {
            let message = new TestMqttMessage('Msg', '+id')
            expect(message.getSubscription()).to.equal('+')
        })

        it('should create a subscription for an empty string followed by a parameter', function() {
            let message = new TestMqttMessage('Msg', '/+id')
            expect(message.getSubscription()).to.equal('/+')
        })

        it('should create a subscription for for an empty parameter followed by an empty string', function() {
            let message = new TestMqttMessage('Msg', '+id/')
            expect(message.getSubscription()).to.equal('+/')
        })

        it('should create a subscription for an empty string, followed by a parameter, followed by an empty string', function() {
            let message = new TestMqttMessage('Msg', '/+id/')
            expect(message.getSubscription()).to.equal('/+/')
        })

        it('should create a subscription with a given topic parameter value', function() {
            let message = new TestMqttMessage('Msg', '/+id/')
            expect(message.getSubscription({ id: 'id1' })).to.equal('/id1/')
        })

        it('should use no parameters', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            expect(message.getSubscription()).to.equal('smartsensor/+/module1')
        })

        it('should use the instance property', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            expect(message.getSubscription()).to.equal('smartsensor/id1/module1')
        })

        it('should use the parameter', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            expect(message.getSubscription({ id: 'id2' })).to.equal('smartsensor/id2/module1')
        })
    })

    describe('matchTopic', function() {
        it('should match an empty string', function() {
            let message = new TestMqttMessage('Msg', '')

            expect(message.matchTopic('')).to.be.true
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('a')).to.be.false
        })

        it('should match two empty strings', function() {
            let message = new TestMqttMessage('Msg', '/')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.true
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
        })

        it('should match three empty strings', function() {
            let message = new TestMqttMessage('Msg', '//')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.true
            expect(message.matchTopic('///')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
            expect(message.matchTopic('/a/b')).to.be.false
            expect(message.matchTopic('a/b/')).to.be.false
        })

        it('should match a non-empty string', function() {
            let message = new TestMqttMessage('Msg', 'a')
            
            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('a')).to.be.true
            expect(message.matchTopic('a/')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
        })

        it('should match two non-empty strings', function() {
            let message = new TestMqttMessage('Msg', 'a/b')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('a/')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
            expect(message.matchTopic('b')).to.be.false
            expect(message.matchTopic('b/')).to.be.false
            expect(message.matchTopic('/b/')).to.be.false
            expect(message.matchTopic('a/b')).to.be.true
            expect(message.matchTopic('/a/b')).to.be.false
            expect(message.matchTopic('a/b/')).to.be.false
            expect(message.matchTopic('/a/b/')).to.be.false
        })

        it('should match a parameter', function() {
            let message = new TestMqttMessage('Msg', '+p1')

            expect(message.matchTopic('')).to.be.true
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('p1/p1')).to.be.false
            expect(message.matchTopic('p1/p1/')).to.be.false
            expect(message.matchTopic('/p1/p1')).to.be.false
            expect(message.matchTopic('/p1/p1/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('p1', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: 'p1' })
        })

        it('should match an empty string followed by a parameter', function() {
            let message = new TestMqttMessage('Msg', '/+p1')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('p1/p1')).to.be.false
            expect(message.matchTopic('p1/p1/')).to.be.false
            expect(message.matchTopic('/p1/p1')).to.be.false
            expect(message.matchTopic('/p1/p1/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('/', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })
            
            let parameters2 = {}
            expect(message.matchTopic('/p1', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })
        })

        it('should match a parameter followed by an empty string', function() {
            let message = new TestMqttMessage('Msg', '+p1/')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('p1/p1')).to.be.false
            expect(message.matchTopic('p1/p1/')).to.be.false
            expect(message.matchTopic('/p1/p1')).to.be.false
            expect(message.matchTopic('/p1/p1/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('/', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })
            
            let parameters2 = {}
            expect(message.matchTopic('p1/', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })

        })

        it('should match a parameter enclosed by two empty strings', function() {
            let message = new TestMqttMessage('Msg', '/+p1/')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('p1/p1')).to.be.false
            expect(message.matchTopic('p1/p1/')).to.be.false
            expect(message.matchTopic('/p1/p1')).to.be.false
            expect(message.matchTopic('/p1/p1/')).to.be.false
            expect(message.matchTopic('p1/p1/p1')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('//', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })

            let parameters2 = {}
            expect(message.matchTopic('/p1/', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })
        })

        it('should match a non-empty string followed by a parameter', function() {
            let message = new TestMqttMessage('Msg', 'a/+p1')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('/a/p1')).to.be.false
            expect(message.matchTopic('a/p1/')).to.be.false
            expect(message.matchTopic('/a/p1/')).to.be.false
            expect(message.matchTopic('b/p1')).to.be.false
            expect(message.matchTopic('/b/p1')).to.be.false
            expect(message.matchTopic('b/p1/')).to.be.false
            expect(message.matchTopic('/b/p1/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('a/', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })

            let parameters2 = {}
            expect(message.matchTopic('a/p1', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })
        })

        it('should match a parameter followed by a non-empty string', function() {
            let message = new TestMqttMessage('Msg', '+p1/b')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('b')).to.be.false
            expect(message.matchTopic('b/')).to.be.false
            expect(message.matchTopic('/b/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('/p1/b')).to.be.false
            expect(message.matchTopic('p1/b/')).to.be.false
            expect(message.matchTopic('/p1/b/')).to.be.false
            expect(message.matchTopic('p1/c')).to.be.false
            expect(message.matchTopic('/p1/c')).to.be.false
            expect(message.matchTopic('p1/c/')).to.be.false
            expect(message.matchTopic('/p1/c/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('/b', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })

            let parameters2 = {}
            expect(message.matchTopic('p1/b', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })
        })

        it('should match a parameter enclosed by two non-empty strings', function() {
            let message = new TestMqttMessage('Msg', 'a/+p1/b')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('///')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('a/')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
            expect(message.matchTopic('a/b')).to.be.false
            expect(message.matchTopic('/a/b')).to.be.false
            expect(message.matchTopic('a/b/')).to.be.false
            expect(message.matchTopic('/a/b/')).to.be.false
            expect(message.matchTopic('/a//b')).to.be.false
            expect(message.matchTopic('a//b/')).to.be.false
            expect(message.matchTopic('/a//b/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('a/p1')).to.be.false
            expect(message.matchTopic('/a/p1')).to.be.false
            expect(message.matchTopic('a/p1/')).to.be.false
            expect(message.matchTopic('/a/p1/')).to.be.false
            expect(message.matchTopic('p1/b')).to.be.false
            expect(message.matchTopic('/p1/b')).to.be.false
            expect(message.matchTopic('p1/b/')).to.be.false
            expect(message.matchTopic('/p1/b/')).to.be.false
            expect(message.matchTopic('p1/c')).to.be.false
            expect(message.matchTopic('/p1/c')).to.be.false
            expect(message.matchTopic('p1/c/')).to.be.false
            expect(message.matchTopic('/p1/c/')).to.be.false
            expect(message.matchTopic('/a/p1/b')).to.be.false
            expect(message.matchTopic('a/p1/b/')).to.be.false
            expect(message.matchTopic('/a/p1/b/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('a//b', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '' })

            let parameters2 = {}
            expect(message.matchTopic('a/p1/b', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1' })
        })

        it('should match a non empty string followed by two parameters', function() {
            let message = new TestMqttMessage('Msg', 'a/+p1/+p2')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('///')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('a/')).to.be.false
            expect(message.matchTopic('/a//')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('a/p1')).to.be.false
            expect(message.matchTopic('/a/p1')).to.be.false
            expect(message.matchTopic('/a/p1/')).to.be.false
            expect(message.matchTopic('/a//p2')).to.be.false
            expect(message.matchTopic('/a//p2/')).to.be.false
            expect(message.matchTopic('/a/p1/p2')).to.be.false
            expect(message.matchTopic('a/p1/p2/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/')).to.be.false
            expect(message.matchTopic('a/p1/p2/b')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b')).to.be.false
            expect(message.matchTopic('a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('a//', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '', p2: '' })

            let parameters2 = {}
            expect(message.matchTopic('a/p1/', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1', p2: '' })

            let parameters3 = {}
            expect(message.matchTopic('a//p2', parameters3)).to.be.true
            expect(parameters3).to.deep.equal({ p1: '', p2: 'p2' })

            let parameters4 = {}
            expect(message.matchTopic('a/p1/p2', parameters4)).to.be.true
            expect(parameters4).to.deep.equal({ p1: 'p1', p2: 'p2' })
        })

        it('should match a two parameters followed by a non-empty string', function() {
            let message = new TestMqttMessage('Msg', '+p1/+p2/b')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('///')).to.be.false
            expect(message.matchTopic('b')).to.be.false
            expect(message.matchTopic('/b')).to.be.false
            expect(message.matchTopic('b/')).to.be.false
            expect(message.matchTopic('/b/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('p2/b')).to.be.false
            expect(message.matchTopic('p2/b/')).to.be.false
            expect(message.matchTopic('/p2/b/')).to.be.false
            expect(message.matchTopic('/p1/p2/b')).to.be.false
            expect(message.matchTopic('p1/p2/b/')).to.be.false
            expect(message.matchTopic('/p1/p2/b/')).to.be.false
            expect(message.matchTopic('a/p1/p2/b')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b')).to.be.false
            expect(message.matchTopic('a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('/p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('p1/p2/p3/b/')).to.be.false
            expect(message.matchTopic('/p1/p2/p3/b/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('//b', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '', p2: '' })

            let parameters3 = {}
            expect(message.matchTopic('p1//b', parameters3)).to.be.true
            expect(parameters3).to.deep.equal({ p1: 'p1', p2: '' })

            let parameters2 = {}
            expect(message.matchTopic('/p2/b', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: '', p2: 'p2' })

            let parameters4 = {}
            expect(message.matchTopic('p1/p2/b', parameters4)).to.be.true
            expect(parameters4).to.deep.equal({ p1: 'p1', p2: 'p2' })

        })

        it('should match a non-empty string followed by two parameters followed by a non-empty string', function() {
            let message = new TestMqttMessage('Msg', 'a/+p1/+p2/b')

            expect(message.matchTopic('')).to.be.false
            expect(message.matchTopic('/')).to.be.false
            expect(message.matchTopic('//')).to.be.false
            expect(message.matchTopic('///')).to.be.false
            expect(message.matchTopic('////')).to.be.false
            expect(message.matchTopic('a')).to.be.false
            expect(message.matchTopic('/a')).to.be.false
            expect(message.matchTopic('a/')).to.be.false
            expect(message.matchTopic('/a/')).to.be.false
            expect(message.matchTopic('b')).to.be.false
            expect(message.matchTopic('/b')).to.be.false
            expect(message.matchTopic('b/')).to.be.false
            expect(message.matchTopic('/b/')).to.be.false
            expect(message.matchTopic('a/b')).to.be.false
            expect(message.matchTopic('/a/b')).to.be.false
            expect(message.matchTopic('a/b/')).to.be.false
            expect(message.matchTopic('/a/b/')).to.be.false
            expect(message.matchTopic('p1')).to.be.false
            expect(message.matchTopic('/p1')).to.be.false
            expect(message.matchTopic('p1/')).to.be.false
            expect(message.matchTopic('/p1/')).to.be.false
            expect(message.matchTopic('p1/p2')).to.be.false
            expect(message.matchTopic('/p1/p2')).to.be.false
            expect(message.matchTopic('p1/p2/')).to.be.false
            expect(message.matchTopic('/p1/p2/')).to.be.false
            expect(message.matchTopic('a/p1')).to.be.false
            expect(message.matchTopic('/a/p1')).to.be.false
            expect(message.matchTopic('a/p1/')).to.be.false
            expect(message.matchTopic('/a/p1/')).to.be.false
            expect(message.matchTopic('p2/b')).to.be.false
            expect(message.matchTopic('/p2/b')).to.be.false
            expect(message.matchTopic('p2/b/')).to.be.false
            expect(message.matchTopic('/p2/b/')).to.be.false
            expect(message.matchTopic('a/p1/b')).to.be.false
            expect(message.matchTopic('/a/p1/b')).to.be.false
            expect(message.matchTopic('a/p1/b/')).to.be.false
            expect(message.matchTopic('/a/p1/b/')).to.be.false
            expect(message.matchTopic('a/p1/p2')).to.be.false
            expect(message.matchTopic('/a/p1/p2')).to.be.false
            expect(message.matchTopic('a/p1/p2/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/')).to.be.false
            expect(message.matchTopic('p1/p2/b')).to.be.false
            expect(message.matchTopic('/p1/p2/b')).to.be.false
            expect(message.matchTopic('p1/p2/b/')).to.be.false
            expect(message.matchTopic('/p1/p2/b/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b')).to.be.false
            expect(message.matchTopic('a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/b/')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3/')).to.be.false
            expect(message.matchTopic('p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('/p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('p1/p2/p3/b/')).to.be.false
            expect(message.matchTopic('/p1/p2/p3/b/')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3/b')).to.be.false
            expect(message.matchTopic('a/p1/p2/p3/b/')).to.be.false
            expect(message.matchTopic('/a/p1/p2/p3/b/')).to.be.false

            let parameters1 = {}
            expect(message.matchTopic('a///b', parameters1)).to.be.true
            expect(parameters1).to.deep.equal({ p1: '', p2: '' })

            let parameters2 = {}
            expect(message.matchTopic('a/p1//b', parameters2)).to.be.true
            expect(parameters2).to.deep.equal({ p1: 'p1', p2: '' })

            let parameters3 = {}
            expect(message.matchTopic('a//p2/b', parameters3)).to.be.true
            expect(parameters3).to.deep.equal({ p1: '', p2: 'p2' })

            let parameters4 = {}
            expect(message.matchTopic('a/p1/p2/b', parameters4)).to.be.true
            expect(parameters4).to.deep.equal({ p1: 'p1', p2: 'p2' })
        })

        it('should use the instance property', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            expect(message.matchTopic('smartsensor/id1/module1')).to.be.true
            expect(message.matchTopic('smartsensor/id2/module1')).to.be.false
            expect(message.topicParameters).to.deep.equal({ id: 'id1' })
        })

        it('should use the instance property and set the missing topic parameter', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            expect(message.matchTopic('smartsensor/id1/module1')).to.be.true
            expect(message.topicParameters).to.be.not.undefined
            expect(message.topicParameters).to.deep.equal({ id: 'id1' })
        })

        it('should use the parameter', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            let parameters = { id: 'id2' }
            expect(message.matchTopic('smartsensor/id1/module1', parameters)).to.be.false
            expect(message.matchTopic('smartsensor/id2/module1', parameters)).to.be.true
            expect(message.topicParameters).to.deep.equal({ id: 'id1' })
            expect(parameters).to.deep.equal({ id: 'id2' })
        })

        it('should use the parameter and set the missing topic parameter', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            let parameters = {}
            expect(message.matchTopic('smartsensor/id2/module1', parameters)).to.be.true
            expect(message.topicParameters).to.deep.equal({ id: 'id1' })
            expect(parameters).to.deep.equal({ id: 'id2' })
        })
    })

    describe('unpackPayload', function() {
        it('should set the payload parameter on the instance property', async function() {
            let payloadJsonObject = { parameter: 1 }
            let json = JSON.stringify(payloadJsonObject)
            let encoder = new TextEncoder
            let payload = encoder.encode(json)
            
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            let misfits = await message.unpackPayload(payload)
            expect(misfits.length).to.equal(0)
            expect(message.payloadParameters).to.be.not.undefined
            expect(message.payloadParameters).to.deep.equal({ parameter: 1 })
        })

        it('should set the payload parameter on the parameter', async function() {
            let payloadJsonObject = { parameter: 1 }
            let json = JSON.stringify(payloadJsonObject)
            let encoder = new TextEncoder
            let payload = encoder.encode(json)
            
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            let payloadParameters = {}
            let misfits = await message.unpackPayload(payload, payloadParameters)
            expect(misfits.length).to.equal(0)
            expect(message.payloadParameters).to.be.undefined
            expect(payloadParameters).to.deep.equal({ parameter: 1 })
        })
    })

    describe('packTopic', function() {
        it('should create an empty topic', function() {
            let message = new TestMqttMessage('Msg', '')
            expect(message.packTopic()).to.equal('')
        })

        it('should create a topic with two empty strings', function() {
            let message = new TestMqttMessage('Msg', '/')
            expect(message.packTopic()).to.equal('/')
        })

        it('should throw an error if a paramter is missing', function() {
            let message = new TestMqttMessage('Msg', '+id')
            expect(() => message.packTopic()).to.throw()
        })

        it('should create a topic with a parameter', function() {
            let message = new TestMqttMessage('Msg', '+id')
            expect(message.packTopic({ id: 'id1' })).to.equal('id1')
        })

        it('should create a topic with an empty string followed by a parameter', function() {
            let message = new TestMqttMessage('Msg', '/+id')
            expect(message.packTopic({ id: 'id1' })).to.equal('/id1')
        })

        it('should create a topic with a parameter followed by an empty string', function() {
            let message = new TestMqttMessage('Msg', '+id/')
            expect(message.packTopic({ id: 'id1' })).to.equal('id1/')
        })

        it('should create a topic with an empty string, followed by a parameter, followed by an empty string', function() {
            let message = new TestMqttMessage('Msg', '/+id/')
            expect(message.packTopic({ id: 'id1' })).to.equal('/id1/')
        })

        it('should throw an error if no topic parameters are given', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            expect(() => message.packTopic()).to.throw()
        })

        it('should use the topic parameters on the instance property', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            expect(message.packTopic()).to.equal('smartsensor/id1/module1')
        })

        it('should use the topic parameters on the instance property', function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1', { id: 'id1' })
            expect(message.packTopic({ id: 'id2' })).to.equal('smartsensor/id2/module1')
        })
    })

    describe('packPayload', function() {
        it('should throw an error if no payload parameters are given', function () {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            expect(() => message.packPayload()).to.throw()
        })

        it('should use the payload parameters on the instance property', function () {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            message.payloadParameters = { parameter: 1 }
            let payload = message.packPayload()

            let decoder = new TextDecoder
            let json = decoder.decode(payload)
            let jsonObject = JSON.parse(json)

            expect(jsonObject).to.deep.equal({ parameter: 1 })
        })

        it('should use the payload parameters on the parameter', function () {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            message.payloadParameters = { parameter: 1 }
            let payload = message.packPayload({ parameter: 2 })

            let decoder = new TextDecoder
            let json = decoder.decode(payload)
            let jsonObject = JSON.parse(json)

            expect(jsonObject).to.deep.equal({ parameter: 2 })
        })
    })

    describe('validatePayloadParameters', function() {
        it('should validate payload parameters on the provided instance property', async function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            message.payloadParameters = { parameter: false as any }
            let misfits = await message.validatePayloadParameters()
            expect(misfits.length).to.equal(1)
        })

        it('should set the payload parameters on the given parameter', async function() {
            let message = new TestMqttMessage('Msg', 'smartsensor/+id/module1')
            message.payloadParameters = { parameter: 1 }
            let misfits = await message.validatePayloadParameters({ parameter: false as any })
            expect(misfits.length).to.equal(1)
        })
    })
})