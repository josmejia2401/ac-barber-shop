import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, setUserInfo, getTokenInfo } from "./auth";
import Toast from '../components/toast';

export const AuthContext = React.createContext({
    getUserInfo: getUserInfo,
    setUserInfo: setUserInfo,
    getTokenInfo: getTokenInfo,
});

export const AuthProvider = (props) => {
    const { children } = props;
    return (
        <AuthContext.Provider value={{ getUserInfo, setUserInfo, getTokenInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const RouteComponent = ({ children: Component, ...props }) => {
    const { getTokenInfo } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const notificationRef = React.useRef(null);
    const addNotification = (value) => {
        notificationRef.current.addItem(value);
    }
    React.useEffect(() => {
        const tokenInfo = getTokenInfo();
        if (tokenInfo && ["/auth/login", "/auth/register"].includes(location.pathname)) {
            navigate("/calendar/view");
        } else if (!tokenInfo && !["/auth/login", "/auth/register"].includes(location.pathname)) {
            navigate("/auth/login");
        }
    }, [props?.location?.pathname, getTokenInfo, navigate]);
    return (<>
        <Toast ref={notificationRef} ></Toast>
        <Component
            {...props}
            location={location}
            navigate={navigate}
            addNotification={addNotification}></Component>
    </>);
};