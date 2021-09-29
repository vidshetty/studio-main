import React, { useState, useEffect } from "react";
import "../../css/reset-password.css";
import { LoginTopBar } from "../TopBar";
import { useParams } from "react-router-dom";
import { InvalidOrNot } from "../VerifyEmail";
import {
    sendRequest,
    Error,
    Feedback,
    EachError,
    httpCheck
} from "../../common";

const styleOptions = {
    width: "80%",
    height: "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "0.8em",
    fontWeight: "500",
    marginTop: "10px"
};



const Middle = ({ showPass, setShowPass, err, setErr, feedback, setFeedback }) => {
    const { userId } = useParams();
    const passPattern = /\W/g;
    const [state, setState] = useState({
        pass: "",
        confirmPass: ""
    });
    const [passErr, setPassErr] = useState("");
    const [confirmPassErr, setConfirmPassErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePassword = e => {
        setState({ ...state, pass: e.target.value });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ ...err, open: false });
        if (!passPattern.test(e.target.value) && e.target.value !== "") {
            setPassErr("Should have a special character");
        } else if (e.target.value.length < 8 && e.target.value !== "") {
            setPassErr("Should be atleast 8 characters long");
        } else {
            setPassErr("");
        }
        if (state.confirmPass !== "" && e.target.value !== state.confirmPass) {
            setConfirmPassErr("Password doesn't match");
        } else {
            setConfirmPassErr("");
        }
    };

    const handleConfirmPassword = e => {
        setState({ ...state, confirmPass: e.target.value });
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
        setErr({ ...err, open: false });
        if (e.target.value !== state.pass && e.target.value !== "") {
            setConfirmPassErr("Password doesn't match");
        } else {
            setConfirmPassErr("");
        }
    };

    const handleCheckbox = e => {
        setShowPass(e.target.checked);
    };

    const resetPassword = async e => {
        e.preventDefault();
        if (isLoading) {
            return;
        }
        if (passErr || confirmPassErr) {
            return;
        }
        setIsLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: "/reset-password",
            data: {
                password: state.pass,
                userId
            }
        });
        setIsLoading(false);
        if (res.status === 404) {
            setErr({
                open: true,
                msg: res.error
            });
        }
        if (res.status === 200) {
            setFeedback({ ...feedback, open: true });
        }
    };

    const onFocus = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.7)";
    };

    const onBlur = e => {
        e.target.style.border = "1px solid rgba(0,0,0,0.2)";
    };

    return(
        <>
        <form className="form" onSubmit={resetPassword}>
            <div className="standard-input">
                <label for="password" className="input-header">Enter your new password</label>
                <input name="password" className="input-box" type={ showPass ? "text" : "password" }
                placeholder="Enter your new password" onChange={handlePassword}
                onFocus={onFocus} onBlur={onBlur} />
                { passErr ? <EachError err={passErr} /> : "" }
            </div>
            <div className="standard-input">
                <label for="confirmPassword" className="input-header">Confirm your password</label>
                <input name="confirmPassword" className="input-box" type={ showPass ? "text" : "password" }
                placeholder="Confirm your password" onChange={handleConfirmPassword}
                onFocus={onFocus} onBlur={onBlur} />
                { confirmPassErr ? <EachError err={confirmPassErr} /> : "" }
            </div>
            <div style={styleOptions}>
                <input type="checkbox" name="show-password" className="checkbox" onChange={handleCheckbox} />
                <p style={{marginLeft: "10px"}}>Show password</p>
            </div>
            <div style={{ width: "100%", height: "40px" }}></div>
            <button className="login-button" type="submit">
                {
                    isLoading ? 
                        <div className="loader">
                            <div className="loaderinner">
                                <div className="one"></div>
                                <div className="two"></div>
                                <div className="three"></div>
                            </div>
                        </div> : "RESET PASSWORD"
                }
            </button>
        </form>
        </>
    );
};

const ResetPassword = () => {
    httpCheck();
    const [showPass, setShowPass] = useState(false);
    const [err, setErr] = useState({ open: false, msg: "" });
    const [feedback, setFeedback] = useState({ open: false, msg: "Your password has been reset." });
    const { userId, userUUID } = useParams();
    const [result, setResult] = useState({});

    const goToClick = e => {
        window.location.href = "/login";
    };

    const call = async () => {
        const res = await sendRequest({
            method: "POST",
            endpoint: "/resetValidityCheck",
            data: {
                userId,
                userUUID
            }
        });
        console.log(res);
        // res.status = 200;
        setResult(res);
    };

    useEffect(() => {
        document.title = "Reset Password - Studio";
        call();
    }, []);

    return(
        <div className="login">
            <div onClick={goToClick}>
                <LoginTopBar dark={false} />
            </div>
            <div className="loginbody">
                <div className="loginbody-inner">
                    <Error err={err} setErr={setErr} />
                    <Feedback err={feedback} setErr={setFeedback} />
                    {
                        result.status === 200 ?
                        <>
                            <p className="standard-p">Reset your password.</p>
                            <div className="line-drawer"></div>
                            <Middle showPass={showPass} setShowPass={setShowPass} err={err}
                            setErr={setErr} feedback={feedback} setFeedback={setFeedback} />
                        </> : null
                    }
                    {
                        result.status === 404 ?
                        <InvalidOrNot val={result.status} /> : null
                    }
                </div>
            </div>
        </div>
    );
};


export default ResetPassword;