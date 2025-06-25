import { UserButton as ClerkUserButton } from "@clerk/clerk-react";

export default function UserButton() {
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