import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { getSession } from "@/lib/helpers/auth-helpers";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { formatDate, getUserNameInitials } from "@/lib/utils";
import EditProfileForm from "@/components/profile/edit-informations-form";
import EditPasswordsForm from "@/components/profile/edit-passwords-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilePage() {
  const session = await getSession();

  const user = session ? await getCurrentUser() : null;
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarFallback className="text-2xl">
              {getUserNameInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Badge variant="secondary">
                {user.role === "CLIENT" ? "Patient" : "Praticien"}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              Création du compte le : {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="cursor-pointer">
            Informations
          </TabsTrigger>
          <TabsTrigger value="security" className="cursor-pointer">
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Informations Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Protégez votre compte avec des paramètres de sécurité avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditPasswordsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
