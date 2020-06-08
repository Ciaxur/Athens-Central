import React, { Component } from 'react';
import axios from 'axios';
import './Bulbs.css';

const LIGHTS_IP = "http://localhost:3000";

interface Props {}
interface States {
    bulbs: BulbsQuery[],
}
interface BulbsQuery {
    address: string,
    power: boolean,
    color: { red: number, green: number, blue: number },
    warm_white: number,
    cold_white: number
};


class Bulbs extends Component<Props, States> {
    constructor(props: Props) {
        super(props);

        // Set inital States
        this.state = {
            bulbs: []
        };
        
        // Bind Methods
        this.bulbTrigger = this.bulbTrigger.bind(this);
    }

    componentDidMount() {
        const updateBulbInfo = () => {
            // Query Bulbs
            axios.get(`${LIGHTS_IP}/lights`)
                .then(res => {
                    // Sort Results based on Address
                    res.data = (res.data as BulbsQuery[])
                        .sort((a, b) => a.address > b.address ? 1 : -1);
                    
                    // Update State
                    this.setState({
                        bulbs: res.data
                    });
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
        axios.post(`${LIGHTS_IP}/lights`, {
            bulbAddr:       bulb.address,
            action:         "setPower",
            actionValue:    !bulb.power
        }).then(() => { // Update State
            bulb.power =!bulb.power;
            this.setState({bulbs: this.state.bulbs});
        });
    }
    
    render() {
        return (
            <div>
                {/* Display Bulbs and their Current Color States */}
                { this.state?.bulbs.map((bulb, index) => 
                    <div className="bulb-item" key={index} onClick={() => this.bulbTrigger(bulb)}>
                        <span className="Bulbs-Color" style={{
                            background: `rgb(${bulb.color.red}, ${bulb.color.green}, ${bulb.color.blue})`
                            }}/> {bulb.address} [{bulb.power ? "On" : "Off"}]
                    </div>
                )}
            </div>
        )
    }
}
export default Bulbs;