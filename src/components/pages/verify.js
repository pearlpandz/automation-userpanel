import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { BASEURL } from './../config/config.js';
import './verify.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Verify(props) {
    let query = useQuery();

    const [isVerify, setIsVerify] = useState(false)

    useEffect(() => {
        verifyUser();
    })

    const verifyUser = async () => {
        await axios.post(`${BASEURL}/verify`, { token: query.get("auth_token") }).then(response => {
            setIsVerify(true);
            setTimeout(() => {
                props.history.push('/')
            }, 2000);
        }).catch(error => {
            console.log(error.response)

        })
    }

    return (
        <div>
            {isVerify ?
                <div className="verification">
                    <h1>Congratulations!</h1>
                    <h4>You have successfully verified you email with us</h4>
                    <a href="/"> Click here to login</a>
                </div> :
                <div className="loader">
                    <i className="pi pi-spin pi-spinner" style={{ 'fontSize': '2em' }}></i>
                    <h4>Validate and Verifying...</h4>
                </div>
            }
        </div>
    )
}

export default Verify
