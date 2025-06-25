import { SignInButton as ClerkSignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/clerk";

export default function SignInButton() {
  if (!isClerkConfigured) {
    return (
      <Button variant="outline" disabled>
        Sign In (Available on getcork.app)
      </Button>
    );
  }

  return (
    <ClerkSignInButton mode="modal">
      <Button variant="outline">
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}