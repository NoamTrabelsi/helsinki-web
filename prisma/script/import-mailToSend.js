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
      mail_address_to: "@prodify.com",
      mail_type:42,
      research_id: 5257,
      mail_date:new Date(),
      ole_table_id:16285,
      researcher:1,
      authorizations:1,
      site_id:1,
      cyclic:30,
    },
  ];

  // Bulk insert using createMany
  await prisma.mail_to_send.createMany({
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
