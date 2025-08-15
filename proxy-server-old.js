import express from 'express';
import axios from 'axios';
import https from 'https';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Needed for parsing JSON bodies in POST requests

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('D:/GG/client-cert/drcc_client.crt'),
  key: fs.readFileSync('D:/GG/client-cert/drcc_client.key'),
});

app.get('/api/getvendata', async (req, res) => {
  try {
    const venid = req.query.venid;
    if (!venid) {
      return res.status(400).send('venid query parameter is required');
    }

    const response = await axios.get(`https://drms.egat.co.th:40443/api/getvendata?venid=${venid}`, {
      httpsAgent,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('Error proxying request');
  }
});

app.get('/api/getlastresponse', async (req, res) => {
  const { venid, numrows } = req.query;

  if (!venid || !numrows) {
    return res.status(400).send('Missing required query parameters: venid and numrows');
  }

  try {
    const apiUrl = `http://localhost:3000/api/getlastresponse?venid=${venid}&numrows=${numrows}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const postProxy = (endpoint) => async (req, res) => {
  try {
    const venid = req.query.venid;
    if (!venid) {
      return res.status(400).send('venid query parameter is required');
    }

    const response = await axios.post(`${endpoint}?venid=${venid}`, null, {
      httpsAgent,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('Error proxying request');
  }
};

app.post('/api/openvenregistration', postProxy('https://drms.egat.co.th:40443/api/openvenregistration'));
app.post('/api/openreportregistration', postProxy('https://drms.egat.co.th:40443/api/openreportregistration'));
app.post('/api/closevenregistration', postProxy('https://drms.egat.co.th:40443/api/closevenregistration'));
app.post('/api/closereportregistration', postProxy('https://drms.egat.co.th:40443/api/closereportregistration'));

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
