import { BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";
import Main from "./Main";
import Login from "./Login";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import GoogleOAuth from "./Google-OAuth";
import "../css/mid.css";


const Mid = () => {
    return(
        <div className="midpanel">
            <Router>
                <Route exact path="/" component={Main} />
                {/* <Route path="/login" component={Login} /> */}
                {/* <Route path="/signup" component={Signup} /> */}
                {/* <Route path="/verify-email/:userId/:userUUID" component={VerifyEmail} /> */}
                {/* <Route path="/reset-password/:userId/:userUUID" component={ResetPassword} /> */}
                {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
                <Route path="/google-oauth-signin/:userId" component={GoogleOAuth} />
            </Router>
        </div>
    );
};


export default Mid;