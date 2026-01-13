const url = require('url');

try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.log("DATABASE_URL is not set.");
    } else {
        const parsed = new url.URL(dbUrl);
        console.log("DATABASE_URL Config:");
        console.log("  Host:", parsed.hostname);
        console.log("  Port:", parsed.port);
        console.log("  Params:", parsed.search);
        console.log("  Protocol:", parsed.protocol);
    }

    const directUrl = process.env.DIRECT_URL;
    if (!directUrl) {
        console.log("DIRECT_URL is not set.");
    } else {
        const parsed = new url.URL(directUrl);
        console.log("DIRECT_URL Config:");
        console.log("  Host:", parsed.hostname);
        console.log("  Port:", parsed.port);
        console.log("  Params:", parsed.search);
    }

} catch (e) {
    console.error("Error parsing URL:", e.message);
}
