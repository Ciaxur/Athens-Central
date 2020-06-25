import React, { Component } from 'react';
import EventItem from './EventItem'
import './Event.css';
import '../Components.css';

export interface CalendarEvent {
    summary: string,
    time: Date
}

interface Props {
    data: CalendarEvent[]
}
interface State {
    events: JSX.Element[],
    setEvent: boolean,          // Event Popup Set
}


class Event extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // Initiate State
        this.state = {
            events: [],
            setEvent: false,
        };

        // Populate State with Props
        for(const d of this.props.data) {
            this.state.events.push(
                <EventItem summary={d.summary} time={d.time} />
            );
        }

        // Bind Methods
        this.addEvent = this.addEvent.bind(this);
    }

    /**
     * Handles Adding a new Event
     * 
     * @param summary Summary of Event to be added
     * @param dSeconds Delta Seconds from Now
     */
    private addEvent(summary: string, dSeconds: number) {
        // Construct the Date
        const date = new Date(Date.now() + dSeconds);
        
        // Store Data
        this.props.data.push({
            summary: summary,
            time: date,
        });
        
        // Update State
        this.setState((prevState) => ({
            events: [...prevState.events, <EventItem summary={summary} time={date} />]
        }));
    }

    render() {
        return(
            <div className="event-container" >
                {/* Add Button | TODO: Add an Icon */}
                <div onClick={() => this.setState({ setEvent: true })} className="event-add">+</div>

                {/* TODO: Add a Component that gets the Event Data */}
                {/* {this.state.setEvent && } */}

                {/* Display all Event Items */}
                {this.state.events.map((val, index) => <span key={index}>{val}</span>)}
                
            </div>
        )
    }
}
export default Event;