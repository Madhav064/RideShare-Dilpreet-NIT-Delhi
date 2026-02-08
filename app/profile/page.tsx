"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, PenLine, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const router = useRouter();

  // Load user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "", // dummyjson users have phone
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
    </div>
  );
}
