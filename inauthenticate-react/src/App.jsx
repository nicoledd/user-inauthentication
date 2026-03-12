import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Congrats from "./pages/Congrats";

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [currentUser, setCurrentUser] = useState(() => {
  const savedUser = localStorage.getItem("currentUser");
    return savedUser && savedUser !== "null" ? savedUser : null;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [isLoggedIn, currentUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/congrats" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/congrats"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Congrats
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUser={setCurrentUser}
                currentUser={currentUser} />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;