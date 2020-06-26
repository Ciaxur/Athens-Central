export interface NodeEvent {
    description: string,            // Description of the Event
    date: Date,                     // Actual Assigned Date of Timeout
}

export interface NodeEventCollection {
    [ipAddr: string]: NodeEvent[],        // Maps Node IP to a Stored Event
}