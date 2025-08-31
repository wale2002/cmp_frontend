// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LoginForm from "../components/LoginForm";
// import { toast } from "sonner";
// import { authService } from "../services/auth.service";

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (username: string, password: string) => {
//     setLoading(true);
//     setError("");

//     try {
//       if (!username.trim() || !password.trim()) {
//         throw new Error("Username and password are required");
//       }
//       const response = await authService.login(username, password);
//       if (!response.data.user) {
//         throw new Error("Invalid user data in response");
//       }
//       // Assuming useAuth or similar context is used elsewhere for setUser/setIsAuthenticated
//       toast.success("Login successful!");
//       navigate("/dashboard");
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Login failed. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (email: string) => {
//     setLoading(true);
//     setError("");

//     try {
//       if (!email.trim()) {
//         throw new Error("Email is required");
//       }
//       await authService.requestPasswordReset(email);
//       toast.success("Password reset link sent to your email!");
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to send reset email. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LoginForm
//       onLogin={handleLogin}
//       onForgotPassword={handleForgotPassword}
//       loading={loading}
//       error={error}
//     />
//   );
// };

// export default Login;

// Login.tsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../contexts/AuthContext"; // Use useAuthContext instead of useAuth
// import LoginForm from "../components/LoginForm";
// import { toast } from "sonner";
// import { authService } from "../services/auth.service";

// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login, isAuthenticated, isLoading: authLoading } = useAuthContext();

//   useEffect(() => {
//     if (isAuthenticated && !authLoading) {
//       console.log("Login: Auth state confirmed, navigating to dashboard");
//       toast.success("Login successful!");
//       navigate("/dashboard", { replace: true });
//     }
//   }, [isAuthenticated, authLoading, navigate]);

//   const handleLogin = async (username: string, password: string) => {
//     console.log("Login: handleLogin called", {
//       username,
//       password: "[REDACTED]",
//     });
//     setLoading(true);
//     setError("");

//     try {
//       if (!username.trim() || !password.trim()) {
//         throw new Error("Username and password are required");
//       }
//       await login(username, password);
//       console.log("Login: Login request sent");
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Login failed. Please try again.";
//       console.error("Login: Login failed", { errorMessage });
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (email: string) => {
//     console.log("Login: handleForgotPassword called", { email });
//     setLoading(true);
//     setError("");

//     try {
//       if (!email.trim()) {
//         throw new Error("Email is required");
//       }
//       await authService.requestPasswordReset(email);
//       console.log("Login: Password reset request successful", { email });
//       toast.success("Password reset link sent to your email!");
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to send reset email. Please try again.";
//       console.error("Login: Forgot password failed", { errorMessage });
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LoginForm
//       onLogin={handleLogin}
//       onForgotPassword={handleForgotPassword}
//       loading={loading}
//       error={error}
//     />
//   );
// };

// export default Login;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const hasNavigated = useRef(false); // Prevent multiple navigations

  useEffect(() => {
    if (authLoading || hasNavigated.current) return;
    if (isAuthenticated) {
      hasNavigated.current = true;
      console.log("Login: Auth state confirmed, navigating to dashboard");
      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      hasNavigated.current = false;
    };
  }, []);

  const handleLogin = async (username: string, password: string) => {
    console.log("Login: handleLogin called", {
      username,
      password: "[REDACTED]",
    });
    setLoading(true);
    setError("");
    try {
      if (!username.trim() || !password.trim()) {
        throw new Error("Username and password are required");
      }
      await login(username, password);
      console.log("Login: Login request sent");
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        navigate("/dashboard", { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      console.error("Login: Login failed", { errorMessage });
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    console.log("Login: handleForgotPassword called", { email });
    setLoading(true);
    setError("");
    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      await authService.requestPasswordReset(email);
      console.log("Login: Password reset request successful", { email });
      toast.success("Password reset link sent to your email!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.";
      console.error("Login: Forgot password failed", { errorMessage });
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      loading={loading}
      error={error}
    />
  );
};

export default Login;
