import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoginTopBar } from "../TopBar";
import "../../css/login.css";
import "../../css/google-auth.css";
import { sendRequest, EachError, httpCheck, serverCall } from "../../common";
import Button from "../../Button";



const GoogleOAuth = () => {
    httpCheck();
    const { userId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const [user, setUser] = useState({});
    const [username, setUsername] = useState("");
    const [err, setErr] = useState("");
    const [display, setDisplay] = useState({});
    const [showInput, setShowInput] = useState(false);
    const [request, setRequest] = useState({
        button: false,
        loading: false,
        requestSent: false
    });

    const goToLogin = e => {
        window.location.href = "/";
    };

    const handleUsername = e => {
        setUsername(e.target.value);
        if (e.target.value.includes("@")) {
            setErr("Cannot have @ in username");
        } else {
            setErr("");
        }
    };

    const call = async () => {
        const res = await sendRequest({
            method: "POST",
            endpoint: "/oauth-check",
            data: { userId }
        });
        if (res.error) {
            return window.location.href = "/";
        }
        
        const { status, type, set_username, only_button, request_button } = res;

        if (status === 200) {
            // localStorage.setItem("username",res && res.username);
            // localStorage.setItem("userId",res && res.userId);
            // localStorage.setItem("picture",res && res.picture);
            // localStorage.setItem("email",res && res.email);
            return window.location.href = "/player";
        }

        setIsLoading(false);
        setUser(res.user);
        if (set_username) {
            setDisplay({ status, msg: "Your account has been granted access", period: res.period });
            setUsername(res.user.name);
            setShowInput(true);
        } else if (only_button) {
            setDisplay({ status, msg: "", period: res.period });
            setShowInput(false);
        } else if (type === "under_review") {
            setDisplay({ status, msg: "Your account is awaiting approval" });
        } else if (type === "expired") {
            setDisplay({ status, msg: "Your account access has expired" });
        } else if (type === "revoked") {
            setDisplay({ status, msg: "Your account access has been revoked" });
        }

        if (request_button) {
            setRequest(prev => {
                return { ...prev, button: true };
            });
        }

    };

    const submit = async e => {
        e.preventDefault();
        if (err) {
            return;
        }
        setSubmitLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: "/continue-oauth-signin",
            data: { username, userId }
        });
        if (res.error) {
            return window.location.href = "/";
        }
        if (res.success) {
            // localStorage.setItem("username",res && res.username);
            // localStorage.setItem("userId",res && res.userId);
            // localStorage.setItem("picture",res && res.picture);
            // localStorage.setItem("email",res && res.email);
            // return window.location.href = "/player";
            return window.location.href = res.redirectUri;
        }
    };

    const signOut = async e => {
        e.preventDefault();
        setSignOutLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: `/sign-out`,
            data: { userId }
        });
        if (res) {
            window.location.href = "/";
        }
    };

    const requestAccess = async e => {
        setRequest(prev => {
            return { ...prev, loading: true };
        });
        const res = await sendRequest({
            method: "GET",
            endpoint: `/request-access?userId=${user._id}`
        });
        const { requestSent, error } = res;
        if (error) {
            window.location.href = "/";
            return null;
        }
        setRequest(prev => {
            return { ...prev, loading: false, requestSent };
        });
    };

    useEffect(() => {
        serverCall();
        call();
    }, []);

    return(
        <div className="oauth">
            <div onClick={goToLogin}>
                <LoginTopBar dark={true} />
            </div>
            <div className="oauth-body">
                {
                    isLoading ? 
                    <div className="loader" style={{ marginTop: "100px" }}>
                        <div className="loaderinner">
                            <div className="four"></div>
                            <div className="five"></div>
                            <div className="six"></div>
                        </div>
                    </div> :
                    <div className="google-auth-inner">
                        <div style={{ width: "100%", height: "30px" }}></div>
                        <div className="profile-box">
                            <div className="profile-picture">
                                <div className="inner-picture">
                                    <img src={user.picture} alt="" />
                                </div>
                            </div>
                            <div className="profile-details">
                                <div className="middle">
                                    <p className="upper">{user.name}</p>
                                    <p className="lower">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", height: "20px" }}></div>
                        <div className="message" style={{ backgroundColor: `${ display.status === 404 ? "red" : "green" }` }}>
                            <p>{display.msg}</p>
                            { display.period ?
                                display.period === "unlimited" ?
                                null : 
                                <p>{`You have access for ${display.period}`}</p> : null }
                        </div>
                        <div style={{ width: "100%", height: "30px" }}></div>
                        {
                            showInput ?
                            <>
                            <p className="question">Would you want to change your user name?</p>
                            <div style={{ width: "100%", height: "10px" }}></div>
                            <form className="form" onSubmit={submit}>
                                <div className="username-input">
                                    <input type="text" value={username} className="input-box" onChange={handleUsername} />
                                    { err ? <EachError err={err} /> : null }
                                </div>
                                <div style={{ width: "100%", height: "30px" }}></div>   
                            </form>
                            </> : null
                        }
                        {
                            display.status !== 404 ? 
                            <Button className="oauth-button" onClick={submit}>
                                {
                                    submitLoading ? 
                                        <div className="loader">
                                            <div className="loaderinner">
                                                <div className="one"></div>
                                                <div className="two"></div>
                                                <div className="three"></div>
                                            </div>
                                        </div> : "CONTINUE"
                                }
                            </Button> : null
                        }
                        {
                            request.button ?
                            !request.requestSent ?
                            <Button className="oauth-signout-button" onClick={requestAccess}>
                                {
                                    request.loading ?
                                    <div className="loader">
                                        <div className="loaderinner">
                                            <div className="one"></div>
                                            <div className="two"></div>
                                            <div className="three"></div>
                                        </div>
                                    </div> : "REQUEST ACCESS"
                                }
                            </Button> :
                            <div className="oauth-req-sent">REQUEST SENT</div> : 
                            null 
                        }
                        <Button className="oauth-signout-button" onClick={signOut}>
                            {
                                signOutLoading ? 
                                    <div className="loader">
                                        <div className="loaderinner">
                                            <div className="one"></div>
                                            <div className="two"></div>
                                            <div className="three"></div>
                                        </div>
                                    </div> : "SIGN OUT"
                            }
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
};


export default GoogleOAuth;