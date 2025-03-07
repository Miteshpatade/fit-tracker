"use client";
import React, { useState } from "react";
import "./AuthPopup.css";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { AiOutlineClose } from "react-icons/ai";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";

// ✅ Backend API URL
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000";

interface AuthPopupProps {
  setShowpopup: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  weightInKg: number;
  heightInCm: number;
  goal: string;
  gender: string;
  dob: string; // ISO formatted string
  activityLevel: string;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ setShowpopup }) => {
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [signupformData, setSignupFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    weightInKg: 0,
    heightInCm: 0,
    goal: "",
    gender: "",
    dob: new Date().toISOString(), // Store dob as an ISO string
    activityLevel: "",
  });

  const [loginformData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Handle Login
  const handleLogin = async () => {
    if (!loginformData.email || !loginformData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginformData),
        credentials: "include",
      });

      const data = await response.json();
      console.log("🔍 Login Response:", data, "✅ Response Status:", response.status);

      if (!response.ok) throw new Error(data.message || "Login failed");

      toast.success("✅ Login successful!");
      setShowpopup(false);
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  // ✅ Handle Signup
  const handleSignup = async () => {
    if (!signupformData.email || !signupformData.password || !signupformData.name) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupformData),
        credentials: "include",
      });

      const data = await response.json();
      console.log("🔍 Signup Response:", data, "✅ Response Status:", response.status);

      if (!response.ok) throw new Error(data.message || "Signup failed");

      toast.success("✅ Signup successful! Please log in.");
      setShowSignup(false);
    } catch (error: any) {
      console.error("❌ Signup Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="popup">
      <button className="close" onClick={() => setShowpopup(false)}>
        <AiOutlineClose />
      </button>
      {showSignup ? (
        <div className="authform">
          <div className="left">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="right">
            <h1>Signup to become a freak</h1>
            <form>
              <Input
                color="warning"
                placeholder="Name"
                size="lg"
                variant="solid"
                onChange={(e) => setSignupFormData({ ...signupformData, name: e.target.value })}
              />
              <Input
                color="warning"
                placeholder="Email"
                size="lg"
                variant="solid"
                onChange={(e) => setSignupFormData({ ...signupformData, email: e.target.value })}
              />
              <Input
                color="warning"
                placeholder="Password"
                size="lg"
                variant="solid"
                type="password"
                onChange={(e) => setSignupFormData({ ...signupformData, password: e.target.value })}
              />
              <Input
                color="warning"
                size="lg"
                variant="solid"
                type="number"
                placeholder="Weight in kg"
                onChange={(e) => setSignupFormData({ ...signupformData, weightInKg: parseFloat(e.target.value) })}
              />
              <Select
                color="warning"
                placeholder="Activity Level"
                size="lg"
                variant="solid"
                onChange={(_, newValue: string | null) =>
                  setSignupFormData({ ...signupformData, activityLevel: newValue || "" })
                }
              >
                <Option value="sedentary">Sedentary</Option>
                <Option value="light">Light</Option>
                <Option value="moderate">Moderate</Option>
                <Option value="active">Active</Option>
                <Option value="veryActive">Very Active</Option>
              </Select>
              <Select
                color="warning"
                placeholder="Goal"
                size="lg"
                variant="solid"
                onChange={(_, newValue: string | null) =>
                  setSignupFormData({ ...signupformData, goal: newValue || "" })
                }
              >
                <Option value="weightLoss">Lose</Option>
                <Option value="weightMaintain">Maintain</Option>
                <Option value="weightGain">Gain</Option>
              </Select>
              <Select
                color="warning"
                placeholder="Gender"
                size="lg"
                variant="solid"
                onChange={(_, newValue: string | null) =>
                  setSignupFormData({ ...signupformData, gender: newValue || "" })
                }
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
              <Input
                color="warning"
                size="lg"
                variant="solid"
                type="number"
                placeholder="Height in cm"
                onChange={(e) => setSignupFormData({ ...signupformData, heightInCm: parseFloat(e.target.value) })}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={dayjs(signupformData.dob)}
                  onChange={(newValue: Dayjs | null) =>
                    setSignupFormData({
                      ...signupformData,
                      dob: newValue ? newValue.toISOString() : new Date().toISOString(),
                    })
                  }
                  sx={{ backgroundColor: "white" }}
                />
              </LocalizationProvider>
              <button onClick={(e) => { e.preventDefault(); handleSignup(); }}>Signup</button>
            </form>
            <p>Already have an account? <button onClick={() => setShowSignup(false)}>Login</button></p>
          </div>
        </div>
      ) : (
        <div className="authform">
          <div className="left">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="right">
            <h1>Login to become a freak</h1>
            <form>
              <Input color="warning" placeholder="Email" size="lg" variant="solid" onChange={(e) => setLoginFormData({ ...loginformData, email: e.target.value })} />
              <Input color="warning" placeholder="Password" size="lg" variant="solid" type="password" onChange={(e) => setLoginFormData({ ...loginformData, password: e.target.value })} />
              <button onClick={(e) => { e.preventDefault(); handleLogin(); }}>Login</button>
            </form>
            <p>Don't have an account? <button onClick={() => setShowSignup(true)}>Signup</button></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopup;
