'use strict';

const Hapi = require('@hapi/hapi');

const Wreck = require('@hapi/wreck');
var request = require('request');
var GitHub = require('github-api');
const axios = require('axios');

const wreck = Wreck.defaults({
  headers: { 
    'authorization': `basic ${Buffer.from(`${USERNAME}:${API_KEY}`).toString(
      "base64"
    )}`,
   },
});

var options = {
  apiUrl: 'api.github.com',
  path: '/user'
};

const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
        routes: {
          cors: {
              origin: ['*'] // an array of origins or 'ignore'           
          }
      }
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (req, h) => {
          return 'Hapi js';
      }
   });

  server.route({
    method: 'GET',
    path: '/profile',
    handler:  async function (req, reply) {

      var config = {
        method: 'get',
        url: 'https://api.github.com/user',
        headers: { 
          'Accept': 'application/json', 
          'Authorization': 'Basic '+ req.headers['x-auth-token']
        }
      };

      try {
        let response = await axios(config)
        return JSON.stringify(response.data);
      } catch(e){
        console.error(e)
      }
      
      return {};
    }
    
  });

  server.route({
    method: 'GET',
    path: '/repositories',
    handler:  async function (req, reply) {
      
      var config = {
        method: 'get',
        url: 'https://api.github.com/user/repos',
        headers: { 
          'Accept': 'application/json', 
          'Authorization': 'Basic '+ req.headers['x-auth-token']
        }
      };

      try {
        let response = await axios(config)
        return JSON.stringify(response.data);
      } catch(e){
        console.error(e)
      }

      return [];
    }
    
  });

  
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();