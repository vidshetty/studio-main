import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoginTopBar } from "../TopBar";
import "../../css/login.css";
import "../../css/google-auth.css";
import { sendRequest, EachError, httpCheck } from "../../common";



const GoogleOAuth = () => {
    httpCheck();
    const { userId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [user, setUser] = useState({});
    const [username, setUsername] = useState("");
    const [err, setErr] = useState("");

    const goToLogin = e => {
        window.location.href = "/login";
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
            return window.location.href = "/login";
        }
        if (res.status && res.status === 404) {
            localStorage.setItem("username",res && res.username);
            localStorage.setItem("userId",res && res.userId);
            localStorage.setItem("picture",res && res.picture);
            localStorage.setItem("email",res && res.email);
            return window.location.href = "/";
        }
        setIsLoading(false);
        setUser(res.user);
        setUsername(res.user.name);
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
            return window.location.href = "/login";
        }
        if (res.success) {
            localStorage.setItem("username",res && res.username);
            localStorage.setItem("userId",res && res.userId);
            localStorage.setItem("picture",res && res.picture);
            localStorage.setItem("email",res && res.email);
            return window.location.href = "/";
        }
    };

    useEffect(() => {
        call();
    }, []);

    return(
        <div className="login">
            <div onClick={goToLogin}>
                <LoginTopBar dark={false} />
            </div>
            <div className="loginbody">
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
                        <div style={{ width: "100%", height: "40px" }}></div>
                        <p>Would you want to change your user name?</p>
                        <div style={{ width: "100%", height: "10px" }}></div>
                        <form className="form" onSubmit={submit}>
                            <div className="standard-input">
                                <input type="text" value={username} className="input-box" onChange={handleUsername} />
                                { err ? <EachError err={err} /> : null }
                            </div>
                            <div style={{ width: "100%", height: "30px" }}></div>   
                            <button className="login-button" type="submit"
                            style={{ width: "80%" }}>
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
                            </button>
                        </form>
                    </div>
                }
            </div>
        </div>
    );
};


export default GoogleOAuth;