const express = require('express');

module.exports = ({ config, realm }) => {
  const app = express.Router();

  // Retrieve guaranteed random ID.
  app.get('/id', (req, res) => {
    res.contentType = 'text/html';
    res.send(realm.generateClientId());
  });

  // Get a list of all peers for a key, enabled by the `allowDiscovery` flag.
  app.get('/peers', (req, res) => {
    if (config.allow_discovery) {
      const clientsIds = realm.getClientsIds();
      return res.send(clientsIds);
    }

    res.sendStatus(401);
  });

  // Check if peer is online
  app.get('/peers/:id', (req, res) => {
    const client = realm.getClientById(req.params.id);
    if (client) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });

  return app;
};
