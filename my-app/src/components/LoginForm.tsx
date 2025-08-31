// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Alert, AlertDescription } from "../components/ui/alert";
// import { Shield, Lock, User, AlertCircle } from "lucide-react";

// interface LoginFormProps {
//   onLogin: (username: string, password: string) => Promise<void>;
//   onForgotPassword: (email: string) => Promise<void>;
//   loading?: boolean;
//   error?: string;
// }

// const LoginForm = ({
//   onLogin,
//   onForgotPassword,
//   loading,
//   error,
// }: LoginFormProps) => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (showForgotPassword) {
//       await onForgotPassword(email);
//       setShowForgotPassword(false);
//     } else {
//       await onLogin(formData.username, formData.password);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
//       <Card className="w-full max-w-md shadow-strong">
//         <CardHeader className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="p-3 bg-primary-light rounded-full">
//               <Shield className="h-8 w-8 text-primary" />
//             </div>
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold text-primary">
//               ContractHub
//             </CardTitle>
//             <CardDescription className="text-muted-foreground mt-2">
//               {showForgotPassword
//                 ? "Enter your email to reset your password"
//                 : "Secure contract management system"}
//             </CardDescription>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {showForgotPassword ? (
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="username">Username</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="username"
//                       type="text"
//                       placeholder="Enter your username"
//                       value={formData.username}
//                       onChange={(e) =>
//                         setFormData({ ...formData, username: e.target.value })
//                       }
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="Enter your password"
//                       value={formData.password}
//                       onChange={(e) =>
//                         setFormData({ ...formData, password: e.target.value })
//                       }
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//               variant="professional"
//             >
//               {loading
//                 ? "Please wait..."
//                 : showForgotPassword
//                 ? "Send Reset Link"
//                 : "Sign In"}
//             </Button>
//           </form>

//           <div className="text-center space-y-2">
//             <Button
//               variant="link"
//               onClick={() => setShowForgotPassword(!showForgotPassword)}
//               className="text-sm"
//             >
//               {showForgotPassword ? "Back to Login" : "Forgot Password?"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LoginForm;

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const LoginForm = ({
  onLogin,
  onForgotPassword,
  loading,
  error,
}: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm: handleSubmit called", {
      showForgotPassword,
      username: formData.username,
      email,
    });
    try {
      if (showForgotPassword) {
        if (!email.trim()) throw new Error("Email is required");
        console.log("LoginForm: Submitting forgot password", { email });
        await onForgotPassword(email);
        setShowForgotPassword(false);
        setEmail("");
      } else {
        if (!formData.username.trim() || !formData.password.trim()) {
          throw new Error("Username and password are required");
        }
        console.log("LoginForm: Submitting login", {
          username: formData.username,
        });
        await onLogin(formData.username, formData.password);
      }
    } catch (err: unknown) {
      console.error("LoginForm: Submission error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-light rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              ContractHub
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : "Secure contract management system"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {showForgotPassword ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="pl-10"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              variant="professional"
            >
              {loading
                ? "Please wait..."
                : showForgotPassword
                ? "Send Reset Link"
                : "Sign In"}
            </Button>
            {/* <Button
              type="button"
              onClick={() =>
                console.log("Test button clicked", {
                  username: formData.username,
                })
              }
            >
              Test Button
            </Button> */}
          </form>

          <div className="text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setShowForgotPassword(!showForgotPassword)}
              className="text-sm"
            >
              {showForgotPassword ? "Back to Login" : "Forgot Password?"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
