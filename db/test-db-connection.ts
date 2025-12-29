import { prisma } from "./prisma";

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
        password: "hashed_password_here", // En production, utilisez bcrypt
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
        password: "hashed_password_here",
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

    // Test 4: Créer des disponibilités pour le praticien
    console.log("\n📝 Creating availability slots...");
    const availabilities = await prisma.availability.createMany({
      data: [
        {
          practitionerId: practitioner.practitioner!.id,
          dayOfWeek: "MONDAY",
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          practitionerId: practitioner.practitioner!.id,
          dayOfWeek: "MONDAY",
          startTime: "14:00",
          endTime: "18:00",
        },
        {
          practitionerId: practitioner.practitioner!.id,
          dayOfWeek: "TUESDAY",
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    });
    console.log(`✅ Created ${availabilities.count} availability slots`);

    // Test 5: Créer une indisponibilité (congés)
    console.log("\n📝 Creating unavailability period...");
    const unavailability = await prisma.unavailability.create({
      data: {
        practitionerId: practitioner.practitioner!.id,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-01-22"),
        reason: "Congés annuels",
        isAllDay: true,
      },
    });
    console.log("✅ Unavailability created:", unavailability);

    // Test 6: Créer un rendez-vous
    console.log("\n📝 Creating sample appointment...");
    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        practitionerId: practitioner.practitioner!.id,
        startDateTime: new Date("2025-01-13T10:00:00"),
        endDateTime: new Date("2025-01-13T10:30:00"),
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
