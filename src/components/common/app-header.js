import React from 'react';
import './app-header.css';
import { withRouter } from 'react-router-dom';

const AppHeader = (props) => {
    const logout = () => {
        localStorage.clear();
        props.history.push('/')
    }

    return (
        <header>
            <ul>
                <li>
                    <p>{props.name ? props.name : 'Anonymous User'}</p>
                </li>
                <li>
                    <p onClick={logout} className="logout-icon">
                        <i className="pi pi-power-off" style={{ 'cursor': 'pointer' }}></i>
                    </p>
                </li>
            </ul>
        </header>
    )
}

export default withRouter(AppHeader)