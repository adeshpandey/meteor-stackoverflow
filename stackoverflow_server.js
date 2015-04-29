var OAuth = Package.oauth.OAuth;

var urlUtil = Npm.require('url');
var zlib    = Npm.require('zlib');
var request = Npm.require("request");


OAuth.registerService('stackoverflow', 2, null, function(query) {
  
  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  
  serviceData = {
      accessToken: accessToken,
      expiresAt: (+new Date) + (1000 * response.expiresIn)
    };
    result;

  var identity = getIdentity(accessToken);
  
  return result;
});

var getExtraData = function(accessToken, extraFields, fields) {
  var url = 'https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow/~:(' + extraFields + ')';
  var response = Meteor.http.get(url, {
    params: {
      oauth2_access_token: accessToken,
      format: 'json'
    }
  }).data;
  return _.extend(fields, response);
}

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {

  var config = ServiceConfiguration.configurations.findOne({service: 'stackoverflow'});
  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  var responseContent;
  try {

    //Request an access token
    responseContent = Meteor.http.post(
       "https://stackexchange.com/oauth/access_token", {
         headers:{'content-type': 'application/x-www-form-urlencoded'},
         params: {
           client_id: config.clientId,
           client_secret: OAuth.openSecret(config.secret),
           code: query.code,
           redirect_uri: OAuth._redirectUri('stackoverflow', config)
         }
       }).content;
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with StackOverflow. " + err.message);
  }

  responseContentArray = {};
  responseContent.split("&").forEach(function(e,i,a){ var elem = e.split('=');responseContentArray[elem[0]]=elem[1]; });

  // Success! Extract access token and expiration
  var parsedResponse = responseContentArray;
  var accessToken = parsedResponse.access_token;
  var expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error("Failed to complete OAuth handshake with StackOverflow " +
      "-- can't find access token in HTTP response. " + responseContent);
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn
  };
};

var getIdentity = function (accessToken,response) {
  
  try {
    var config = ServiceConfiguration.configurations.findOne({service: 'stackoverflow'});

    request({url:"https://api.stackexchange.com/2.2/me?site=stackoverflow&access_token="+accessToken+"&key="+config.key,encoding:null},function(e,r,b){
      zlib.gunzip(new Buffer(b,'utf-8'),function(e,r){
        identity=r.toString('utf-8');

          identity = JSON.parse(identity)['items'][0];
          
          createServiceData(identity);

      });
    });
  } catch (err) {
    throw new Error("Failed to fetch identity from StackOverflow. " + err.message);
  }
};

var createServiceData = function(identity){

    serviceData["id"] = identity.user_id;
    result = {
      serviceData: serviceData,
      options: {
        profile: {name:identity.display_name,profile_image:identity.profile_image,website_url:identity.website_url,link:identity.link,reputation:identity.reputation,badge_counts:identity.badge_counts}
      }
    };
    return result;
};
StackOverFlow.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
