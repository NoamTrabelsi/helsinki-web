// import-names.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example data to import
  const data = [
    {
      ole_id_number: 4439,
      mail_address_to: "noam@prodify.com",
      type_number: 7,
    },
  ];

  // Bulk insert using createMany
  await prisma.send_2_prof.createMany({
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
