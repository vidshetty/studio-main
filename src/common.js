import React, { useState, useEffect } from "react";
import axios from "axios";
import Close from "../src/assets/close.svg";
// let baseLink = "";
const PRODUCTION = true;



export const sendRequest = async config => {
    let baseLink = "http://localhost:5000";
    // const baseLink = "https://studioserver.herokuapp.com";
    // let baseLink = "http://192.168.29.77:5000";
    // const baseLink = "";

    if (!baseLink) {
        baseLink = await axios({
            method: "GET",
            url: "https://fervent-meninsky-931668.netlify.app/.netlify/functions/serverUrls"
            // url: "https://studio-urls.netlify.app/.netlify/functions/serverUrls"
        }).then(res => res.data.server);
    }

    const baseHeaders = {
        USER: localStorage.getItem("userId") || ""
    };
    let res;

    try {
        res = await axios({
            method: config.method,
            url: (() => {
                if (config.to === "api") {
                    return PRODUCTION ? `/api${config.endpoint}` : `${baseLink}/api${config.endpoint}`;
                }
                return PRODUCTION ? `/api/auth${config.endpoint}` : `${baseLink}/api/auth${config.endpoint}`;
            })(),
            data: config.data || {}
        });
        return res.data;
    } catch (e) {
        console.log("ERROR----",e.message);
        return {};
    }
};

export const httpCheck = () => {
    // if (window.location.protocol !== "https:") {
    //     window.location.protocol = "https:";
    // }
};

const call = async url => {
    await axios({ method: "GET", url });
};

export const serverCall = async () => {
    const { data } = await axios({
        method: "GET",
        url: PRODUCTION ? "/api/auth/server-type" : "http://localhost:5000/api/auth/server-type"
    });

    await Promise.all(data.map(each => call(each)));
};

export const wait = time => {
    return new Promise((res,) => {
        setTimeout(res,time);
    });
}; 

function createGlobalState(initialValue) {
    this.value = initialValue;
    this.subscribers = [];

    this.getValue = function() {
        return this.value;
    }

    this.setValue = function(newState) {
        if (this.getValue() === newState) {
            return
        }
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber(this.value);
        });
    }

    this.subscribe = function(itemToSubscribe) {
        if (this.subscribers.indexOf(itemToSubscribe) !== -1) {
            return
        }
        this.subscribers.push(itemToSubscribe);
    }

    this.unsubscribe = function(itemToUnsubscribe) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }
};

export const CustomUseState = globalState => {
    let [, setState] = useState();
    const state = globalState.getValue();

    function reRender(newState) {
        setState({});
    }

    useEffect(() => {
        globalState.subscribe(reRender);
        return () => {
            globalState.unsubscribe(reRender);
        }
    })

    function setNewState(newState) {
        globalState.setValue(newState);
    }

    return [state, setNewState];
};

export const Error = ({ err, setErr }) => {
    const close = e => {
        setErr({ ...err, open: false });
    };

    const call = async () => {
        close();
        await sendRequest({
            method: "POST",
            endpoint: "/resendVerificationLink",
            data: err.data
        });
    };

    if (err.open) {
        return(
            <div className="standard-error">
                <div>
                    <p>{err.msg}</p>
                    { err.link ? <p className="error-link" onClick={call}>Resend verification email</p> : null }
                </div>
                <img src={Close} alt="" onClick={close} className="close-img" />
            </div>
        );
    }
    return "";
};

export const Feedback = ({ err, setErr }) => {
    const close = () => {
        setErr({ ...err, open: false });
    };

    if (err.open) {
        return(
            <div className="standard-feedback">
                <p>{err.msg}</p>
                <img src={Close} alt="" onClick={close} className="close-img" />
            </div>
        );
    }
    return "";
};

export const EachError = ({ err }) => {
    return(
        <div className="feedback" style={{ color: "red" }}>{err}</div>
    );
};

export const prefix = "/player";
export const basename = "";
// export const prefix = "";
// export const basename = "/player";