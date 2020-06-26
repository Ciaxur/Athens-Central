import React, { Component, RefObject } from 'react';
import Icon from '../Icon';
import calendar_clock_img from '../../Resources/images/calendar-clock.png'
import event_accepted from '../../Resources/images/event-accepted.png'
import event_pending from '../../Resources/images/event-pending.png'
import { CalendarEvent } from './Event';


interface Props {
    onDone?: (d : CalendarEvent) => void,       // Called when Event is Set with Data Object that was set
    data: CalendarEvent,
    preset: boolean,                            // State of Data being Set or can BE Set
}
interface State {
    finialized: boolean,        // Finalized Event Set
}

class EventItem extends Component<Props, State> {
    private summaryInput: RefObject<HTMLInputElement>;  // Reference to Input Element
    private timeInput: RefObject<HTMLInputElement>;     // Reference to Input Element
    private timeType: RefObject<HTMLSelectElement>;     // Reference to Type of Time
    
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
        
        // Validate Time Input is a Number | Highlight in Red!
        if (timeInput === null) {
            console.log("TIME INPUT NON NUMBER");
        }

        // Validate Summary Input
        else if (!this.summaryInput.current?.value) {
            console.log("EMPTY SUMMARY");
        }

        else {
            const summary = this.summaryInput.current?.value;
            const timeType = this.timeType.current?.value;

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
            this.props.onDone && this.props.onDone(this.props.data);
        }
    }

    render() {
        return(
            <div>
                {this.state.finialized ?
                    <div className="event-item">
                        <div className="col-2"> <Icon img={calendar_clock_img} width="20px" height="20px" /> </div>
                        <div className="col-6">{this.props.data.summary}</div>
                        <div className="col-2">{this.props.data.time.toDateString()}</div>
                    </div>
                    :
                    <div className="event-item">
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

