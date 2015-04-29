// Request stackoverflow credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
StackOverFlow.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'stackoverflow'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('stackoverflow', config, options);

  var scope = [];
  if (options && options.requestPermissions) {    
      scope = options.requestPermissions.join('+');
  }

  var loginStyle = OAuth._loginStyle('stackoverflow', config, options);
  
  var loginUrl =
        'https://stackexchange.com/oauth' +
        '?client_id=' + config.clientId +
        '&scope=' + scope +
        '&redirect_uri=' + OAuth._redirectUri('stackoverflow', config) +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "stackoverflow",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
