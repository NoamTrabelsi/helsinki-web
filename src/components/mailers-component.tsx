"use client";

import { useState, useEffect } from "react";
import {
  Archive,
  Hand,
  RefreshCcw,
  Send,
  SendHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getMailers, updateMailer } from "@/actions/db/mailer/mailer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "use-debounce";
import { catchHandler } from "@/utils/catch-handlers";
import { Mailer } from "@prisma/client";
import { Spinner } from "./ui/spinner";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const MailersComponent = ({
  initioalMailers,
}: {
  initioalMailers: Mailer[];
}) => {
  const [status, setStatus] = useState<string>("");
  const [appType, setAppType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [lastId, setLastId] = useState<number>(0);
  const [skip, setSkip] = useState<boolean>(false);
  const [mailers, setMailers] = useState<Mailer[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.5,
    skip,
  });

  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (error && error.length) {
      throw new Error(error);
    }
  }, [error]);

  useEffect(() => {
    setAppType(searchParams?.get("to") || "");
    setAppType(searchParams?.get("appType") || "");
    setStatus(searchParams?.get("status") || "");
    setSubject(searchParams?.get("subject") || "");
    setBody(searchParams?.get("body") || "");
  }, [searchParams]);

  useEffect(() => {
    if (mailers && mailers.length) {
      const lastRow = mailers[mailers.length - 1];
      setLastId(lastRow?.id);
    } else {
      // setSkip(true);
    }
  }, [mailers]);

  useEffect(() => {
    if (initioalMailers && initioalMailers.length) {
      setMailers(initioalMailers);
      setSkip(false);
    } else {
      setMailers([]);
      setSkip(true);
    }
  }, [initioalMailers]);

  useEffect(() => {
    if (inView) {
      loadMoreRows();
    }
  }, [inView]);

  const loadMoreRows = async () => {
    const newRows = await getMailers({
      lastId,
      to: to != "" ? to : undefined,
      appType: appType != "" ? appType : undefined,
      status: status != "" ? +status : undefined,
      subject: subject != "" ? subject : undefined,
      body: body != "" ? body : undefined,
    });
    const newObj = newRows?.data as Mailer[];

    if (!newObj || !newObj.length) {
      setSkip(true);
    } else {
      setMailers((prevState: Mailer[]) => [...prevState, ...newObj]);
    }
  };
  const handleSearch = useDebouncedCallback((param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value != "all") {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const formatError = (
    errCode: number | null,
    msg: string | null,
    status: number
  ) => {
    if (errCode !== null) {
      if (errCode === 200 && msg === "נשלח בהצלחה\n") {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Send color="#13812f" />
              </TooltipTrigger>
              <TooltipContent>
                <pre>{msg}</pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else if (errCode === 200) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Send color="#e20303" />
              </TooltipTrigger>
              <TooltipContent>
                <pre>{msg}</pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else if (400 <= errCode && errCode <= 499) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <RefreshCcw />
              </TooltipTrigger>
              <TooltipContent>
                <pre>{msg}</pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else if (500 <= errCode && errCode <= 599) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <X color="#e20303" />
              </TooltipTrigger>
              <TooltipContent>
                <pre>{msg}</pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    } else if (errCode === null && status === 2) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Hand />
            </TooltipTrigger>
            <TooltipContent>
              <p>המייל הועבר לארכיון ללא שליחה</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  };
  const formatEmails = (mailer: string | null) => {
    if (!mailer) return "";
    return mailer
      ?.split(";")
      .map((r) => r.trim())
      .join("\n");
  };
  const statusEmails = (mailer: string) => {
    if (mailer === "1") {
      return "פעיל";
    } else if (mailer === "2") {
      return "בארכיון";
    }
  };
  const statusApp = (mailer: string) => {
    if (mailer === "matarotHelsinki") {
      return "מטרות הלסינקי";
    } else if (mailer === "haschama") {
      return "טפסי הסכמה";
    }
  };
  // const [expandedId, setExpandedId] = useState<number | null>(null);

  // const toggleExpand = (id: number | null) => {
  //   setExpandedId((prevId) => (prevId === id ? null : id));
  // };
  // const truncateText = (id: number, text: string) => {
  //   const txt = text.replace(/\s+/g, " ").trim();
  //   if (txt.length <= 50) return txt;
  //   let truncated = txt.slice(0, 50);
  //   if (txt[50] !== " " && truncated.lastIndexOf(" ") !== -1) {
  //     truncated = truncated.slice(0, truncated.lastIndexOf(" "));
  //   }

  //   return (
  //     <div className="flex items-center">
  //       {truncated}
  //       {/* {expandedId === id ? (
  //         <span onClick={() => toggleExpand(null)} className="cursor-pointer">
  //           {text}
  //         </span>
  //       ) : (
  //         <Button onClick={() => toggleExpand(id)} variant="ghost">
  //           {truncated}...
  //         </Button>
  //       )} */}

  //       {/* {expandedId === id ? text : `${truncated}...`}
  //       <Button onClick={() => toggleExpand(id)}>
  //         {expandedId === id ? "Show less" : "Show more"}
  //       </Button> */}
  //       <HoverCard>
  //         <HoverCardTrigger asChild>
  //           <pre>...</pre>
  //         </HoverCardTrigger>
  //         <HoverCardContent className="w-80">
  //           <div className="flex justify-between space-x-4">
  //             <div
  //               dangerouslySetInnerHTML={{
  //                 __html: text,
  //               }}
  //             />
  //           </div>
  //         </HoverCardContent>
  //       </HoverCard>
  //       {/* <TooltipProvider>
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <pre>...</pre>
  //           </TooltipTrigger>
  //           <TooltipContent className="max-w-[200px] break-words">
  //             {text}
  //           </TooltipContent>
  //         </Tooltip>
  //       </TooltipProvider> */}
  //     </div>
  //   );
  // };

  return (
    <div className="h-[calc(100vh-10rem)] m-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        ארכיון דוא&quot;ל מערכת מטרות
      </h1>
      <div className="flex flex-row gap-4 my-4">
        <Button
          onClick={async () => {
            await fetch("/api/mailer", {
              method: "POST",
            });
          }}
        >
          הפעלה של - Mailer
        </Button>
        <Button
          onClick={async () => {
            await fetch("/api/mailToSend", {
              method: "POST",
            });
          }}
        >
          הפעלה של - mailToSend
        </Button>
        <Select
          onValueChange={(value: string) => handleSearch("appType", value)}
          value={appType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר אפליקציה" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>אפליקציה</SelectLabel>
              <SelectItem value="all">---הכול---</SelectItem>
              <SelectItem value="matarotHelsinki">מטרות הלסינקי</SelectItem>
              <SelectItem value="haschama">טפסי הסכמה</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: string) => handleSearch("status", value)}
          value={status}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>סטטוס</SelectLabel>
              <SelectItem value="all">---הכול---</SelectItem>
              <SelectItem value="1">פעיל</SelectItem>
              <SelectItem value="2">בארכיון</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="search"
          placeholder="חפש בנושא"
          id="search"
          name="search"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            handleSearch("subject", e.target.value);
          }}
        />
        <Input
          type="search"
          placeholder='חיפוש בגוף הדוא"ל'
          id="search"
          name="search"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            handleSearch("body", e.target.value);
          }}
        />
        <Input
          type="search"
          placeholder="חפש נמען"
          id="search"
          name="search"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            handleSearch("to", e.target.value);
          }}
        />
        <Button onClick={() => router.refresh()}>
          <RefreshCcw />
        </Button>
      </div>

      <ScrollArea className="h-full rounded-md border overflow-auto max-h-fit">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-right">נוֹשֵׂא</TableHead>
              <TableHead className="font-bold text-right">גוּף</TableHead>
              <TableHead className="font-bold text-right">נִמְעָן</TableHead>
              <TableHead className="font-bold text-right">עֹתֶק</TableHead>
              <TableHead className="font-bold text-right">
                עֹתֶק מֻסְתָּר
              </TableHead>
              <TableHead className="font-bold text-right"></TableHead>
              <TableHead className="font-bold text-right">סטָטוּס</TableHead>
              <TableHead className="font-bold text-right">
                תַּאַרִּיךְ שְׁלִיחָה מְתַכְנֶּן
              </TableHead>
              <TableHead className="font-bold text-right">
                תַּאַרִּיךְ שְׁלִיחָה
              </TableHead>
              <TableHead className="font-bold text-right">
                אֲפְלִיקַצְיָה
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mailers.map((mailer) => (
              <TableRow key={mailer.id}>
                <TableCell>{mailer.id}</TableCell>

                <TableCell>{mailer.subject}</TableCell>
                <TableCell>
                  {/* {truncateText(
                    mailer.id,
                    mailer.body.replace(/<\/?[^>]+(>|$)/g, "")
                  )} */}
                  <HoverCard>
                    <HoverCardTrigger asChild className="w-80">
                      <div className="truncate">
                        {mailer.body.replace(/<\/?[^>]+(>|$)/g, "")}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      {mailer.body.replace(/<\/?[^>]+(>|$)/g, "")}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <pre>{formatEmails(mailer.to)}</pre>
                </TableCell>
                <TableCell>
                  <pre>{formatEmails(mailer.cc)}</pre>
                </TableCell>
                <TableCell>
                  <pre>{formatEmails(mailer.bcc)}</pre>
                </TableCell>
                <TableCell>
                  {formatError(mailer.errCode, mailer.errMsg, mailer.status)}
                </TableCell>
                <TableCell>{statusEmails(mailer.status.toString())}</TableCell>
                <TableCell>
                  {mailer.sendDate
                    ? new Date(mailer.sendDate).toLocaleDateString("en-GB")
                    : null}
                </TableCell>
                <TableCell>
                  {mailer.sentDate
                    ? new Date(mailer.sentDate).toLocaleString("en-GB", {
                        timeZone: "Asia/Jerusalem",
                      })
                    : null}
                </TableCell>
                <TableCell>{statusApp(mailer.appType.toString())}</TableCell>
                <TableCell className="space-x-1.5">
                  {mailer.status === 2 &&
                    (mailer.errCode === null || mailer.errCode < 500) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-green-500 hover:bg-green-700">
                            <SendHorizontal />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>האם אתה בטוח ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              לא ניתן לבטל פעולה זו. פעולה זו תשלח את המייל
                              מחדש.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await updateMailer(mailer.id, {
                                    status: 1,
                                    sentDate: new Date(),
                                  });
                                  const data = await fetch("/api/mailer", {
                                    method: "POST",
                                  });
                                  await data.json();
                                  router.refresh();
                                } catch (error) {
                                  catchHandler(
                                    error,
                                    "Mailer",
                                    "resend mailer",
                                    setError
                                  );
                                }
                              }}
                            >
                              המשך
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  {mailer.status === 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <Archive />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>האם אתה בטוח ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            לא ניתן לבטל פעולה זו. פעולה זו תשלח את המייל
                            לארכיון.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ביטול</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                const result = await updateMailer(mailer.id, {
                                  status: 2,
                                });
                                if (result?.error) {
                                  setError(result.error);
                                } else {
                                  router.refresh();
                                }
                              } catch (error) {
                                catchHandler(
                                  error,
                                  "Mailer",
                                  "Archive mailer",
                                  setError
                                );
                              }
                            }}
                          >
                            המשך
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
          ref={ref}
        >
          {!skip && <Spinner />}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MailersComponent;
