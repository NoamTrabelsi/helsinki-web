// import-names.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example data to import
  const data = [
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: "test new",
      body: `
            <html>
              <head></head>
              <body>
                <p>שלום לכולם,</p>
                <br>
                <p>tets 1</p>
              </body>
            </html>`,
      to: "noam@prodify.com ; @prodify.com",
      sendDate: new Date(),
      status: 1,
      appType: "matarotHelsinki",
    },
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: "noam trabelsi",
      body: `
      <html>
        <head></head>
        <body>
          <p>שלום רב,</p>
          <br>
          <p>אם המחקר אמור להימשך תקופה נוספת, אנא שלח בקשת הארכת תוקף לועדת הלסינקי בהקדם.</p>
        </body>
      </html>`,
      to: "noam@prodify.com",
      sendDate: new Date(),
      status: 1,
      appType: "matarotHelsinki",
    },
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: "more test",
      body: `
      <html>
        <head></head>
        <body>
          <p>שלום רב,</p>
          <br>
          <p>noam trabelsi</p>
        </body>
      </html>`,
      to: "noam@prodify.com",
      sendDate: new Date("2025-01-03"),
      status: 1,
      appType: "haschama",
    },
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: "more test",
      body: `
      <html>
        <head></head>
        <body>
          <p>שלום רב,</p>
          <br>
          <p>noam trabelsi</p>
        </body>
      </html>`,
      to: "@prodify.com",
      sendDate: new Date(),
      status: 1,
      appType: "matarotHelsinki",
    },
  ];

  // Bulk insert using createMany
  await prisma.mailer.createMany({
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
