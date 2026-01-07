import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test 1: Vérifier la connexion
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Test 2: Créer un user client
    console.log("\n📝 Creating sample client user...");
    const client = await prisma.user.create({
      data: {
        email: "client@test.com",
        name: "Jean Dupont",
        role: "CLIENT",
        password: await bcrypt.hash("Test12345", 10),
      },
    });
    console.log("✅ Client created:", client);

    // Test 3: Créer un user praticien avec son profil
    console.log("\n📝 Creating sample practitioner user...");
    const practitioner = await prisma.user.create({
      data: {
        email: "praticien@test.com",
        name: "Dr. Marie Martin",
        role: "PRACTITIONER",
        password: await bcrypt.hash("Test12345", 10),
        practitioner: {
          create: {
            specialty: "Kinésithérapeute",
            description: "Spécialisée en rééducation sportive",
            phone: "0612345678",
            address: "15 rue de la Santé",
            city: "Paris",
            postalCode: "75014",
            appointmentDuration: 30,
            cancellationDelay: 24,
            isActive: true,
          },
        },
      },
      include: {
        practitioner: true,
      },
    });
    console.log("✅ Practitioner created:", practitioner);

    // Test 3b: Créer un deuxième praticien (Ostéopathe)
    console.log("\n📝 Creating second practitioner user (Osteopath)...");
    const osteopath = await prisma.user.create({
      data: {
        email: "osteo@test.com",
        name: "Dr. Pierre Dubois",
        role: "PRACTITIONER",
        password: await bcrypt.hash("Test12345", 10),
        practitioner: {
          create: {
            specialty: "Ostéopathe",
            description: "Spécialisé en ostéopathie crânienne et viscérale",
            phone: "0623456789",
            address: "8 avenue de la République",
            city: "Lyon",
            postalCode: "69003",
            appointmentDuration: 45,
            cancellationDelay: 48,
            isActive: true,
          },
        },
      },
      include: {
        practitioner: true,
      },
    });
    console.log("✅ Osteopath created:", osteopath);

    // Test 3: Créer un troisième praticien (Psychologue)
    console.log("\n📝 Creating third practitioner user (Psychologist)...");
    const psychologist = await prisma.user.create({
      data: {
        email: "psy@test.com",
        name: "Dr. Sophie Leroy",
        role: "PRACTITIONER",
        password: await bcrypt.hash("Test12345", 10),
        practitioner: {
          create: {
            specialty: "Psychologue",
            description: "Thérapie cognitive et comportementale",
            phone: "0634567890",
            address: "22 boulevard Saint-Germain",
            city: "Paris",
            postalCode: "75005",
            appointmentDuration: 60,
            cancellationDelay: 24,
            isActive: true,
          },
        },
      },
      include: {
        practitioner: true,
      },
    });
    console.log("✅ Psychologist created:", psychologist);

    // Test 4: Créer des disponibilités pour le praticien
    // console.log("\n📝 Creating availability slots...");
    // const availabilities = await prisma.availability.createMany({
    //   data: [
    //     {
    //       practitionerId: practitioner.practitioner!.id,
    //       dayOfWeek: "MONDAY",
    //       startTime: "09:00",
    //       endTime: "12:00",
    //     },
    //     {
    //       practitionerId: practitioner.practitioner!.id,
    //       dayOfWeek: "MONDAY",
    //       startTime: "14:00",
    //       endTime: "18:00",
    //     },
    //     {
    //       practitionerId: practitioner.practitioner!.id,
    //       dayOfWeek: "TUESDAY",
    //       startTime: "09:00",
    //       endTime: "17:00",
    //     },
    //   ],
    // });
    // console.log(`✅ Created ${availabilities.count} availability slots`);

    // // Test 4b: Créer des disponibilités pour l'ostéopathe
    // console.log("\n📝 Creating availability slots for osteopath...");
    // const osteopathAvailabilities = await prisma.availability.createMany({
    //   data: [
    //     {
    //       practitionerId: osteopath.practitioner!.id,
    //       dayOfWeek: "WEDNESDAY",
    //       startTime: "08:00",
    //       endTime: "12:00",
    //     },
    //     {
    //       practitionerId: osteopath.practitioner!.id,
    //       dayOfWeek: "THURSDAY",
    //       startTime: "14:00",
    //       endTime: "19:00",
    //     },
    //     {
    //       practitionerId: osteopath.practitioner!.id,
    //       dayOfWeek: "FRIDAY",
    //       startTime: "09:00",
    //       endTime: "16:00",
    //     },
    //   ],
    // });
    // console.log(
    //   `✅ Created ${osteopathAvailabilities.count} availability slots for osteopath`
    // );

    // // Test 4c: Créer des disponibilités pour le psychologue
    // console.log("\n📝 Creating availability slots for psychologist...");
    // const psychologistAvailabilities = await prisma.availability.createMany({
    //   data: [
    //     {
    //       practitionerId: psychologist.practitioner!.id,
    //       dayOfWeek: "MONDAY",
    //       startTime: "10:00",
    //       endTime: "18:00",
    //     },
    //     {
    //       practitionerId: psychologist.practitioner!.id,
    //       dayOfWeek: "WEDNESDAY",
    //       startTime: "10:00",
    //       endTime: "18:00",
    //     },
    //     {
    //       practitionerId: psychologist.practitioner!.id,
    //       dayOfWeek: "FRIDAY",
    //       startTime: "10:00",
    //       endTime: "16:00",
    //     },
    //   ],
    // });
    // console.log(
    //   `✅ Created ${psychologistAvailabilities.count} availability slots for psychologist`
    // );

    // Test 5: Créer une indisponibilité (congés)
    // console.log("\n📝 Creating unavailability period...");
    // const unavailability = await prisma.unavailability.create({
    //   data: {
    //     practitionerId: practitioner.practitioner!.id,
    //     startDate: new Date("2025-01-15"),
    //     endDate: new Date("2025-01-22"),
    //     reason: "Congés annuels",
    //     isAllDay: true,
    //   },
    // });
    // console.log("✅ Unavailability created:", unavailability);

    // Test 6: Créer un rendez-vous
    console.log("\n📝 Creating sample appointment...");
    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        practitionerId: practitioner.practitioner!.id,
        startDateTime: new Date("2027-01-13T10:00:00"),
        endDateTime: new Date("2027-01-13T10:30:00"),
        status: "CONFIRMED",
        clientNotes: "Première consultation pour douleur au dos",
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        practitioner: {
          select: {
            specialty: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log("✅ Appointment created:", appointment);

    // Test 6b: Créer un rendez-vous avec l'ostéopathe
    console.log("\n📝 Creating appointment with osteopath...");
    const osteopathAppointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        practitionerId: osteopath.practitioner!.id,
        startDateTime: new Date("2025-01-16T14:00:00"),
        endDateTime: new Date("2025-01-16T14:45:00"),
        status: "CONFIRMED",
        clientNotes: "Consultation pour douleurs cervicales",
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        practitioner: {
          select: {
            specialty: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log("✅ Osteopath appointment created:", osteopathAppointment);

    // Test 6c: Créer un rendez-vous avec le psychologue
    console.log("\n📝 Creating appointment with psychologist...");
    const psychologistAppointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        practitionerId: psychologist.practitioner!.id,
        startDateTime: new Date("2025-01-17T11:00:00"),
        endDateTime: new Date("2025-01-17T12:00:00"),
        status: "PENDING",
        clientNotes: "Première séance - gestion du stress",
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        practitioner: {
          select: {
            specialty: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log(
      "✅ Psychologist appointment created:",
      psychologistAppointment
    );

    // Test 7: Récupérer tous les users
    console.log("\n📊 Fetching all users...");
    const allUsers = await prisma.user.findMany({
      include: {
        practitioner: true,
      },
    });
    console.log(`✅ Found ${allUsers.length} users in database`);

    console.log("\n🎉 All tests passed! Database is working correctly.");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log("\n🔌 Database disconnected");
  }
}

// Exécuter le test
testDatabaseConnection()
  .then(() => {
    console.log("\n✨ Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error);
    process.exit(1);
  });
