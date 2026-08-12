import dns from "dns";
import app from "./app.js";

dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});