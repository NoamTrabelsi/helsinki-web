import { getOleTable } from "@/actions/db/helsinki-ole-table";
import { catchHandler } from "@/utils/catch-handlers";

type Attachment = {
  filename: string | undefined;
  content: Buffer | string | undefined;
  encoding: "base64";
};
export async function getAttachments(
  attachments: string,
  appType: string
): Promise<{ validAttachments: Attachment[]; invalidMessages: string[] }> {
  let validAttachments: Attachment[] = [];
  const invalidMessages: string[] = [];
  if (appType === "matarotHelsinki") {
    const att = attachments.split(",").map((ole: string) => Number(ole.trim()));
    validAttachments = await Promise.all(
      att.map(async (attachment: number) => {
        const oleTable = (await getOleTable({ id: attachment })) as {
          data: { f_name: string; DataFile: Buffer | null } | null;
        };
        const filename = oleTable?.data?.f_name;

        if (filename !== undefined) {
          const fileExtension = filename.split(".").pop()?.toLowerCase(); // מוציא את הסיומת
          const allowedExtensions = ["docx", "doc", "pdf"]; // סיומות מותרות

          if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            catchHandler(
              `Invalid file extension: ${fileExtension}`,
              "mailer",
              "getAttachments"
            );
          }
        } else {
          invalidMessages.push(`${attachment}`);
        }
        return {
          filename: filename,
          content: oleTable?.data?.DataFile || undefined,
          encoding: "base64",
        };
      })
    );
  }
  validAttachments = validAttachments.filter(
    (attachment): attachment is Attachment => attachment.filename !== undefined
  );

  return { validAttachments, invalidMessages };
}

export function validEmails(emailString: string): string[] {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailString
    .split(";")
    .map((email: string) => email.trim())
    .filter((email: string) => emailRegex.test(email));
}
