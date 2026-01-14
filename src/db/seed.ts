import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Création d'un utilisateur client
  const clientPassword = await bcrypt.hash("client1234", 10);
  const client = await prisma.user.create({
    data: {
      name: "Alice Client",
      email: "alice.client@example.com",
      password: clientPassword,
      role: "CLIENT",
    },
  });

  // Praticiens à insérer
  const practitionersData = [
    {
      name: "Dr. Jean Dupont",
      email: "jean.dupont@medic.fr",
      city: "Lyon",
      specialty: "cardiologue",
      phone: "0612345678",
      address: "12 rue de la République, Lyon",
    },
    {
      name: "Dr. Marie Martin",
      email: "marie.martin@medic.fr",
      city: "Paris",
      specialty: "dermatologue",
      phone: "0623456789",
      address: "34 avenue des Champs-Élysées, Paris",
    },
    {
      name: "Dr. Paul Bernard",
      email: "paul.bernard@medic.fr",
      city: "Marseille",
      specialty: "généraliste",
      phone: "0634567890",
      address: "56 boulevard Longchamp, Marseille",
    },
    {
      name: "Dr. Sophie Dubois",
      email: "sophie.dubois@medic.fr",
      city: "Bordeaux",
      specialty: "ophtalmologue",
      phone: "0645678901",
      address: "78 rue Sainte-Catherine, Bordeaux",
    },
  ];

  // Création des praticiens et de leurs availabilities
  for (const data of practitionersData) {
    const password = await bcrypt.hash("praticien1234", 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        role: "PRACTITIONER",
      },
    });

    const practitioner = await prisma.practitioner.create({
      data: {
        userId: user.id,
        specialty: data.specialty,
        phone: data.phone,
        address: data.address,
        city: data.city,
      },
    });

    // Création de 2 availabilities par praticien
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    await prisma.availability.createMany({
      data: [
        {
          practitionerId: practitioner.id,
          date: today,
          startTime: "09:00",
          endTime: "10:00",
          dayOfWeek: "MONDAY",
        },
        {
          practitionerId: practitioner.id,
          date: tomorrow,
          startTime: "14:00",
          endTime: "15:00",
          dayOfWeek: "TUESDAY",
        },
      ],
    });
  }

  // Récupérer un praticien pour créer un rendez-vous
  const practitioner = await prisma.practitioner.findFirst();

  if (practitioner) {
    // Récupérer une availability
    const availability = await prisma.availability.findFirst({
      where: { practitionerId: practitioner.id },
    });

    if (availability) {
      // Création d'un rendez-vous
      await prisma.appointment.create({
        data: {
          practitionerId: practitioner.id,
          clientId: client.id,
          date: availability.date,
          startTime: availability.startTime,
          endTime: availability.endTime,
          clientNotes: "Première consultation",
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("✅ Seed terminé !");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
