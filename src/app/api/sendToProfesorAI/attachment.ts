export async function getHtmlBody(html: object) {
  const { summary, life_risk, deaths } = html as {
    summary: string;
    life_risk: string;
    deaths: string;
  };
  return `<html>
        <head></head>
        <body>
          <p>${summary}</p>
          <br>
          <p>${life_risk}</p>
          <br>
          <p>${deaths}</p>
        </body>
      </html>`;
}
