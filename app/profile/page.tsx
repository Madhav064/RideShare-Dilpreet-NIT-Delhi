"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRideHistory } from "@/hooks/useRideHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, PenLine, Save, Award } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const { rides } = useRideHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const router = useRouter();

  // Loyalty Logic
  const loyaltyStats = useMemo(() => {
    const totalRides = rides.length;
    const totalSpent = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    const points = Math.round(totalRides * 10 + totalSpent);

    let tier = "Bronze";
    let nextTierPoints = 100;
    let progress = 0;

    if (points >= 500) {
      tier = "Gold";
      nextTierPoints = 500; // Cap
      progress = 100;
    } else if (points >= 100) {
      tier = "Silver";
      nextTierPoints = 500;
      progress = ((points - 100) / (500 - 100)) * 100;
    } else {
      progress = (points / 100) * 100;
    }

    return { points, tier, progress, nextTierPoints };
  }, [rides]);

  // Load user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } else if (!isLoading) {
       router.push("/login");
    }
  }, [user, isLoading, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (isLoading) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      
      <Card>
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    <AvatarImage src={user.image} alt={user.firstName} />
                    <AvatarFallback className="text-xl">{user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="text-center">
                <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange}
                disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
             <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                disabled={!isEditing}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          {isEditing ? (
             <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
             </>
          ) : (
             <Button onClick={() => setIsEditing(true)}>
                <PenLine className="h-4 w-4 mr-2" /> Edit Profile
             </Button>
          )}
        </CardFooter>
      </Card>

      {/* Loyalty Program Card */}
      <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" /> 
                    RideShare Club
                </CardTitle>
                <Badge 
                    variant={loyaltyStats.tier === 'Gold' ? 'default' : 'secondary'}
                    className="text-base px-3 py-1"
                >
                    {loyaltyStats.tier} Member
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                    <span>Total Points: {loyaltyStats.points}</span>
                    {loyaltyStats.tier !== 'Gold' && (
                        <span className="text-muted-foreground">{Math.round(loyaltyStats.progress)}% to next tier</span>
                    )}
                </div>
                
                {/* Custom Progress Bar since shadcn/ui progress might not be installed */}
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-in-out" 
                        style={{ width: `${Math.min(100, Math.max(0, loyaltyStats.progress))}%` }}
                    />
                </div>

                <p className="text-sm text-muted-foreground pt-2">
                    You have earned <strong>{loyaltyStats.points}</strong> points! Redeem them for discounts on future rides.
                </p>
                {loyaltyStats.tier === 'Gold' && (
                    <p className="text-xs text-primary font-medium">✨ You are a VIP member! Enjoy priority support and 10% off all rides.</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
