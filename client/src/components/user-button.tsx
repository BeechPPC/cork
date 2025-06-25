import { UserButton as ClerkUserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk";

export default function UserButton() {
  if (!isClerkConfigured) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <ClerkUserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-8 h-8"
        }
      }}
    />
  );
}