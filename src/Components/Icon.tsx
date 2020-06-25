import React, { Component } from 'react';

interface Props {
    img: string,
    width: string,
    height: string,
    mouseOverImg?: string,       // Mouse Over Image Transition
}
interface States {
    image: string,              // Current Image to Display
}

class Icon extends Component<Props, States> {
    constructor(props: Props) {
        super(props);

        // Initial State
        this.state = {
            image: this.props.img,
        };

        // Bind Member Methods
        this.handleImageTransition = this.handleImageTransition.bind(this);
    }

    /**
     * Handles Transitioning Regular Image to 
     *  given image
     * @param img - Image to Transition to
     */
    private handleImageTransition(img: string | undefined) {
        if(img)
            this.setState({ image: img });
    }

    render() {
        return (
            <div style={{ display: 'inline-block' }}
                onMouseOver={() => this.handleImageTransition(this.props.mouseOverImg)}
                onMouseLeave={() => this.handleImageTransition(this.props.img)}>
                <img
                    src={this.state.image}
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
