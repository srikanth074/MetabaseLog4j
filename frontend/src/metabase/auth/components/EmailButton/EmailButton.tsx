import React from "react";
import { t } from "ttag";
import AuthButton from "../AuthButton";

const EmailButton = () => {
  return (
    <AuthButton text={t`Sign in with email`} link="/auth/login/password" />
  );
};

export default EmailButton;
