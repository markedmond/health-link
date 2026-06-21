/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, AlertCircle, User as UserIcon, MapPin } from "lucide-react";
import { User, UserRole } from "../types";

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("grace.lopez");
  const [pincode, setPincode] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      setErrorMsg("You must read and agree to the National Data Privacy Act guidelines before accessing the system.");
      return;
    }
    
    if (pincode !== "1234" && pincode !== "0000" && pincode !== "password") {
      setErrorMsg("Invalid authorization credentials/password. Pre-filled default is 1234.");
      return;
    }

    const usernameLower = username.toLowerCase();
    let selectedRole: UserRole = "Nurse";
    if (usernameLower.includes("admin") || usernameLower.includes("jellah") || usernameLower.includes("esconde")) {
      selectedRole = "Admin";
    } else if (usernameLower.includes("doctor") || usernameLower.includes("ramon") || usernameLower.includes("santos")) {
      selectedRole = "Doctor";
    } else if (usernameLower.includes("midwife") || usernameLower.includes("luiza") || usernameLower.includes("macapanas")) {
      selectedRole = "Midwife";
    } else {
      selectedRole = "Nurse"; // Default or matches grace.lopez
    }

    // Role licenses/names
    let name = "Grace Lopez, RN";
    let license = "PRC-RN-098541";
    if (selectedRole === "Doctor") {
      name = "Dr. Ramon Santos";
      license = "PRC-MD-012547";
    } else if (selectedRole === "Midwife") {
      name = "Midwife Luiza Macapanas";
      license = "PRC-MW-057812";
    } else if (selectedRole === "Admin") {
      name = "Admin Jellah Mae Esconde";
      license = "BRGY-ADMIN-SANISIDRO";
    }

    onLoginSuccess({
      id: `USR-${selectedRole.toUpperCase()}`,
      name,
      role: selectedRole,
      email: `${selectedRole.toLowerCase()}@sanisidrohealth.org`,
      licenseNumber: license
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex justify-center items-center p-4 md:p-8" id="login_container">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[640px] border border-[#E2E8F0]" id="login_card">
        
        {/* LEFT TEAL PANE */}
        <div className="w-full md:w-[45%] bg-[#0B7886] p-8 md:p-12 flex flex-col justify-between text-white relative">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">HealthLink</h2>
              <p className="text-[10px] text-teal-100/80 font-medium tracking-wide">Barangay Health System</p>
            </div>
          </div>

          {/* Graphic Middle Content */}
          <div className="my-auto py-12 md:py-0">
            <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight leading-tight text-white">
              Vaccination records,<br />built for the barangay.
            </h1>
            <p className="text-teal-50/80 text-sm mt-4 leading-relaxed font-normal max-w-sm">
              Track immunizations, manage citizen records, and generate DOH reports — fully offline, all in one place.
            </p>
          </div>

          {/* Footer Metadata Section */}
          <div className="space-y-4">
            <div className="border-t border-white/15 w-full" />
            <div className="space-y-2 text-xs text-teal-100/95 font-medium">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-teal-200" />
                <span>Brgy. Junob, Dumaguete City</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#34A853] animate-pulse" />
                <span>System online · works without internet</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT WHITE PANE */}
        <div className="w-full md:w-[55%] bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Heading text */}
            <div>
              <h1 className="text-3xl font-bold font-sans text-slate-800 tracking-tight">Welcome back</h1>
              <p className="text-xs text-slate-500 font-medium font-sans mt-1.5">
                Sign in to manage health records and vaccinations.
              </p>
            </div>

            {/* Error Message banner */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#C53030] rounded-xl text-xs flex gap-2 items-start" id="login_error">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#C53030]" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">
                  Username or staff ID
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 flex items-center justify-center">
                    <UserIcon className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="e.g. grace.lopez"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] transition-colors"
                    id="username_input"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 font-sans block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 flex items-center justify-center">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type={showPin ? "text" : "password"}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter your password"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-11 text-slate-800 text-xs tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] transition-colors"
                    id="password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer z-10 flex items-center justify-center"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => alert("Please check default security PIN: 1234")}
                    className="text-[10px] font-bold text-[#0B7886] hover:underline cursor-pointer font-sans"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Data Privacy RA 10173 compliance panel */}
              <div className="bg-[#E6F4F1]/40 border border-[#D1ECE7] rounded-xl p-4.5 space-y-3">
                <div className="flex gap-2.5 items-start">
                  <Shield className="h-4.5 w-4.5 text-[#0B7886] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[#0B7886] uppercase tracking-wide text-[10px] block font-sans">
                      DPA compliance notice (RA 10173)
                    </span>
                    <p className="leading-relaxed text-[10px] text-slate-600 font-medium font-sans">
                      This workstation logs clinical files of Brgy. Junob community members. Authorized staff must restrict screen visibility, logs are audited, and export details require citizen consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox agreement */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1" id="agreement_label">
                <input
                  type="checkbox"
                  required
                  checked={privacyAgreed}
                  onChange={(e) => {
                    setPrivacyAgreed(e.target.checked);
                    setErrorMsg("");
                  }}
                  className="rounded border-[#E2E8F0] bg-white text-[#0B7886] h-4.5 w-4.5 accent-[#0B7886] cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600 hover:text-slate-800 font-sans">
                  I agree to the local Data Privacy guidelines.
                </span>
              </label>

              {/* Sign In action button */}
              <button
                type="submit"
                className="w-full bg-[#0B7886] hover:bg-[#09626C] text-white font-bold rounded-lg py-3.5 text-xs transition-colors shadow-xs cursor-pointer font-sans mt-4"
                id="login_submit_btn"
              >
                Sign in
              </button>
            </form>

            {/* Separator / Footer for the form */}
            <div className="flex items-center pt-2">
              <div className="border-t border-slate-200 flex-grow"></div>
              <span className="mx-4 text-[9px] font-bold text-slate-400 tracking-wider">FOR HEALTH WORKERS ONLY</span>
              <div className="border-t border-slate-200 flex-grow"></div>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-sans leading-relaxed font-semibold">
              Access is limited to registered nurses and midwives at this health center. All activity is logged.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
