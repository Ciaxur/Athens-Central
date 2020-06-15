import React, { Component } from 'react';
import axios from 'axios';
import Icon from './Icon';
import bat_full from '../Resources/images/battery/full.png';
import bat_eighty from '../Resources/images/battery/80.png';
import bat_half from '../Resources/images/battery/50.png';
import bat_thirty_five from '../Resources/images/battery/35.png';
import bat_low from '../Resources/images/battery/low.png';


const SERVER_URL = "192.168.0.97:3000";

// Node Object
interface Node {
    name: string,
    address: string,
    battery: number,
    status: 'online' | 'offline'
}


interface Props {}
interface State {
    nodes: Node[]
}

class Nodes extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // Initial States
        this.state = {
            nodes: []
        };

        // Bind Methods
        this.getBatteryImage = this.getBatteryImage.bind(this);
    }
    
    componentDidMount() {
        // Update Nodes
        const updateNodes = () => {
            axios.get(`http://${SERVER_URL}/node`)
                .then(res => res.data)
                .then(data => {
                    this.setState({
                        nodes: data.message as Node[]
                    });
            })
        };
        updateNodes();

        // Every 3 Seconds
        setInterval(updateNodes, 1000 * 3);
    }


    /**
     * Returns the Battery Image according to the 
     *  Battery's Percentage
     * @param batV - Battery Percentage Value
     */
    private getBatteryImage(batV: number): string {
        if(batV > 80.0)
            return bat_full
        else if (batV > 50.0)
            return bat_eighty
        else if (batV > 35)
            return bat_half
        else if(batV > 15)
            return bat_thirty_five
        else
            return bat_low;
    }
    
    render() {
        return (
            <div>
                <div className="col-3" />
                <div className="col-4 text-center">
                    {/* Name, Address, and Battery */}
                    {this.state?.nodes.map((node, index) =>
                        <span key={index} style={{ opacity: node.status === 'online' ? 1.0 : 0.6 }}>
                            <Icon
                                img={this.getBatteryImage(node.battery)}
                                width="18px"
                                height="18px" />
                            {node.name} <span style={{ fontSize: '12px' }}> {node.address} </span>
                        </span>
                    )}
                </div>
                <div className="col-3" />
            </div>
        )
    }
}
export default Nodes;