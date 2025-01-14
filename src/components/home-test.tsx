"use client";

import { Button } from "@/components/ui/button";

const HometestComponent = () => {
  const to = "noam@prodify.com";
  const subject = "test";
  let attachments;
  const body = "body";
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={async () => {
          await fetch("http://localhost:3001/api/simpleMailer", {
            method: "POST",
            body: JSON.stringify({
              to,
              subject,
              attachments,
              body, 
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
