// app/(auth)/sign-up/page.js
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div>
      <SignUp
        appearance={{
          elements: {
            rootBox:
              "h-screen w-full bg-gray-300 flex items-center justify-center",
          },
        }}
        forceRedirectUrl="/dashboard"
        signInUrl="/signin"
      />
    </div>
  );
}
