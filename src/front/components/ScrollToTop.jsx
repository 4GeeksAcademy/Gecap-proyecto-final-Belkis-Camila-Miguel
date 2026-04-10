import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = (props) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // Cada vez que el pathname cambie, sube arriba

    return props.children;
};

export default ScrollToTop;