import React, { Component } from 'react';
import Icon from '../Icon';
import calendar_clock_img from '../../Resources/images/calendar-clock.png'


interface Props {
    onClick?: () => void,
    summary: string,
    time: string
}
interface State {}

class EventItem extends Component<Props, State> {

    render() {
        return(
            <div>
                <div className="event-item">
                    <div className="col-2"> <Icon img={calendar_clock_img} width="20px" height="20px" /> </div>
                    <div className="col-6">{this.props.summary}</div>
                    <div className="col-2">{this.props.time}</div>
                </div>
            </div>
        )
    }

}
export default EventItem;

