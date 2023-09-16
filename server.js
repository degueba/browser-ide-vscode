const { exec } = require('child_process');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { runTests } = require('vscode-test');

app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

const port = 3000;
const rootDir = __dirname;


const filesPath = [];
getFilesPath();

async function getFilesPath() {
  await listAllFiles(rootDir);
  return filesPath;
}

async function listAllFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      // Do not return files that are not in src and that are tests
      if (!filePath.includes("src") || filePath.includes("src/test")) {return;}

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting file stats for ${filePath}: ${err}`);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively list files in subdirectories
          listAllFiles(filePath);
        } else {
          filesPath.push(filePath); // Print the file path
        }
      });
    });
  });

  return filesPath;
}

// Define your API routes
app.get('/api/files', async (req, res) => {
  try {
    res.json({ data: filesPath });
  } catch (err) {
    console.error(err);
  }
});

app.get('/api/file/:name', async (req, res) => {
  try {
    const fileName = req.params.name;
    const filePath = filesPath.find((file) => file.includes(fileName));
    const content = fs.readFileSync(filePath);
    res.json({ data: content.toString() });
  } catch (err) {
    console.error(err);
  }
});

app.put('/api/file/:name', async (req, res) => {
  try {
    const fileName = req.params.name;
    const contentModified = req.body.content;
    const filePath = filesPath.find((file) => file.includes(fileName));
    const content = fs.readFileSync(filePath).toString();

    console.log(content);
    console.log(contentModified);

    res.json({ data: "File updated successfully" });
  } catch (err) {
    console.error(err);
  }
});

app.post('/api/file/open', (req, res) => {  
  const filePath = req.body.filePath;
  const extensionPath = path.resolve(__dirname, filePath);
  exec(`code ${extensionPath}`, (error) => {
    if (error) {
      console.error(`Error opening file in VSCode: ${error.message}`);
      return;
    }

    console.log('File opened successfully in VSCode');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`BrowserIDE Server is running on port ${port}`);
});