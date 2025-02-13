const { Errors } = require('../../../enums');

module.exports = ({ config, realm }) => async (req, res, next) => {
  const { id, token, key } = req.params;

  let valid;
  if (typeof config.validateKey === 'function') {
    valid = await config.validateKey(key);
  }

  if (valid || key !== config.key) {
    return res.status(401).send(Errors.INVALID_KEY);
  }

  if (!id) {
    return res.sendStatus(401);
  }

  const client = realm.getClientById(id);

  if (!client) {
    return res.sendStatus(401);
  }

  if (client.getToken() && token !== client.getToken()) {
    return res.status(401).send(Errors.INVALID_TOKEN);
  }

  next();
};
