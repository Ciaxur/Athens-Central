import React, { Component, RefObject } from 'react';
import Icon from '../Icon';
import calendar_clock_img from '../../Resources/images/calendar-clock.png'
import event_accepted from '../../Resources/images/event-accepted.png'
import event_pending from '../../Resources/images/event-pending.png'
import { CalendarEvent } from './Event';


interface Props {
    onClick?: () => void,
    data: CalendarEvent,
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
            finialized: false,
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
        console.log(timeInput);
        
        // Validate Time Input is a Number | Highlight in Red!
        if (timeInput === null) {
            console.log("TIME INPUT NON NUMBER");
        }

        // Validate Summary Input
        else if (!this.summaryInput.current?.value) {
            console.log("EMPTY SUMMARY");
        }

        else {
            // TODO: Somehow Update data in Event.tsx
            const summary = this.summaryInput.current?.value;
            const timeType = this.timeType.current?.value;

            this.props.data.summary = summary;
            this.props.data.time = `${timeInput?.toString()} ${timeType}` || "";

            this.setState({ finialized: true });
        }

        
    }

    render() {
        return(
            <div>
                {this.state.finialized ?
                    <div className="event-item">
                        <div className="col-2"> <Icon img={calendar_clock_img} width="20px" height="20px" /> </div>
                        <div className="col-6">{this.props.data.summary}</div>
                        <div className="col-2">{this.props.data.time}</div>
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

                        {/* Time Input 
                                TODO: Add Styling to Time Type
                        */}
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

