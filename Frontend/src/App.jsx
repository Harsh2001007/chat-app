import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Router, Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Signuppage from "./pages/Signuppage";
import Loginpage from "./pages/Loginpage";
import Settingpage from "./pages/Settingpage";
import Profilepage from "./pages/Profilepage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isChekingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isChekingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin " />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signuppage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Loginpage /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<Settingpage />} />
        <Route
          path="profile"
          element={authUser ? <Profilepage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
