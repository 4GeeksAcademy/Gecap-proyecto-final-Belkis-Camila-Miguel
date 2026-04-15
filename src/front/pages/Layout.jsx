import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";


export const Layout = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === "/" || location.pathname === "/home" || location.pathname.includes("index.html");

    return (
        <ScrollToTop>
            <div className="d-flex" style={{ minHeight: "100vh" }}>

                {!isLandingPage && (
                    <div className="d-print-none">
                        <Sidebar />
                    </div>
                )}

                <div
                    className="flex-grow-1 d-flex flex-column"
                    style={{
                        backgroundImage: `linear-gradient(rgba(235, 242, 241, 0.85), rgba(235, 242, 241, 0.85)), url('/backgroundImg.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        minHeight: "100vh",
                        width: isLandingPage ? "100%" : "auto"
                    }}
                >
                    
                    {isLandingPage && <div className="d-print-none"><Navbar /></div>}

                    <main className={isLandingPage ? "" : "p-4"}>
                        <Outlet />
                    </main>

                    {isLandingPage && <div className="d-print-none"><Footer /></div>}
                </div>
            </div>
        </ScrollToTop>
    );
};