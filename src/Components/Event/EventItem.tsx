import React, { Component, RefObject } from 'react';
import Icon from '../Icon';
import calendar_clock_img from '../../Resources/images/calendar-clock.png'
import event_accepted from '../../Resources/images/event-accepted.png'
import event_pending from '../../Resources/images/event-pending.png'
import { CalendarEvent } from './Event';
import { NodeAction } from '../../ServerInterfaces/Requests';


interface Props {
    onDone?: (d : CalendarEvent, a: NodeAction, v: string) => void,     // Called when Event is Set with Data Object that was set
    data: CalendarEvent,
    preset: boolean,                                                    // State of Data being Set or can BE Set
}
interface State {
    finialized: boolean,        // Finalized Event Set
}

class EventItem extends Component<Props, State> {
    private summaryInput:   RefObject<HTMLInputElement>;        // Reference to Input Element
    private timeInput:      RefObject<HTMLInputElement>;        // Reference to Input Element
    private timeType:       RefObject<HTMLSelectElement>;       // Reference to Type of Time
    private actionType:     RefObject<HTMLSelectElement>;       // Reference to Type of Action
    private actionValue:    RefObject<HTMLSelectElement>;       // Reference to Value of Action
    
    constructor(props: Props) {
        super(props);

        // Initiate State
        this.state = {
            finialized: this.props.preset,
        };

        // Bind Member Methods
        this.validateEventInput = this.validateEventInput.bind(this);

        // Initial Member Variables
        this.summaryInput = React.createRef();
        this.timeInput = React.createRef();
        this.timeType = React.createRef();
        this.actionType = React.createRef();
        this.actionValue = React.createRef();
    }

    /**
     * Focuses on Summary Input
     */
    componentDidMount() {
        // Focus on Summary Input
        this.summaryInput.current?.focus();
    }

    private validateEventInput() {
        // Obtain Time Input
        const timeInput = this.timeInput.current ? parseInt(this.timeInput.current.value) : null;
        
        // Validate Summary Input
        if (!this.summaryInput.current?.value) {
            console.log("EMPTY SUMMARY");
            this.summaryInput.current?.classList.add('invalid-entry');
            this.summaryInput.current?.focus();
        }

        // Validate Time Input is a Number | Highlight in Red!
        else if (timeInput === null || timeInput <= 0) {
            console.log("TIME INPUT NON NUMBER");
            this.timeInput.current?.classList.add('invalid-entry');
            this.timeInput.current?.focus();
        }

        // VALID: Apply Data
        else {
            // Remove Classes
            this.summaryInput.current?.classList.remove('invalid-entry');
            this.timeInput.current?.classList.remove('invalid-entry');
            
            // Obtain Parameters
            const summary = this.summaryInput.current?.value;
            const timeType = this.timeType.current?.value;
            const actionType = this.actionType.current?.value as NodeAction || 'setPower';
            const actionValue = this.actionValue.current?.value || "On";

            // Store Summary
            this.props.data.summary = summary;

            // Apply Date based on Time Input
            let dt = timeInput * 1000;
            if (timeType === 'min')
                dt *= 60;
            else if (timeType === 'hr')
                dt *= 60 * 60;
            else if (timeType === 'days')
                dt *= 60 * 60 * 24;
            
            this.props.data.time = new Date(Date.now() + dt);
            
            // All Done :)
            this.setState({ finialized: true });

            // Call onDone with Finished Data!
            // Returning the Data to Event.tsx
            this.props.onDone && this.props.onDone(this.props.data, actionType, actionValue);
        }
    }

    render() {
        return(
            <div>
                {this.state.finialized ?
                    <div className="event-item">            {/* Finalized Event */}
                        <div className="col-2"> <Icon img={calendar_clock_img} width="20px" height="20px" /> </div>
                        <div className="col-6">{this.props.data.summary}</div>
                        <div className="col-2">
                            <strong>{`${this.props.data.time.toDateString()}:`}</strong>
                            <div>{`${this.props.data.time.getHours() % 12}:${this.props.data.time.getMinutes()}:${this.props.data.time.getSeconds()}`}</div>
                        </div>
                    </div>
                    :
                    <div className="event-item"   
                    onKeyDown={(e) => e.key === 'Enter' ? this.validateEventInput() : null}>  {/* Event Setup */}
                        <div className="col-1"
                            onClick={this.validateEventInput}>
                            <Icon
                                mouseOverImg={event_accepted}
                                img={event_pending}
                                width="20px" height="20px" />
                        </div>
                        
                        {/* Summary Input */}
                        <div className="col-6">
                            <input
                                ref={this.summaryInput}
                                type="text" name="summary" id="summary" placeholder="Summary"
                            />

                            <div style={{margin: '2px'}}>
                                <select ref={this.actionType} name="actionType">
                                    <option>setPower</option>
                                </select>
                                <select ref={this.actionValue} name="actionValue">
                                    <option>On</option>
                                    <option>Off</option>
                                </select>
                            </div>
                        </div>

                        {/* Time Input | TODO: Add Styling to Time Type */}
                        <div className="col-1">
                            <input
                                style={{ width: '30px', textAlign: 'right', marginRight: '5px' }}
                                ref={this.timeInput}
                                type="text" name="time" id="time"
                                defaultValue="0"
                            />

                            <select ref={this.timeType} name="timeType">
                                <option>sec</option>
                                <option>min</option>
                                <option>hr</option>
                                <option>days</option>
                            </select>
                        </div>
                    </div>
                }
            </div>
        )
    }

}
export default EventItem;

