import express from 'express';
import axios from 'axios';
import https from 'https'
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

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
    console.error('Error proxying request:', error.message);
    res.status(500).send('Error proxying request');
  }
});

app.get('/api/getmetareport', async (req, res) => {
  try {
    const venid = req.query.venid;
    if (!venid) {
      return res.status(400).send('venid query parameter is required');
    }
    const response = await axios.get(`https://drms.egat.co.th:40443/api/getmetareport?venid=${venid}`, {
      httpsAgent,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error.message);
    res.status(500).send('Error proxying request');
  }
});

app.get('/api/getlastresponse', async (req, res) => {
  const { venid, numrows } = req.query;
  if (!venid || !numrows) {
    return res.status(400).send('Missing required query parameters: venid and numrows');
  }
  try {
    const response = await axios.get(`https://drms.egat.co.th:40443/api/getlastresponse?venid=${venid}&numrows=${numrows}`, {
      httpsAgent,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error.message);
    res.status(500).send('Error proxying request');
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
    console.error('Error proxying request:', error.message);
    res.status(500).send('Error proxying request');
  }
};

app.post('/api/requestreport', async (req, res) => {
  try {
    const payload = req.body;
    console.log('Proxying /api/requestreport with payload:', JSON.stringify(payload, null, 2));
    const response = await axios.post(
      'https://drms.egat.co.th:40443/api/requestreport',
      payload,
      {
        httpsAgent,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('--- ERROR PROXYING /api/requestreport ---');
    if (error.response) {
      console.error('Target API Response Data   :', error.response.data);
      console.error('Target API Response Status :', error.response.status);
      console.error('Target API Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received from target API. Request details:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    
    console.error('--- END OF ERROR DETAILS ---');
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Error proxying request to the target API.');
    }
  }
});

app.post('/api/openvenregistration', postProxy('https://drms.egat.co.th:40443/api/openvenregistration'));
app.post('/api/openreportregistration', postProxy('https://drms.egat.co.th:40443/api/openreportregistration'));
app.post('/api/closevenregistration', postProxy('https://drms.egat.co.th:40443/api/closevenregistration'));
app.post('/api/closereportregistration', postProxy('https://drms.egat.co.th:40443/api/closereportregistration'));

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
