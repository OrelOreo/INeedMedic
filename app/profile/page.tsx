import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">John Doe</h1>
              <Badge variant="secondary">Patient</Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              Membre depuis janvier 2024
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="firstName">Prénom</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="firstName" placeholder="John" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="lastName">Nom</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="phone">Téléphone</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="birthdate">Date de naissance</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="birthdate" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-x-1 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="address">Adresse</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input id="address" placeholder="123 Rue Example, Paris" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline">Annuler</Button>
                <Button>Enregistrer les modifications</Button>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline">Annuler</Button>
                <Button>Mettre à jour le mot de passe</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
