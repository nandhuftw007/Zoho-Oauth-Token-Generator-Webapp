// Import 'cross-fetch' using require
const fetch = require('cross-fetch');

async function handler(context, basicIO) {
    try {
        const client_id = basicIO.getArgument('client_id');
        const client_secret = basicIO.getArgument('client_secret');
        const code = basicIO.getArgument('code');
        const datacenter = basicIO.getArgument('datacenter');

        const token_url = generateTokenUrl(datacenter);

        const data = {
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret: client_secret,
            code: code
        };

        const response = await fetch(token_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        });

        const token_data = await response.json();

        basicIO.write(JSON.stringify(token_data));
        context.log('Successfully executed Basic I/O function');
        context.close();
    } catch (error) {
        console.error(error);
        basicIO.setStatus(500);
        context.log('Error: Internal Server Error');
        context.log('Error Details:', error);
        context.close();
    }
}

function generateTokenUrl(datacenter) {
    switch (datacenter) {
        case 'IN':
            return 'https://accounts.zoho.in/oauth/v2/token';
        case 'EU':
            return 'https://accounts.zoho.eu/oauth/v2/token';
        default:
            return 'https://accounts.zoho.com/oauth/v2/token';
    }
}

module.exports = handler;
