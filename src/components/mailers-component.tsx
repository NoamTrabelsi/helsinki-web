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
import { updateMailer } from "@/actions/db/mailer/mailer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const MailersComponent = ({ mailers }: { mailers: Mailer[] }) => {
  const [status, setStatus] = useState<string>("");
  const [appType, setAppType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchSubject, setSearchSubject] = useState<string>("");
  const [searchBody, setSearchBody] = useState<string>("");
  const [searchRecipient, setSearchRecipient] = useState<string>("");

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
    setSearchSubject(searchParams?.get("subject") || "");
    setSearchBody(searchParams?.get("body") || "");
  }, [searchParams]);

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
  const truncateText = (text: string) => {
    if (text.length <= 50) return text;
    let truncated = text.slice(0, 50);
    if (text[50] !== " " && truncated.lastIndexOf(" ") !== -1) {
      truncated = truncated.slice(0, truncated.lastIndexOf(" "));
    }

    return (
      <div className="flex items-center">
        {truncated}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <pre>...</pre>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] break-words">
              {text}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">רשימת מיילים</h1>
      <div className="flex flex-row space-x-4">
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
          placeholder="חפש בכותרת"
          id="search"
          name="search"
          value={searchSubject}
          onChange={(e) => {
            setSearchSubject(e.target.value);
            handleSearch("subject", e.target.value);
          }}
        />
        <Input
          type="search"
          placeholder="חפש בתוכן"
          id="search"
          name="search"
          value={searchBody}
          onChange={(e) => {
            setSearchBody(e.target.value);
            handleSearch("body", e.target.value);
          }}
        />
        <Input
          type="search"
          placeholder="חפש נמען"
          id="search"
          name="search"
          value={searchRecipient}
          onChange={(e) => {
            setSearchRecipient(e.target.value);
            handleSearch("to", e.target.value);
          }}
        />
        <Button onClick={() => router.refresh()}>
          <RefreshCcw />
        </Button>
      </div>
      <div className="p-8 w-full">
        <div className="overflow-x-auto h-[70vh] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>נוֹשֵׂא</TableHead>
                <TableHead>גוּף</TableHead>
                <TableHead>נִמְעָן</TableHead>
                <TableHead>עֹתֶק</TableHead>
                <TableHead>עֹתֶק מֻסְתָּר</TableHead>
                <TableHead></TableHead>
                <TableHead>סטָטוּס</TableHead>
                <TableHead>תַּאַרִּיךְ שְׁלִיחָה מְתַכְנֶּן</TableHead>
                <TableHead>תַּאַרִּיךְ שְׁלִיחָה</TableHead>
                <TableHead>אֲפְלִיקַצְיָה</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mailers.map((mailer) => (
                <TableRow key={mailer.id}>
                  <TableCell>{mailer.subject}</TableCell>
                  <TableCell>
                    {truncateText(mailer.body.replace(/<\/?[^>]+(>|$)/g, ""))}
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
                  <TableCell>
                    {statusEmails(mailer.status.toString())}
                  </TableCell>
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
                              <AlertDialogTitle>
                                האם אתה בטוח ?
                              </AlertDialogTitle>
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
        </div>
      </div>
    </div>
  );
};

export default MailersComponent;
