import { expect } from 'chai'
import 'mocha'
import { AwsConfigPayloadV1, AwsSetConfigPayloadV1, WwtConfigPayloadV1, WwtSetConfigPayloadV1 } from '../../src'
import { createTestConfigV1 } from './TestConfigV1'

describe('version1', function() {
    describe('PayloadV1', function() {
        describe('WwtConfigPayloadV1', function() {
            describe('unpack', function() {
                it('should return a ValidJson misfit', async function() {
                    let invalidJson = '<xml></xml>'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(invalidJson)
                    
                    let payload = new WwtConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('ValidJson')
                    expect(misfits[0].properties).to.deep.equal([])
                    expect(misfits[0].values).to.be.undefined
                })

                it('should return a TypeOf misfit if the value is an array instead of an object', async function() {
                    let json = '[]'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new WwtConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should return payload misfits', async function() {
                    let payloadJsonObject = { ...createTestConfigV1(), name: false as any }
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new WwtConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should set the payload parameters if there are no misfits', async function() {
                    let payloadJsonObject = createTestConfigV1()
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new WwtConfigPayloadV1
                    let payloadParameters = {}
                    let misfits = await payload.unpack(packed, payloadParameters)

                    expect(misfits.length).to.equal(0)
                    expect(payloadParameters).to.deep.equal(createTestConfigV1())
                })
            })

            describe('validate', function() {
                it('should return payload misfits', async function() {
                    let payload = new WwtConfigPayloadV1
                    let misfits = await payload.validate({ ...createTestConfigV1(), name: false as any })
                    expect(misfits.length).to.equal(1)
                })

                it('should not return payload misfits', async function() {
                    let payload = new WwtConfigPayloadV1
                    let misfits = await payload.validate(createTestConfigV1())
                    expect(misfits.length).to.equal(0)
                })
            })

            describe('pack', function() {
                it('should create the payload', async function() {
                    let payload = new WwtConfigPayloadV1
                    let packed = payload.pack(createTestConfigV1())
                    let decoder = new TextDecoder
                    let json = decoder.decode(packed)
                    let jsonObject = JSON.parse(json)
                    
                    expect(jsonObject).to.deep.equal(createTestConfigV1())
                })
            })
        })

        describe('CoderitterSetPropertiesMqttMessageV1', function() {
            describe('unpack', function() {
                it('should return a ValidJson misfit', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let invalidJson = '<xml></xml>'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(invalidJson)
                    
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('ValidJson')
                    expect(misfits[0].properties).to.deep.equal([])
                    expect(misfits[0].values).to.be.undefined
                })

                it('should return a TypeOf misfit if the value is an array instead of an object', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let json = '[]'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should return payload misfits', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let payloadJsonObject = { name: false }
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should set the payload parameters if there are no misfits', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let payloadJsonObject = { name: 'name' }
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payloadParameters = {}
                    let misfits = await payload.unpack(packed, payloadParameters)

                    expect(misfits.length).to.equal(0)
                    expect(payloadParameters).to.deep.equal({ name: 'name' })
                })
            })

            describe('validate', function() {
                it('should return payload misfits', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let misfits = await payload.validate({ name: false as any })
                    expect(misfits.length).to.equal(1)
                })

                it('should not return payload misfits', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let misfits = await payload.validate({ name: 'name' })
                    expect(misfits.length).to.equal(0)
                })
            })

            describe('pack', function() {
                it('should create the payload', async function() {
                    let payload = new WwtSetConfigPayloadV1
                    let packed = payload.pack({ name: 'name' })
                    let decoder = new TextDecoder
                    let json = decoder.decode(packed)
                    let jsonObject = JSON.parse(json)
                    
                    expect(jsonObject).to.deep.equal({ name: 'name' })
                })
            })
        })

        describe('AwsConfigPayloadV1', function() {
            describe('unpack', function() {
                it('should return a ValidJson misfit', async function() {
                    let invalidJson = '<xml></xml>'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(invalidJson)
                    
                    let payload = new AwsConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('ValidJson')
                    expect(misfits[0].properties).to.deep.equal([])
                    expect(misfits[0].values).to.be.undefined
                })

                it('should return a TypeOf misfit if the value is an array instead of an object', async function() {
                    let json = '[]'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should return payload misfits', async function() {
                    let payloadJsonObject = { state: { reported: { ...createTestConfigV1(), name: false }}}
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should set the payload parameters if there are no misfits', async function() {
                    let payloadJsonObject = { state: { reported: createTestConfigV1() }}
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsConfigPayloadV1
                    let payloadParameters = {}
                    let misfits = await payload.unpack(packed, payloadParameters)

                    expect(misfits.length).to.equal(0)
                    expect(payloadParameters).to.deep.equal(createTestConfigV1())
                })
            })

            describe('validate', function() {
                it('should return payload misfits', async function() {
                    let payload = new AwsConfigPayloadV1
                    let misfits = await payload.validate({ ...createTestConfigV1(), name: false as any })
                    expect(misfits.length).to.equal(1)
                })

                it('should not return payload misfits', async function() {
                    let payload = new AwsConfigPayloadV1
                    let misfits = await payload.validate(createTestConfigV1())
                    expect(misfits.length).to.equal(0)
                })
            })

            describe('pack', function() {
                it('should create the payload', async function() {
                    let payload = new AwsConfigPayloadV1
                    let packed = payload.pack(createTestConfigV1())
                    let decoder = new TextDecoder
                    let json = decoder.decode(packed)
                    let jsonObject = JSON.parse(json)

                    expect(jsonObject).to.deep.equal({ state: { reported: createTestConfigV1() }})
                })
            })
        })

        describe('AwsSetPropertiesMqttMessageV1', function() {
            describe('unpack', function() {
                it('should return a ValidJson misfit', async function() {
                    let invalidJson = '<xml></xml>'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(invalidJson)
                    
                    let payload = new AwsSetConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('ValidJson')
                    expect(misfits[0].properties).to.deep.equal([])
                    expect(misfits[0].values).to.be.undefined
                })

                it('should return a TypeOf misfit if the value is an array instead of an object', async function() {
                    let json = '[]'
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsSetConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should return payload misfits', async function() {
                    let payloadJsonObject = { state: { desired: { name: false }}}
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsSetConfigPayloadV1
                    let misfits = await payload.unpack(packed)

                    expect(misfits.length).to.equal(1)
                    expect(misfits[0].constraint).to.equal('TypeOf')
                })

                it('should set the payload parameters if there are no misfits', async function() {
                    let payloadJsonObject = { state: { desired: { name: 'name' }}}
                    let json = JSON.stringify(payloadJsonObject)
                    let encoder = new TextEncoder
                    let packed = encoder.encode(json)
                    
                    let payload = new AwsSetConfigPayloadV1
                    let payloadParameters = {}
                    let misfits = await payload.unpack(packed, payloadParameters)

                    expect(misfits.length).to.equal(0)
                    expect(payloadParameters).to.deep.equal({ name: 'name' })
                })
            })

            describe('validate', function() {
                it('should return payload misfits', async function() {
                    let payload = new AwsSetConfigPayloadV1
                    let misfits = await payload.validate({ name: false as any })
                    expect(misfits.length).to.equal(1)
                })

                it('should not return payload misfits', async function() {
                    let payload = new AwsSetConfigPayloadV1
                    let misfits = await payload.validate({ name: 'name' })
                    expect(misfits.length).to.equal(0)
                })
            })

            describe('pack', function() {
                it('should not return payload misfits and set the payload parameters', async function() {
                    let payload = new AwsSetConfigPayloadV1
                    let packed = payload.pack({ name: 'name' })
                    let decoder = new TextDecoder
                    let json = decoder.decode(packed)
                    let jsonObject = JSON.parse(json)

                    expect(jsonObject).to.deep.equal({ state: { desired: { name: 'name' }}})
                })
            })
        })
    })
})
