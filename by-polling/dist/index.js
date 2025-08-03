// src/index.ts
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
const app = express();
app.use(cors());
app.use(express.json());
const files = {};
console.log(files);
app.post("/files", (req, res) => {
    const id = uuidv4().slice(0, 6); // Short ID like "a1b2c3"
    const content = req.body.content || "";
    files[id] = {
        content,
        lastUpdated: Date.now()
    };
    res.json({ id });
});
app.get("/files/:id", (req, res) => {
    const file = files[req.params.id];
    if (!file)
        return res.status(404).json({ error: "File not found" });
    res.json(file);
});
app.put("/files/:id", (req, res) => {
    const file = files[req.params.id];
    if (!file)
        return res.status(404).json({ error: "File not found" });
    const newContent = req.body.content;
    file.content = newContent;
    file.lastUpdated = Date.now();
    res.json({ success: true });
});
app.get("/files/:id/changes", (req, res) => {
    const file = files[req.params.id];
    if (!file)
        return res.status(404).json({ error: "File not found" });
    const since = Number(req.query.since || 0);
    const changed = file.lastUpdated > since;
    res.json({
        changed,
        lastUpdated: file.lastUpdated,
        content: changed ? file.content : undefined
    });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
