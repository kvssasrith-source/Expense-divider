const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files EXCEPT index.html so we can intercept it
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Read index.html and inject a CSS fix for React Native Web's SafeAreaProvider bug
const handleIndex = (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading index.html');
    }
    // Inject global CSS to force the root container to take up 100% height
    const injectedData = data.replace(
      '</head>',
      '<style>#root > div { flex: 1 !important; height: 100% !important; width: 100% !important; }</style></head>'
    );
    res.send(injectedData);
  });
};

app.get('/', handleIndex);
app.get(/^(.*)$/, handleIndex);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
