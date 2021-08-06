import React, { useState, useEffect } from "react";
import {
    sendRequest,
    Error,
    Feedback,
    EachError,
    httpCheck
} from "../../common";
import "../../css/forgot-password.css";
import "../../css/login.css";
import { LoginTopBar } from "../TopBar";



const ForgotPassword = () => {
    httpCheck();
    const [email, setEmail] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [err, setErr] = useState({
        open: false,
        msg: "",
        link: false,
        data: {}
    });
    const [feedback, setFeedback] = useState({ open: false, msg: "Reset link has been sent to this email." });
    const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const [emailErr, setEmailErr] = useState("");
    // const [hovered, setHovered] = useState(false);
    // const [focused, setFocused] = useState(false);

    const handleEmail = e => {
        setEmail(e.target.value);
        setErr({ open: false, msg: "" });
        setFeedback({ ...feedback, open: false });
        if (!pattern.test(e.target.value) && e.target.value !== "") {
            setEmailErr("Enter a valid email address");
        } else {
            setEmailErr("");
        }
    };

    const submit = async e => {
        e.preventDefault();
        if (err.open) {
            setErr({ ...err, open: false });
        }

        if (email === "") {
            setEmailErr("Can't leave this empty");
            return;
        }

        setLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: "/forgot-password",
            data: {
                email
            }
        });
        setLoading(false);

        if (res.success) {
            setFeedback({ ...feedback, open: true });
        } else {
            setErr({
                open: true,
                msg: res.error,
                link: res.link,
                data: res.data
            });
        }
    };

    const goToLogin = e => {
        window.location.href = "/login";
    };

    useEffect(() => {
        document.title = "Forgot Password - Studio";
    }, []);

    return(
        <div className="login">
            <div onClick={goToLogin}>
                <LoginTopBar dark={false}/>
            </div>
            <Error err={err} setErr={setErr} />
            <Feedback err={feedback} setErr={setFeedback} />
            <div className="loginbody">
                <div className="loginbody-inner">
                    <div style={{ width: "100%", height: "30px" }}></div>
                    <form className="form" onSubmit={submit}>
                        <div className="standard-input">
                            <label for="email" className="input-header">Enter your email address</label>
                            <input name="email" autoComplete="true" className="input-box"
                            type="text" placeholder="Enter your email address" onChange={handleEmail} />
                            { emailErr ? <EachError err={emailErr} /> : "" }
                        </div>
                        <div style={{ width: "100%", height: "40px" }}></div>
                        <button className="login-button" type="submit"
                        // onFocus={() => setFocused(true)}
                        // onBlur={() => setFocused(false)}
                        // onMouseOver={() => setHovered(true)}
                        // onMouseOut={() => setHovered(false)}
                        // style={{ backgroundColor: `${ isLoading || hovered || focused ? "#006bff" : "transparent" }` }}
                        >
                            {
                                isLoading ? 
                                    <div className="loader">
                                        <div className="loaderinner">
                                            <div className="one"></div>
                                            <div className="two"></div>
                                            <div className="three"></div>
                                        </div>
                                    </div> : "SEND RESET LINK"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default ForgotPassword;