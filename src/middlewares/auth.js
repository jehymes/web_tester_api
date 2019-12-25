const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) res.status(401).send({ error: "Token não informado" });

  const parts = authHeader.split(" ");
  if (!parts.length === 2) res.status(401).send({ error: "Token errado" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    res.status(401).send({ error: "Token mal formado" });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) res.status(401).send({ error: "Token inválido" });

    req.userId = decoded.id;
    return next();
  });
};
