import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Signuppage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return <div>Signuppage</div>;
};

export default Signuppage;
