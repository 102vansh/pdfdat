const express = require('express');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const app = express();
const port = 5000;

// Middleware to handle file uploads
app.use(fileUpload());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }))
// Endpoint to handle file upload and team generation
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.file;
  const workbook = xlsx.read(uploadedFile.data);
  const devSheet = workbook.Sheets['Dev'];
  const baSheet = workbook.Sheets['BA'];
  const daSheet = workbook.Sheets['Data Analyst'];
  
  const devs = xlsx.utils.sheet_to_json(devSheet);
  const bas = xlsx.utils.sheet_to_json(baSheet);
  const das = xlsx.utils.sheet_to_json(daSheet);

  // Generate teams based on data
  const teams = generateTeams(devs, bas, das);

  res.json(teams);
});

// Endpoint to generate and serve PDF
app.get('/generate-pdf', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-disposition', 'attachment; filename=teams.pdf');
  res.setHeader('Content-type', 'application/pdf');
  
  doc.pipe(res);
  doc.text('Generated Teams');

  // Example of adding team data to the PDF
  doc.text('Team 1: Dev1, Dev2, Dev3, BA1, DA1');
  doc.text('Team 2: Dev4, Dev5, Dev6, BA2, DA2');

  doc.end();
});

function generateTeams(devs, bas, das) {
  const teams = [];
  for (let i = 0; i < Math.min(devs.length / 3, bas.length, das.length); i++) {
    teams.push({
      devs: devs.slice(i * 3, i * 3 + 3),
      ba: bas[i],
      da: das[i]
    });
  }
  return teams;
}

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
