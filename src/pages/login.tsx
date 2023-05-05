import { SignIn } from "@clerk/nextjs";

const Login = () => {
  return <SignIn afterSignInUrl="/" />;
};
export default Login;
