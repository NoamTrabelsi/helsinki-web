export async function getHtmlBody(html: object) {
  const { summary, life_risk, deaths } = html as {
    summary: string;
    life_risk: string;
    deaths: string;
  };
  return `<html>
        <head></head>
        <body>
        <h1>סיכום</h1>
          <p>${summary}</p>
          <br>
          <h1>אירועים המסכני חיים</h1>
          <p>${life_risk}</p>
          <br>
          <h1>מקרי פטירה</h1>
          <p>${deaths}</p>
        </body>
      </html>`;
}
