import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmailCaptureModal({ open, onOpenChange }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const submitEmailMutation = useMutation({
    mutationFn: async ({ email, firstName }: { email: string; firstName?: string }) => {
      const response = await apiRequest("POST", "/api/email-signup", { email, firstName });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "You'll be notified when Cork launches!",
      });
      // Auto-close after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setIsSubmitted(false);
        setEmail("");
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    submitEmailMutation.mutate({ email, firstName });
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsSubmitted(false);
    setEmail("");
    setFirstName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-grape/20">
        <DialogTitle className="sr-only">Email Signup</DialogTitle>
        <DialogDescription className="sr-only">
          Sign up to be notified when cork launches with our AI wine sommelier.
        </DialogDescription>
        
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center pt-4">
          {!isSubmitted ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-grape to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-poppins font-bold text-slate mb-2">
                Be the First to Know
              </h2>
              
              <p className="text-gray-600 mb-6">
                cork is launching soon! Get notified when our AI wine sommelier becomes available.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full focus:ring-grape focus:border-grape"
                  disabled={submitEmailMutation.isPending}
                />
                
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full focus:ring-grape focus:border-grape"
                  disabled={submitEmailMutation.isPending}
                  required
                />
                
                <Button
                  type="submit"
                  disabled={submitEmailMutation.isPending || !email}
                  className="w-full bg-grape hover:bg-purple-700 text-white font-medium py-3"
                >
                  {submitEmailMutation.isPending ? (
                    "Saving..."
                  ) : (
                    "Notify Me at Launch"
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4">
                We'll only email you when cork launches. No spam, ever.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-poppins font-bold text-slate mb-2">
                You're All Set!
              </h2>
              
              <p className="text-gray-600">
                We'll notify you as soon as cork is available. Check your email for a confirmation message!
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}