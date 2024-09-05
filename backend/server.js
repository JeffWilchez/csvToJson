import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

let csvData = [];

app.use(cors());

app.post("/api/files", upload.single("file"), async (req, res) => {
  
  const { file } = req;

  if (!file) {
    return res.status(500).send({ message: "No file uploaded" });
  }

  if (file.mimetype != "text/csv") {
    return res.status(500).send({ message: "Invalid file type" });
  }

  let json = [];
  try {
    const csv = Buffer.from(file.buffer).toString("utf-8");
    json = csvToJson.fieldDelimiter(',').csvStringToJson(csv);
  } catch (error) {
    return res.status(500).json({ message: "Error parsing the file" });
  }
  csvData = json;
  
  return res.status(200).json({ data: json, message: "Uploaded success" });
});

app.get("/api/users", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(500).json({ message: "q is required" });
  }

  const search = q.toLowerCase();

  const filterData = csvData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(search)
    );
  });

  return res.status(200).json({ data: filterData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
