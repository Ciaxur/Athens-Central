import React, { Component } from 'react';
import { SketchPicker, ColorResult, RGBColor } from 'react-color';
import axios from 'axios';
import './Components.css';
import calendar from '../Resources/images/calendar.png';
import coldTemp from '../Resources/images/cold-temp.png';
import warmTemp from '../Resources/images/warm-temp.png';
import Icon from './Icon';
import Event, { CalendarEvent } from './Event/Event';

const LIGHTS_IP = "192.168.0.97:3000";
const PRESET_CLRS: string[] = [
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#BD10E0',
    '#9013FE',
    '#7ED321',
    '#F5A623',
    '#FFF'
];

interface Props {}
interface States {
    bulbs: BulbsQuery[],                    // List of all Bulbs' Info
    currentBulbAddr: string | null,         // Current Bulb in Focus
    currentEventBulbAddr: string | null,    // Bulb in Forcus for Event
    pickerColor: RGBColor,                  // Color Picker's Current Color
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
    private events: CalendarEvent[][];
    
    constructor(props: Props) {
        super(props);

        // Set inital States
        this.state = {
            bulbs: [],
            currentBulbAddr: null,
            currentEventBulbAddr: null,
            pickerColor: {
                r: 255,
                g: 255,
                b: 255
            }
        };
        
        // Initialize Member Variables
        this.manualUpdate = false;
        this.events = [];
        
        // Bind Methods
        this.bulbTrigger = this.bulbTrigger.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorComplete = this.handleColorComplete.bind(this);
        this.triggerBulbTemperature = this.triggerBulbTemperature.bind(this);
    }

    /**
     * Update Bulb information
     * Create an Interval for Updating every couple
     *  seconds
     */
    componentDidMount() {
        const updateBulbInfo = () => {
            // Query Bulbs
            axios.get(`http://${LIGHTS_IP}/lights`)
                .then(res => {
                    // Sort Results based on Address
                    res.data = (res.data as BulbsQuery[])
                        .sort((a, b) => a.address > b.address ? 1 : -1);

                    // TODO: Obtain Scheduled Event for each Bulb
                    this.events = [];
                    for(const b of res.data as BulbsQuery[]) {
                        // TODO: Implement All Event Data here...
                        const e: CalendarEvent[] = [{
                            summary: `Bulb ${b.address}`,
                            time: new Date(Date.now()),     // TODO: Remove this :)
                        }];
                        this.events.push(e);
                    }
                    
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

    /**
     * Updates the Color Picker's Color State
     *  as soon as Color Changes
     * @param color - Color Result of Picker
     */
    private handleColorChange(color: ColorResult) {
        // Update Color Picker State
        this.setState({ 
            pickerColor: color.rgb
        });
    }

    /**
     * Once Color Change has Complete
     *  Request Bulb Color Change, then
     *  update the Color Icon to match change
     * @param color - Color Result of Color Picker
     */
    private handleColorComplete(color: ColorResult) {
        // Update Light Bulb's Color
        if(!this.state.currentBulbAddr) return;
        axios.post(`http://${LIGHTS_IP}/lights`, {
            bulbAddr:       this.state.currentBulbAddr,
            action:         "rgb",
            rgb:            color.rgb
        }).then(() => {
            // Update Color Icon to match Color Picker on Change
            for(const b of this.state.bulbs) {
                if(b.address === this.state.currentBulbAddr) {
                    // Update RGB Color
                    b.color = {
                        red: this.state.pickerColor.r,
                        blue: this.state.pickerColor.b,
                        green: this.state.pickerColor.g
                    };

                    // Update Temperature Color
                    b.cold_white = 0;
                    b.warm_white = 0;

                    // Make sure that Bulb IS on
                    //  - turns on even if in off state
                    b.power = true;
                    
                    this.manualUpdate = true;
                    this.setState({ currentBulbAddr: b.address });
                    return;
                }
            }
        });
    }

    /**
     * Handle which Bulb Color Icon was picked
     *  to change
     * @param bulb - The Bulb that will be used to change colors
     */
    private handleColorIcon(bulb: BulbsQuery) {
        // Toggle Off if same Bulb
        if(this.state.currentBulbAddr === bulb.address) {
            this.setState({ currentBulbAddr: null });
            return;
        }

        // Set as Current Active Bulb
        // Update Color Picker Color
        this.setState({ 
            currentBulbAddr: bulb.address,
            pickerColor: {
                r: bulb.color.red,
                g: bulb.color.green,
                b: bulb.color.blue
            }
        });
    }

    /**
     * Trigger Cold or Warm White
     * @param bulb - Bulb being Set
     * @param temp - Temperature of Bulb
     */
    private triggerBulbTemperature(bulb: BulbsQuery, temp: 'warm' | 'cold') {
        axios.post(`http://${LIGHTS_IP}/lights`, {
            bulbAddr:       bulb.address,
            action:         temp === 'warm' ? 'setWarm' : 'setCold',
            actionValue:    100
        }).then(() => { // Update State
            this.manualUpdate = true;

            if(temp === 'warm') {
                bulb.warm_white = 100
                bulb.cold_white = 0
            }
            else {
                bulb.warm_white = 0
                bulb.cold_white = 100
            }

            // Reset Color
            bulb.color = { red: 0, green: 0, blue: 0 };

            // Make sure that Bulb IS on
            //  - turns on even if in off state
            bulb.power = true;
            
            this.setState({ bulbs: this.state.bulbs });
        });
    }
    
    render() {
        return (
            <div className="container">

                <div className="col-3"/>
                <div className="col-4 text-left">
                    {/* Display Bulbs and their Current Color States */}
                    {this.state?.bulbs.map((bulb, index) =>
                        <div className="bulb-item" key={index} >
                            
                            {/* Calendar */}
                            <span style={{ cursor: 'pointer' }} onClick={() => this.setState({ currentEventBulbAddr: bulb.address })}>
                                <Icon img={calendar} width="18px" height="18px" />
                            </span>

                            {/* Timed Events */}
                            {(this.state.currentEventBulbAddr && this.state.currentEventBulbAddr === bulb.address)
                                ? <Event data={this.events[index]} />
                                : <span />
                            }
                            

                            {/* Temperatures */}
                            <span 
                                className="clickable" 
                                onClick={() => this.triggerBulbTemperature(bulb, 'cold')} style={{ opacity: bulb.cold_white ? 1.0 : 0.4 }}>

                                <Icon img={coldTemp} width="18px" height="18px" />
                            </span>
                            <span 
                                className="clickable" 
                                onClick={() => this.triggerBulbTemperature(bulb, 'warm')} style={{ opacity: bulb.warm_white ? 1.0 : 0.4 }}>

                                <Icon img={warmTemp} width="18px" height="18px" />
                            </span>

                            {/* Color Indicator */}
                            <span 
                                onClick={() => { this.handleColorIcon(bulb) }} 
                                className="bulb-color" style={{
                                    background: `rgba(${bulb.color.red}, ${bulb.color.green}, ${bulb.color.blue}, ${bulb.power ? 1.0 : 0.1})`
                            }} />


                            {/* Color Wheel Display */}
                            {(this.state.currentBulbAddr !== null && this.state.currentBulbAddr === bulb.address) ?
                                <div style={{ position: 'absolute', zIndex: 2 }}>
                                    <SketchPicker
                                        color={this.state.pickerColor}
                                        onChange={this.handleColorChange}
                                        onChangeComplete={this.handleColorComplete}
                                        presetColors={PRESET_CLRS}
                                    />
                                </div>
                                : <span />
                            }

                            {/* Transparent Clickable Div to Close Color Wheel or Event Menu */}
                            {(this.state.currentBulbAddr !== null && this.state.currentBulbAddr === bulb.address) ||
                                (this.state.currentEventBulbAddr && this.state.currentEventBulbAddr === bulb.address)
                                ? <div style={{
                                    left: 0,
                                    top: 0,
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 1
                                }} onClick={() => { this.setState({ currentBulbAddr: null, currentEventBulbAddr: null }) }}>
                                </div>
                                : <span />
                            }

                            {/* Lamp Name and Address */}
                            <span className="clickable" onClick={() => this.bulbTrigger(bulb)} style={{ opacity: bulb.power ? 1.0 : 0.6 }} >
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