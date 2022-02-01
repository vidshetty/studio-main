import React, { useState, useEffect } from "react";
import {
    httpCheck,
    sendRequest,
    serverCall
} from "../../common";
import "../../css/main.css";
import { TopBar, LoginTopBar } from "../TopBar";
import Footer from "../Footer";
// import Logo from "../../assets/latest-blackwhite.svg";
import Logo from "../../assets/latest-whiteblack.svg";


const Center = ({ found, user }) => {
    const [signOutLoading, setSignOutLoading] = useState(false);

    const login = e => {
        window.location.href = "/login/google";
    };

    const player = e => {
        window.location.href = `/player`;
    };

    const signOut = async e => {
        if (signOutLoading) return;
        e.preventDefault();
        setSignOutLoading(true);
        const res = await sendRequest({
            method: "POST",
            endpoint: `/sign-out`,
            data: { userId: user._id }
        });
        if (res) {
            window.location.href = "/";
        }
    };

    return(
        <div className="center">
            {/* <div className="logo-part">
                <img src={Logo} alt="StudioMusic" />
                <p>Studio</p>
            </div> */}
            <p>Music</p>
            <p>for Everyone.</p>
            {
                found === "" ?
                <div className="main-loader">
                    <div className="main-loaderinner">
                        <div className="one"></div>
                        <div className="two"></div>
                        <div className="three"></div>
                    </div>
                </div> : null
            }
            {
                found === false ?
                <button onClick={login} className="gotogoogle">CONTINUE WITH GOOGLE</button> : null }
            {
                found === true ?
                <>
                <button onClick={player} className="gotogoogle">OPEN PLAYER</button>
                <button onClick={signOut} className="gotogoogle" style={{marginTop: "20px"}}>
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
                </button>
                </> : null
            }
        </div>
    );
};

const Item = ({ item }) => {
    const goToAlbum = () => {
        window.location.href = `/player/album/${item._albumId}`;
    };

    return(
        <div className="item" onClick={goToAlbum} title={item.Album}>
            <img src={item.Thumbnail} alt="" />
            <div className="highlight">
                <div className="albumname">{item.Album}</div>
                <div style={{ width: "100%", height: "20px" }}></div>
                <div className="gotoalbum">GO TO ALBUM</div>
            </div>
        </div>
    );
};

const Row = ({ each }) => {
    return(
        <div className="row">
            {
                each.map(item => {
                    return <Item item={item} />;
                })
            }
        </div>
    );
};

const User = ({ user }) => {
    const recents = user.recentlyPlayed || {};

    return(
        <div className="user-container">
            <div className="user-inner-container">
                {
                    Object.keys(recents).length > 0 ?
                    <>
                    <div className="inner-top">Your recent history</div>
                    <div className="inner-display">
                        {
                            Object.keys(recents).map(each => {
                                return <Row each={recents[each]} />;
                            })
                        }
                    </div>
                    </> :
                    <div className="dummy-inner-top"></div>
                }
            </div>
        </div>
    );
};

const Main = () => {
    httpCheck();
    const [user, setUser] = useState({});
    const [found, setFound] = useState("");
    const [event, setEvent] = useState(null);

    const call = async () => {
        const res = await sendRequest({
            method: "GET",
            endpoint: "/whosthis?from=auth",
            to: "api"
        });
        if (res && res.found) {
            setUser(res.user);
            setFound(true);
            return;
        }
        setFound(false);
    };

    const beforeInstall = e => {
        e.preventDefault();
        setEvent(e);
    };

    const click = e => {
        if (!event) return;
        event.prompt();
        event.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
        }).catch(e => console.log("some error",e));
    };

    useEffect(() => {
        serverCall();
        call();
        window.addEventListener("beforeinstallprompt", beforeInstall);
        return () => {
            window.removeEventListener("beforeinstallprompt", beforeInstall);
        };
    }, []);

    return(
        <div className="main-container">
            <TopBar picture={user && user.googleAccount && user.googleAccount.picture} name={user && user.username}
            exists={ Object.keys(user).length === 0 ? false : true } handler={click} event={event} />
            <div className="mainscreen-container">
                {/* <LoginTopBar dark={true} /> */}
                {/* <p className="p-content">Listening is Everything.</p> */}
                <div className="mainscreen">
                    <div className="middle-container">
                        <Center found={found} user={user} />
                    </div>
                </div>
            </div>
            { found ? <User user={user} /> : null }
            <Footer />
        </div>
    );
};


export default Main;