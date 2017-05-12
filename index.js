const app = require('express')();
const request = require('request');
const querystring = require('querystring');
const get = require('lodash/get');
const js2xmlparser = require('js2xmlparser');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PLACES_SERVICE = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PORT = process.env.PORT || 8080;

const firstPredictionSelector = (data) => get(data, 'predictions[0].description');

const params = {
  key: GOOGLE_API_KEY,
  location: '41.390205,2.154007', // Barcelona, Spain
  radius: 10000, // 10km
  strictbounds: true
};

app.get('/', (req, res) => {
  const input = req.query.q;

  if(!input) {
    res.send('ERROR: no input specified');
  }

  params['input'] = input;

  const options = {
    url: `${GOOGLE_PLACES_SERVICE}?${querystring.stringify(params)}`,
    json: true
  };

  request(options, (error, response, body) => {
    const output = js2xmlparser.parse('address', firstPredictionSelector(body));

    res.setHeader('content-type', 'text/xml');
    res.send(output);
  });
});

app.listen(PORT, () => {
  console.log(`App is up, listening on port ${PORT}`);
});
