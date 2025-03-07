"use client"
import React from 'react'
import logo from '@/assets/logo.png'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../AuthPopup/AuthPopup'

const Navbar = () => {
    const [isloggedin, setIsloggedin] = React.useState<boolean>(false);
    const [showpopup, setShowpopup] = React.useState<boolean>(false);

    // ✅ Use ?? (Nullish Coalescing) to Ensure API URL is Always Defined
    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API ?? "http://localhost:8000";
    
    console.log("🔍 API URL:", BACKEND_API); // Debugging

    const checklogin = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/auth/checklogin`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();
            console.log("✅ Login check response:", data);

            if (data.ok) {
                setIsloggedin(true);
            } else {
                setIsloggedin(false);
            }
        } catch (error) {
            console.error("❌ Login check failed:", error);
        }
    };

    React.useEffect(() => {
        checklogin();
    }, []); // ✅ Runs only once when the component mounts

    return (
        <nav>
            <Image src={logo} alt="Logo" />
            <Link href='/'>Home</Link>
            <Link href='/about'>About</Link>
            <Link href='/profile'><IoIosBody /></Link>
            {
                isloggedin ?
                    <button>Logout</button>
                    :
                    <button
                        onClick={() => {
                            setShowpopup(true);
                        }}
                    >Login</button>
            }

            {
                showpopup && <AuthPopup setShowpopup={setShowpopup} />
            }
        </nav>
    );
};

export default Navbar;
