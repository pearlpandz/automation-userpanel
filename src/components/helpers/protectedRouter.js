import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { Growl } from 'primereact/growl';

class ProtectedRoute extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }

    UNSAFE_componentWillMount() {
        const token = localStorage.getItem('auth_token');
        if (token !== null) {
            this.setState({ isLoggedIn: true })
        }
    }

    componentDidUpdate() {
        const token = localStorage.getItem('auth_token');
        if (token !== null) {
            this.setState({ isLoggedIn: true })
        }
    }

    isExpired = (exp) => {
        if (!exp) {
            return false;
        }
        return Date.now() > exp;
    };

    render() {
        const { isLoggedIn } = this.state;
        const CusComponent = this.props.component;

        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                {isLoggedIn && isLoggedIn ? <CusComponent /> : <Redirect to={{ pathname: '/', error: 'Your sesssion expired!' }} />}
            </div>
        )
    }
}

export default ProtectedRoute;