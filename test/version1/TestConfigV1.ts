import { ConfigV1 } from '../../src'

export function createTestConfigV1() {
    return {
        ais: [
            {
                model: 'Nibiru Anomaly Detector',
                slot: 1,
                training: 1,
                type: 'Anomaly Detection',
                version: 1
            }
        ],
        bluetooth: {
            address: '00:00:00:00:00:11'
        },
        country: 'DE',
        firmware: 'Test Firmware 1',
        firmwareVersion: '1.0.0',
        id: 'test1',
        lan: {
            ip: '192.169.172.100',
            mac: '00:00:00:00:00:22'
        },
        mqtt: {
            api: 'WWT',
            host: null,
            password: null,
            port: null,
            username: null
        },
        name: null,
        project: null,
        sensors: [
            {
                model: 'Infineon IM69D130',
                slot: 1,
                type: 'Audio'
            }
        ],
        wifi: {
            ip: '192.169.172.200',
            mac: '00:00:00:00:00:33',
            password: null,
            ssid: null
        },
    } as ConfigV1
}
