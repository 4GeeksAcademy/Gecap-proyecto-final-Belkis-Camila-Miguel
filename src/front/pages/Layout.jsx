import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";


export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex" style={{ minHeight: "100vh" }}>
                <Sidebar />

                <div
                    className="flex-grow-1 d-flex flex-column"
                    style={{
                        backgroundImage: `linear-gradient(rgba(235, 242, 241, 0.85), rgba(235, 242, 241, 0.85)), url('/backgroundImg.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        minHeight: "100vh"
                    }}
                >
                    <main className="p-4 flex-grow-1">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </ScrollToTop>
    );
};