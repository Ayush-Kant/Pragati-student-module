import './App.css'
import { useState } from "react";

import LoginPage from "./features/student/pages/auth/LoginPage";
import RegisterPage from "./features/student/pages/auth/RegisterPage";

function App() {

  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {showLogin ? (
        <LoginPage onNavigate={() => setShowLogin(false)} />
      ) : (
        <RegisterPage onNavigate={() => setShowLogin(true)} />
      )}
    </>
  );
}

export default App;