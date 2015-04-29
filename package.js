Package.describe({
  name: 'adeshpandey:stackoverflow',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Oauth Wrapper for Stack Overflow API ',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/adeshpandey/meteor-stackoverflow.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "request": "2.55.0"
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  /*api.use('gb96:zlib@1.0.5', ['client', 'server']);*/
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  
  api.export('StackOverFlow');

  api.addFiles(
    ['stackoverflow_configure.html', 'stackoverflow_configure.js'],
    'client');
  api.addFiles('stackoverflow_common.js', ['client', 'server']);
  api.addFiles('stackoverflow_server.js', 'server');
  api.addFiles('stackoverflow_client.js', 'client');
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('adeshpandey:stackoverflow');
  api.addFiles('stackoverflow-tests.js');
});

