"use client";

import { Button } from "@/components/ui/button";

const HometestComponent = () => {
  const to = "hai@prodify.com";
  const subject = "חי קבלת?";
  // let attachments;
  const body = "אתה אלוף!!";
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={async () => {
          await fetch("http://localhost:3001/api/simpleMailer", {
            method: "POST",
            body: JSON.stringify({
              to: to,
              subject: subject,
              attachments: Buffer.from(
                "++PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCBUZAogICAgKEhlbGxvIFdvcmxkKSBUagogIEVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ1NyAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgIC9Sb290IDEgMCBSCiAgICAgIC9TaXplIDUKICA+PgpzdGFydHhyZWYKNTY1CiUlRU9GCg==",
                "base64"
              ),
              body: body,
            }),
          });
        }}
      >
        MAILER - הפעלה של
      </Button>
    </div>
  );
};

export default HometestComponent;
