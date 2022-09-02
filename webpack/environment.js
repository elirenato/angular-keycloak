module.exports = {
  I18N_HASH: 'generated_hash',
  SERVER_API_URL: process.env.hasOwnProperty('SERVER_API_URL') ? process.env.SERVER_API_URL : 'http://localhost:8081/',
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'DEV',
  __DEBUG_INFO_ENABLED__: false,
  KEYCLOAK_URL: process.env.hasOwnProperty('KEYCLOAK_URL') ? process.env.KEYCLOAK_URL : 'http://localhost:8080/auth',
  KEYCLOAK_REALM: process.env.hasOwnProperty('KEYCLOAK_REALM') ? process.env.KEYCLOAK_REALM : 'app',
  KEYCLOAK_CLIENT_ID: process.env.hasOwnProperty('KEYCLOAK_CLIENT_ID') ? process.env.KEYCLOAK_CLIENT_ID : 'angular-cli',
};
