const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api", (req, res) => {
    res.json({message: "Cat API", endpoints: ["/api/cat", "/health"]});
});

app.get("/api/cat", async (req, res) => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        if (!response.ok) {throw new Error("Cat API request failed");}
        const data = await response.json();
        if (!data.length || !data[0].url) {throw new Error("No cat image found");}
        res.json({success: true,message: "Cat",image: data[0].url});
    } catch (error) {
        console.error("Cat API error:", error.message);
        res.status(502).json({success: false,message: "Failed Cat"});
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({status: "healthy",application: "Cat Image Generator"});
});

if (require.main === module) {
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
}

module.exports = app;
