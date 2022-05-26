'use strict';

class ToggleMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }

    handleClick = () => {
        console.log(this)
        this.setState({
            active: !this.state.active
        });
    }

    render() {
        return (
            <div className={`react-menu ${this.state.active ? 'active' : ''}`}>
                <div className="toggle" id="toggle-button" onClick={this.handleClick}>
                    {/* TODO: is it ok or has to be done with help of map? */}
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                {/* TODO: is it ok to move this part from index.html? */}
                <ul class="menu-links">
                    <li>
                        <a href="index.html">Home</a>
                    </li>
                    <li>
                        <a href="settings.html">Settings</a>
                    </li>
                </ul>
            </div>
        )
    }
}

const domContainer = document.querySelector('#toggle-container');
ReactDOM.render(<ToggleMenu />, domContainer);