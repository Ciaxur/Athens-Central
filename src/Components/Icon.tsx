import React, { Component } from 'react';

interface Props {
    img: string,
    width: string,
    height: string
}
interface States {}

class Icon extends Component<Props, States> {

    render() {
        return (
            <div style={{display: 'inline-block'}}>
                <img
                    src={this.props.img} 
                    width={this.props.width} 
                    height={this.props.height} 
                    alt="icon"
                    style={{
                        marginRight: '5px',
                        marginBottom: '-4px'
                    }}
                />
            </div>
        )
    }

};
export default Icon;
