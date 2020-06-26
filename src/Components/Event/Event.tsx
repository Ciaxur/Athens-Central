import React, { Component } from 'react';
import EventItem from './EventItem';
import axios from 'axios';
import './Event.css';
import '../Components.css';
import { NodeEventExec } from '../../ServerInterfaces/Requests';
import { BulbsQuery } from '../Bulbs';

export interface CalendarEvent {
    summary: string,
    time: Date
}

interface Props {
    data: CalendarEvent[],
    bulb: BulbsQuery,               // Bulb Reference of current Event
}
interface State {
    events: JSX.Element[],
    newEvent: JSX.Element[],          // Event Popup Set
}


class Event extends Component<Props, State> {
    private newEvent: CalendarEvent;

    constructor(props: Props) {
        super(props);

        // Initiate State
        this.state = {
            events: [],
            newEvent: [],
        };

        // Initialize Member Variables
        this.newEvent = {
            summary: '',
            time: new Date(),
        };

        // Populate State with Props
        for (const d of this.props.data) {
            this.state.events.push(
                <EventItem data={d} preset={true} />
            );
        }

        // Bind Methods
        this.addEvent = this.addEvent.bind(this);
    }

    /**
     * Handles Adding a new Event
     * 
     * @param data - The Calendar Event to Add
     * @param update - Whether to update the State or Not
     */
    private addEvent(d: CalendarEvent, update: boolean = false) {
        // Keep Track of Data
        this.props.data.push(d);
        
        // Update the Server
        // DEBUG: Testing out the LOCALHOST Version,
        //   change when done!!!
        axios.post('http://localhost:3000/lights', {
            action: 'event',
            bulbAddr: this.props.bulb.address,
            description: d.summary,
            actionValue: {          // TODO: Testing 
                action: 'setPower',
                value: true,
            } as NodeEventExec,
            eventTime: d.time,
            
        }).then(res => console.log(res.data));
        
        // Update State
        if(update)
            this.setState((prevState) => ({
                events: [...prevState.events, <EventItem data={d} preset={true} />],
            }));
    }

    render() {
        return(
            <div className="event-container" >
                {/* Add Button */}
                <div
                    onClick={() => { this.setState(prevState => ({
                        newEvent: [...prevState.newEvent, <EventItem data={this.newEvent} preset={false} onDone={this.addEvent} />]
                    }))}}
                    className="event-add">+</div>

                {/* SET EVENT: Add a Component that gets the Event Data */}
                {/* {this.state.setEvent && } */}
                {this.state.newEvent.map((val, index) => <span key={index}>{val}</span>)}

                {/* DISPLAY: Display all Event Items */}
                {this.state.events.map((val, index) => <span key={index}>{val}</span>)}
                
            </div>
        )
    }
}
export default Event;