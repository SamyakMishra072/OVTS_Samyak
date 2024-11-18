// app/(auth)/sign-in/page.js
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div>
      <SignIn
        appearance={{
          elements: {
            rootBox:
              "h-screen w-full bg-gray-300 flex items-center justify-center",
          },
        }}
        forceRedirectUrl="/dashboard"
        signUpUrl="/signup"
      />
    </div>
  );
}
