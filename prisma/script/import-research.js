// import-names.js

const { PrismaClient } = require("@prisma/client");
const { Contact } = require("lucide-react");
const prisma = new PrismaClient();

async function main() {
  // Example data to import
  const data = [
    {
      contact_hl_id:2280,
      status_id:3,
      end_date:new Date("2025-01-25")
    },
  ];

  // Bulk insert using createMany
  await prisma.researchs.createMany({
    data: data,
    // skipDuplicates: true, // Optional: skips records that already exist
  });

  console.log("Data imported successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
