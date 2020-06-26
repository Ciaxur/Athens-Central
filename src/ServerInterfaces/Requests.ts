// Interface for RGB Data
export interface RGB {
    r: number,
    g: number,
    b: number
}

// Available Node Actions
export type NodeAction = 'setPower' | 'blink' | 'rgb' | 'setCold' | 'setWarm';

// Node Event Execution Request
export interface NodeEventExec {        // Event Execution Object
    action: NodeAction,
    value: RGB | number | boolean,
}

// Node Event Request
export interface NodeEventRequest {
    type: 'event',          // Request Type
    address?: string,        // Node Address
}