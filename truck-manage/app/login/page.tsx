"use client";

import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";
import './page.scss';

export default function Login() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: '/' });
  };

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <h1 className="loginTitle">
          <span>Trucking</span>
          <span>Logistics</span>
        </h1>
        
        <div className="loginDescription">
          <p>Streamline Your Logistics Journey</p>
        </div>
        
        <button 
          onClick={handleGoogleSignIn}
          className="googleSignInButton"
        >
          <Chrome className="googleIcon" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}