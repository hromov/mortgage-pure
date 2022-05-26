'use strict';

/* TODO: is it ok to move this part from index.html just because I have to change parent's class? */
function MenuLinks() {
    return (
        <ul className="menu-links">
            <li>
                <a href="index.html">Home</a>
            </li>
            <li>
                <a href="settings.html">Settings</a>
            </li>
        </ul>
    );
}

const spanBars = [...Array(3)].map((_,index) => <span key={index} className="bar"></span>)

//TODO: is it common practice (onPress) or I'd better move it directly inside Toggle Menu's render()?
const ToggleButton = ({ onPress }) => {
    return (
        <div className="toggle" id="toggle-button" onClick={onPress}>
            {spanBars}
            {/* TODO: or the old one is better */}
            {/* <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span> */}
        </div>
    )
}

class ToggleMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }

    handleClick = () => {
        this.setState({
            active: !this.state.active
        });
    }

    render() {
        return (
            <div className={`react-menu ${this.state.active ? 'active' : ''}`}>
                <ToggleButton onPress={this.handleClick} />
                <MenuLinks />
            </div>
        )
    }
}

const domContainer = document.querySelector('#toggle-container');
ReactDOM.render(<ToggleMenu />, domContainer);