const NodeGeocoder = require('node-geocoder')

const geoCoder = NodeGeocoder({
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY,
    httpAdapter: 'https',
});

module.exports = geoCoder