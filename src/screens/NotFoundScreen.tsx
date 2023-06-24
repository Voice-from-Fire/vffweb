import React from "react";
import logo from "../assets/images/logo.png";

import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";

export function NotFoundScreen() {
  return (
    <LoggedScreenWrapper title="">
      <div>
        <img src={logo} alt="logo" width="200" style={{ padding: 10 }} />
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </LoggedScreenWrapper>
  );
}
