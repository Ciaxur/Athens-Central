// Interface for RGB Data
export interface RGB {
    r: number,
    g: number,
    b: number
}

// Node Event Execution Request
export interface NodeEventExec {        // Event Execution Object
    action: 'setPower' | 'blink' | 'rgb' | 'setCold' | 'setWarm',
    value: RGB | number | boolean,
}