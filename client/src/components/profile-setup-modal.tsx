import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, MapPin, DollarSign, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

const wineTypes = [
  'Red Wine',
  'White Wine', 
  'Rosé Wine',
  'Sparkling Wine',
  'Dessert Wine',
  'Fortified Wine'
];

const experienceLevels = [
  { value: 'novice', label: 'Novice - Just getting started' },
  { value: 'enthusiast', label: 'Enthusiast - I enjoy wine regularly' },
  { value: 'connoisseur', label: 'Connoisseur - I have extensive wine knowledge' }
];

const budgetRanges = [
  { value: 'budget', label: 'Budget-friendly ($10-25)' },
  { value: 'mid-range', label: 'Mid-range ($25-60)' },
  { value: 'premium', label: 'Premium ($60-150)' },
  { value: 'luxury', label: 'Luxury ($150+)' }
];

export default function ProfileSetupModal({ open, onComplete }: ProfileSetupModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();
  
  // Required fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Optional fields
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedWineTypes, setSelectedWineTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState('');
  const [location, setLocation] = useState('');

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const isValidAge = dateOfBirth ? calculateAge(dateOfBirth) >= 18 : false;

  const handleWineTypeToggle = (wineType: string) => {
    setSelectedWineTypes(prev => 
      prev.includes(wineType) 
        ? prev.filter(type => type !== wineType)
        : [...prev, wineType]
    );
  };

  const handleComplete = async () => {
    if (!dateOfBirth || !acceptedTerms || !isValidAge) {
      toast({
        title: "Required Information Missing",
        description: "Please complete all required fields and confirm you're 18 or older.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting profile setup:", {
        dateOfBirth,
        wineExperienceLevel: experienceLevel || null,
        preferredWineTypes: selectedWineTypes.length > 0 ? selectedWineTypes : null,
        budgetRange: budgetRange || null,
        location: location || null,
      });

      // Get Clerk auth token
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not available");
      }

      const requestData = {
        dateOfBirth,
        wineExperienceLevel: experienceLevel || null,
        preferredWineTypes: selectedWineTypes.length > 0 ? selectedWineTypes : null,
        budgetRange: budgetRange || null,
        location: location || null,
      };

      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Invalidate user data to refresh profile
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Profile Complete!",
        description: "Welcome to Cork! Your wine journey begins now.",
      });

      onComplete();
    } catch (error) {
      console.error("Profile setup error:", error);
      toast({
        title: "Setup Failed",
        description: `There was an error setting up your profile: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!dateOfBirth || !acceptedTerms || !isValidAge)) {
      toast({
        title: "Age Verification Required",
        description: "Please confirm your date of birth and that you're 18 or older.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate">
            Welcome to cork!
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-grape mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate mb-2">Age Verification</h3>
              <p className="text-gray-600 text-sm">
                cork is an alcohol-related service. You must be 18 or older to continue.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate">
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
                {dateOfBirth && !isValidAge && (
                  <p className="text-sm text-red-600 mt-1">
                    You must be 18 or older to use cork.
                  </p>
                )}
                {dateOfBirth && isValidAge && (
                  <p className="text-sm text-green-600 mt-1">
                    Age verified - you're {calculateAge(dateOfBirth)} years old.
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I confirm that I am 18 years or older and agree to receive wine recommendations and alcohol-related content.
                </Label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={nextStep}
                disabled={!dateOfBirth || !acceptedTerms || !isValidAge}
                className="flex-1 bg-grape hover:bg-purple-700"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-grape mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate mb-2">Personalize Your Experience</h3>
              <p className="text-gray-600 text-sm">
                Help us recommend the perfect wines for you (optional)
              </p>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              <div>
                <Label className="text-sm font-medium text-slate flex items-center mb-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Wine Experience Level
                </Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate mb-3 block">
                  Preferred Wine Types (select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {wineTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedWineTypes.includes(type)}
                        onCheckedChange={() => handleWineTypeToggle(type)}
                      />
                      <Label htmlFor={type} className="text-sm text-gray-700">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate flex items-center mb-2">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Typical Budget Range
                </Label>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your typical budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-slate flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location (for regional recommendations)
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Sydney, Melbourne, Perth..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-grape hover:bg-purple-700"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}