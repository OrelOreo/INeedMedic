import { prisma } from "./prisma";

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test 1: Vérifier la connexion
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
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
