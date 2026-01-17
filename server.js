const express = require("express");
const path = require("path");
const geoip = require("geoip-lite");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // Get user IP
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  // Get geo location
  const geo = geoip.lookup(ip);

  // Get timezone from browser (sent via header)
  const userTimeZone = req.headers["x-timezone"];

  const isJapanIP = geo && geo.country === "JP";
  const isJapanTimeZone = userTimeZone === "Asia/Tokyo";

  if (isJapanIP && isJapanTimeZone) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(403).send("❌ Access Denied");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
