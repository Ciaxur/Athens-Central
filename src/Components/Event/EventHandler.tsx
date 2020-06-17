import React, { Component } from 'react';
import EventItem from './EventItem'
import './Event.css';
import '../Components.css';

export interface CalendarEvent {
    summary: string,
    time: string
}

interface Props {
    data: CalendarEvent[]
}
interface State {
    events: JSX.Element[]
}


class Event extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // Initiate State
        this.state = {
            events: []
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
     * Handles Adding a new Event | TODO: Implement non-test me
     */
    private addEvent() {
        this.props.data.push({
            summary: "Test",
            time: "12am"
        });
        
        this.setState((prevState) => ({
            events: [...prevState.events, <EventItem summary="Test" time="12am" />] // TODO: Just Testing
        }));
    }

    render() {
        return(
            <div className="event-container" >
                {/* Add Button | TODO: Add an Icon */}
                <div onClick={this.addEvent} className="event-add">+</div>

                {/* Display all Event Items */}
                {this.state.events.map((val, index) => <span key={index}>{val}</span>)}
                
            </div>
        )
    }
}
export default Event;