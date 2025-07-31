
const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('D:/GG/client-cert/drcc_client.crt'),
  key: fs.readFileSync('D:/GG/client-cert/drcc_client.key'),
});

app.get('/api/venstatus', async (req, res) => {
  try {
    const venid = req.query.venid;
    if (!venid) {
      return res.status(400).send('venid query parameter is required');
    }

    const response = await axios.get(`https://your-backend.com/api/venstatus?venid=${venid}`, {
      httpsAgent,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('Error proxying request');
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
