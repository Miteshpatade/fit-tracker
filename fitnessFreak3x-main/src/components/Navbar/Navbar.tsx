"use client";
import React from "react";
import logo from "@/assets/logo.png";
import { IoIosBody } from "react-icons/io";
import "./Navbar.css";
import Image from "next/image";
import Link from "next/link";
import AuthPopup from "../AuthPopup/AuthPopup";
import { toast } from "react-toastify";

const Navbar = () => {
    const [isloggedin, setIsloggedin] = React.useState<boolean>(false);
    const [showpopup, setShowpopup] = React.useState<boolean>(false);

    // ✅ Use Environment Variable or Default to Localhost
    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API ?? "http://localhost:8000";

    console.log("🔍 API URL:", BACKEND_API); // Debugging

    // ✅ Function to Check Auth Token
    const checkAuthToken = () => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("authToken="))
            ?.split("=")[1];

        console.log("🔑 Auth Token:", token);

        return token ? true : false;
    };

    // ✅ Function to Check Login Status from Backend
    const checkLogin = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/auth/checklogin`, {
                method: "GET", // ✅ Use GET if backend allows
                credentials: "include", // ✅ Ensures cookies are sent
            });

            console.log("🔄 API Response:", response);

            if (!response.ok) {
                throw new Error("Unauthorized or session expired");
            }

            const data = await response.json();
            console.log("✅ Login Check Response:", data);

            setIsloggedin(data.ok);
        } catch (error) {
            console.error("❌ Login Check Failed:", error);
            setIsloggedin(false);
        }
    };

    // ✅ Handle Logout Function
    const handleLogout = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            
            // Clear the cookie even if the API call fails
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsloggedin(false);
            
            if (response.ok) {
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.error("Logout error:", error);
            // Still clear the cookie and state
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsloggedin(false);
        }
    };

    // ✅ Use Effect to Run on Mount
    React.useEffect(() => {
        if (checkAuthToken()) {
            checkLogin();
        }
    }, [showpopup]); // Run when component mounts and when popup is closed

    return (
        <nav>
            <Image src={logo} alt="Logo" />
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">
                <IoIosBody />
            </Link>
            {isloggedin ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={() => setShowpopup(true)}>Login</button>
            )}

            {showpopup && <AuthPopup setShowpopup={setShowpopup} setIsloggedin={setIsloggedin} />}
        </nav>
    );
};

export default Navbar;