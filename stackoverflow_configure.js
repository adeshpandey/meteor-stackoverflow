Template.configureLoginServiceDialogForStackoverflow.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForStackoverflow.fields = function () {
  return [
    {property: 'clientId', label: 'Client Id'},
    {property: 'secret', label: 'Client Secret'},
    {property: 'key', label: 'Key'},
  ];
};
