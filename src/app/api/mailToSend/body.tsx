export function createEmailBody(mail_content: string) {
  return `<!DOCTYPE html>
<html>
<head>
    <!-- <meta http-equiv="Content-Type" content="text/html; charset=windows-1255"> -->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="font-family: Arial;">
    <meta content="Microsoft Word 12 (filtered medium)" name="Generator">
    <meta id="noSkype" name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
    <table dir="rtl" style="font-family: Arial;" cellpadding="0" cellspacing="0" width="700" border="0" align="center" bgcolor="#edeff0">
        <thead role="banner">
            <tr dir="rtl">
                <th style="padding: 0.3cm 0.7cm;" bgcolor="#dbdfe1" border="0">
                    <table dir="rtl" cellpadding="0" cellspacing="0" width="100%" border="0" align="center" style="border: 0px solid #dbdfe1">
                        <tr dir="rtl">
                            <td style="padding: 10px" bgcolor="#dbdfe1" valign="middle" align="right">
                            </td>
                            <td style="padding: 10px; background-color: #dbdfe1" bgcolor="#dbdfe1" valign="middle" align="left">
                               
                            </td>
                        </tr>
                    </table>

                </th>
            </tr>
        </thead>
        <tbody role="main">
            <tr>
                <td dir="rtl" align="right" style="padding: 0.3cm 0.7cm 0.8cm 0.7cm;">
                    <p>${mail_content}</p>
                </td>
            </tr>
        </tbody>
        <tfoot role="contentinfo">
        </tfoot>
    </table>
</body>
</html>`;
}



{/* <img src="cid:COMPANYICON" alt="company" height="40"> */}

{/* <img src="cid:HELSINKIICON" height="40"> */}