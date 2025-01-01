"use server";
import MailersComponent from "@/components/mailers-component";
import { catchHandler } from "@/utils/catch-handlers";
import { getMailers } from "@/actions/db/mailer/mailer"; 
import { Mailer } from "@prisma/client"; 

const mailersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    appType?: string;
    status?: string;
    subject?: string;
    body?: string;
    to?: string;
  }>;
}) => {
  const { to, appType, status, subject, body } = await searchParams;
  try {
    const mailers = await getMailers({
      to: to ? to : undefined,
      appType: appType ? appType : undefined,
      status: status ? +status : undefined,
      subject: subject ? subject : undefined,
      body: body ? body : undefined,
    });

    return <MailersComponent mailers={mailers?.data as Mailer[]} />;
  } catch (error) {
    return catchHandler(error, "page", "get mailer");
  }
};
export default mailersPage;
