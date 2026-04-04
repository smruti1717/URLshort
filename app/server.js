const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const urlDatabase = {};

function generateShortCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>URL Shortener</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
          }
          input, button {
            padding: 10px;
            margin: 8px 0;
            width: 100%;
            font-size: 16px;
          }
          .box {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
          }
          a {
            color: blue;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Simple URL Shortener</h1>
          <form method="POST" action="/shorten">
            <input type="text" name="longUrl" placeholder="Enter long URL" required />
            <button type="submit">Generate Short Link</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).send("Invalid URL");
  }

  let shortCode = generateShortCode();

  while (urlDatabase[shortCode]) {
    shortCode = generateShortCode();
  }

  urlDatabase[shortCode] = longUrl;

  const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

  res.send(`
    <html>
      <head>
        <title>Short URL Created</title>
      </head>
      <body style="font-family: Arial; max-width: 700px; margin: 50px auto;">
        <h2>Short URL Generated</h2>
        <p><strong>Original URL:</strong> <a href="${longUrl}" target="_blank">${longUrl}</a></p>
        <p><strong>Short URL:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
        <br/>
        <a href="/">Create Another</a>
      </body>
    </html>
  `);
});

app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  const longUrl = urlDatabase[shortCode];

  if (!longUrl) {
    return res.status(404).send("Short URL not found");
  }

  return res.redirect(longUrl);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`URL Shortener app running on http://0.0.0.0:${PORT}`);
});