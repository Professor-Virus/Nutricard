import { SignIn } from "@clerk/nextjs";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn />
    </div>
  );
}