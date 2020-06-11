import React, { Component } from 'react';
import axios from 'axios';
import './Bulbs.css';
import calendar from '../Resources/images/calendar.png';
import Icon from './Icon';

const LIGHTS_IP = "192.168.0.97:3000";

interface Props {}
interface States {
    bulbs: BulbsQuery[],
}
interface BulbsQuery {
    name: string,
    address: string,
    power: boolean,
    color: { red: number, green: number, blue: number },
    warm_white: number,
    cold_white: number
};


class Bulbs extends Component<Props, States> {
    // Indicate Manual Bulb State Update so that
    //  interval update doesn't mess with updating States
    private manualUpdate: boolean;
    
    constructor(props: Props) {
        super(props);

        // Set inital States
        this.state = {
            bulbs: []
        };
        this.manualUpdate = false;
        
        // Bind Methods
        this.bulbTrigger = this.bulbTrigger.bind(this);
    }

    componentDidMount() {
        const updateBulbInfo = () => {
            // Query Bulbs
            axios.get(`http://${LIGHTS_IP}/lights`)
                .then(res => {
                    // Sort Results based on Address
                    res.data = (res.data as BulbsQuery[])
                        .sort((a, b) => a.address > b.address ? 1 : -1);
                    
                    // Update State
                    if (!this.manualUpdate) {
                        this.setState({
                            bulbs: res.data
                        });
                    } 
                    
                    // Reset Manual Update State
                    else {
                        this.manualUpdate = false;
                    }

                });
        };
        updateBulbInfo();
        setInterval(updateBulbInfo, 2 * 1000);   // 2 Second Update
    }

    /**
     * Triggers Selected Bulb
     * @param bulb - Bulb to Trigger
     */
    private bulbTrigger(bulb: BulbsQuery) {
        axios.post(`http://${LIGHTS_IP}/lights`, {
            bulbAddr:       bulb.address,
            action:         "setPower",
            actionValue:    !bulb.power
        }).then(() => { // Update State
            this.manualUpdate = true;
            bulb.power =!bulb.power;
            this.setState({bulbs: this.state.bulbs});
        });
    }
    
    render() {
        return (
            <div className="bulb-container">

                <div className="col-3"/>
                <div className="col-3 text-left">
                    {/* Display Bulbs and their Current Color States */}
                    {this.state?.bulbs.map((bulb, index) =>
                        <div className="bulb-item" key={index} >
                            
                            {/* Calendar */}
                            <Icon img={calendar} width="18px" height="18px" />

                            {/* Color Indicator */}
                            <span className="bulb-color" style={{
                                background: `rgba(${bulb.color.red}, ${bulb.color.green}, ${bulb.color.blue}, ${bulb.power ? 1.0 : 0.1})`
                            }} /> 

                            {/* Lamp Name and Address */}
                            <span className="clickable" onClick={() => this.bulbTrigger(bulb)} >
                                {bulb.name} <span style={{ fontSize: '12px' }}> {bulb.address}</span>
                            </span>

                        </div>
                    )}
                </div>
                <div className="col-3"/>

                
            </div>
        )
    }
}
export default Bulbs;