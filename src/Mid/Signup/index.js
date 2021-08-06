import React, { useState, useEffect } from "react";
import "../../css/signup.css";
import { LoginTopBar } from "../TopBar";
import {
    sendRequest,
    EachError,
    Error,
    httpCheck
} from "../../common";



const Feedback = () => {
    return(
        <div className="feedback" style={{ color: "green" }}>
            Verification mail will be sent to this address
        </div>
    );
};

const Middle = ({ showPass, setShowPass, err, setErr }) => {
    const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const passPattern = /\W/g;
    const [all, setAll] = useState({
        email: "",
        confirmEmail: "",
        password: "",
        username: ""
    });
    const { email, password, username } = all;
    const [isLoading, setIsLoading] = useState(false);
    // const [hovered, setHovered] = useState(false);
    // const [focused, setFocused] = useState(false);
    const [eachErr, setEachErr] = useState({
        email: "",
        confirmEmail: "",
        username: "",
        password: ""
    });

    const handleEmail = e => {
        setAll({
            ...all,
            email: e.target.value
        });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ open: false, msg: "" });
        if (!pattern.test(e.target.value) && e.target.value !== "") {
            setEachErr({
                ...eachErr,
                email: "Enter a valid email address"
            });
        } else {
            setEachErr({ ...eachErr, email: "" });
        }
    };

    const handleConfirmEmail = e => {
        setAll({
            ...all,
            confirmEmail: e.target.value
        });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ open: false, msg: "" });
        if (e.target.value !== email && e.target.value !== "") {
            setEachErr({ ...eachErr, confirmEmail: "Email address doesn't match" });
        } else {
            setEachErr({ ...eachErr, confirmEmail: "" });
        }
    };

    const handlePassword = e => {
        setAll({
            ...all,
            password: e.target.value
        });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ open: false, msg: "" });
        if (!passPattern.test(e.target.value) && e.target.value !== "") {
            setEachErr({ ...eachErr, password: "Should have a special character" });
        } else if (e.target.value.length < 8 && e.target.value !== "") {
            setEachErr({ ...eachErr, password: "Should be atleast 8 characters long" });
        } else {
            setEachErr({ ...eachErr, password: "" });
        }
    };

    const handleUsername = e => {
        setAll({
            ...all,
            username: e.target.value
        });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ open: false, msg: "" });
        if (e.target.value.includes("@")) {
            setEachErr({ ...eachErr, username: "Cannot have '@' in username" });
        } else {
            setEachErr({ ...eachErr, username: "" });
        }
    };

    const handleCheckbox = e => {
        setShowPass(e.target.checked);
    };

    const onFocus = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
    };

    const onBlur = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.2)";
    };

    const signUp = async e => {
        e.preventDefault();
        if (all.email === "") {
            setEachErr({ ...eachErr, email: "Can't leave this empty" });
            return;
        } else if (all.confirmEmail === "") {
            setEachErr({ ...eachErr, confirmEmail: "Can't leave this empty" });
            return;
        } else if (all.password === "") {
            setEachErr({ ...eachErr, password: "Can't leave this empty" });
            return;
        } else if (all.username === "") {
            setEachErr({ ...eachErr, username: "Can't leave this empty" });
            return;
        }

        let anyError = false;
        Object.keys(eachErr).forEach(each => {
            if (eachErr[each] !== "") {
                anyError = true;
            }
        });
        if (anyError) {
            return;
        }
        if (isLoading || err.open) {
            return;
        }

        setIsLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: "/signup",
            data: {
                email,
                username,
                password
            }
        });
        setIsLoading(false);

        if (res.error) {
            const newObj = {
                ...err,
                open: true,
                msg: res.error
            };
            setErr(newObj);
            return;
        }
        
        if (res.success) {
            window.location.href = "/login";
        }
    };

    return(
        <>
        <form className="form" onSubmit={signUp}>
            <div className="standard-input">
                <label for="email" className="input-header">What's your email?</label>
                <input name="email" autoComplete="true" className="input-box"
                type="email" placeholder="Enter your email" onChange={handleEmail} spellCheck="false"
                onFocus={onFocus} onBlur={onBlur} />
                { eachErr.email ? <EachError err={eachErr.email} /> : "" }
                { email && !eachErr.email ? <Feedback/> : "" }
            </div>
            <div className="standard-input">
                <label for="email" className="input-header">Confirm your email</label>
                <input name="confirmEmail" autoComplete="true" className="input-box"
                type="email" placeholder="Enter your email again" onChange={handleConfirmEmail} spellCheck="false"
                onFocus={onFocus} onBlur={onBlur} />
                { eachErr.confirmEmail ? <EachError err={eachErr.confirmEmail} /> : "" }
            </div>
            <div className="standard-input">
                <label for="username" className="input-header">Create a username</label>
                <input name="username" className="input-box" type="text" placeholder="Create a username" spellCheck="false"
                onChange={handleUsername} onFocus={onFocus} onBlur={onBlur} />
                { eachErr.username ? <EachError err={eachErr.username} /> : "" }
            </div>
            <div className="standard-input">
                <label for="password" className="input-header">Create a password</label>
                <input name="password" className="input-box" type={ showPass ? "text" : "password" } spellCheck="false"
                placeholder="Create a password" onChange={handlePassword}
                onFocus={onFocus} onBlur={onBlur} />
                { eachErr.password ? <EachError err={eachErr.password} /> : "" }
            </div>
            <div className="standard-input signup-lastpart">
                <div className="leftpart">
                    <input type="checkbox" name="show-password" className="checkbox" onChange={handleCheckbox} />
                    <p>Show password</p>
                </div>
                <div className="rightpart">
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
                                </div> : "SIGN UP"
                        }
                    </button>
                </div>
            </div>
        </form>
        </>
    );
};

const SignUp = () => {
    httpCheck();
    const [err, setErr] = useState({
        open: false,
        msg: ""
    });
    const [showPass, setShowPass] = useState(false);

    const goToGoogle = e => {
        window.location.href = "/login/google";
    };

    useEffect(() => {
        document.title = "Sign Up - Studio";
    }, []);

    return(
        <div className="login">
            <LoginTopBar dark={false}/>
            <div className="loginbody">
                <div className="signupbody-inner">
                    <Error err={err} setErr={setErr} />
                    <p className="standard-p">Sign up for free on Studio.</p>
                    <div className="standard-button" onClick={goToGoogle}>CONTINUE WITH GOOGLE</div>
                    <div className="line-drawer"></div>
                    <Middle showPass={showPass} setShowPass={setShowPass} err={err} setErr={setErr} />
                    <div className="line-drawer bottom"></div>
                    {/* <p className="standard-p">Already have an account?</p> */}
                    <div style={{ width: "100%", height: "40px" }}></div>
                    <div className="standard-button" onClick={() => window.location.href = "/login"}>Already have an account? LOG IN</div>
                    <div style={{ width: "100%", height: "50px" }}></div>
                </div>
            </div>
        </div>
    );
};


export default SignUp;