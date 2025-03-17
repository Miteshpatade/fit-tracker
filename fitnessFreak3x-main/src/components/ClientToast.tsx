"use client";  // ✅ Ensure this is at the top

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientToast() {
  console.log("✅ ClientToast Loaded");
  console.log("🔍 ToastContainer:", ToastContainer);  // Debugging

  return (
    <React.Fragment>
    {/* <ToastContainer /> */}
    </React.Fragment>
  );
}
