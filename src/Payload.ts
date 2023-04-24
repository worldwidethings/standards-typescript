import { Misfit } from 'knight-validation'

export abstract class Payload<PayloadParameterType> {

    /**
     * Assignes the payload the object and validates it. It will return an array of Misfit objects
     * which represent the found misfits.
     * 
     * @param payload The payload as it was received
     * @returns An array of found payload misfits
     */
    abstract unpack(payload: Uint8Array, parameters?: Partial<PayloadParameterType>): Promise<Misfit[]>

    /**
     * Sets and validates the given payload parameter.
     * 
     * @param parameter The payload parameter to be used to create the final payload
     * @returns An array of found payload parameter misfits
     */
    abstract validate(parameters: Partial<PayloadParameterType>): Promise<Misfit[]>

    /**
     * Create the payload which is used when sending the MQTT message.
     */
    abstract pack(parameters: PayloadParameterType): Uint8Array
}
