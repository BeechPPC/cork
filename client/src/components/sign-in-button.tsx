import { SignInButton as ClerkSignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <Button variant="outline">
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}