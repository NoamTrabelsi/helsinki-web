// import-names.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example data to import
  const data = [
    {
      mail_subject: "תזכורת לחידוש תוקף ביטוח למחקר: 0007-23-SMC",
      mail_content:
        "שלום רב,<br><br>,תוקף הביטוח למחקר:0007-23-SMCבנושא: ללא מוצר מחקר עם טופס הסכמה<br>עומד לפוג בתאריך: 27/12/2023<br>",
      mail_address_to: "noam@prodify.com",
      research_id: 5106,
      mail_date:new Date(),
      ole_table_id:0,
      researcher:0,
      authorizations:0,
      site_id:1,
      cyclic:0,
    },
  ];

  // Bulk insert using createMany
  await prisma.tasks.createMany({
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
