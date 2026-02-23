
"use client"
import React, { useEffect, useState } from "react";

import home_bg from "../../../../../public/assets/images/home_bg.png";
import Image from "next/image";
import LoginForm from "./login-form";
const LoginContainer = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      <div>
        {showSplash ? (
          // First splash image
          <div className="h-screen w-full -mt-32">
            <Image
              src={home_bg}
              alt="auth logo"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          // Second login form screen
          <div className="h-screen bg-[linear-gradient(180deg,_#F1FFC5_0%,_#F6FFDA_54.81%,_#FFFFFF_99.04%)]">
            <div className="w-full h-full lg:h-[86%] flex items-center justify-center">
              <LoginForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default LoginContainer;
