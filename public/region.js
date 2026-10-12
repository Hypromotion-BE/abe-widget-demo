(function () {
  var PATH_REGIONS = { us: 'US', uk: 'UK', de: 'EU' };
  var script = document.currentScript;
  var region = script ? (script.getAttribute('data-region') || '').toUpperCase() : '';
  if (region !== 'US' && region !== 'UK' && region !== 'EU') {
    var match = /^\/(us|uk|de)(\/|$)/.exec(window.location.pathname);
    region = match ? PATH_REGIONS[match[1]] : 'US';
  }

  var widget = document.createElement('script');
  widget.src = '/widget/abe-widget.js';
  widget.defer = true;
  widget.setAttribute('data-region', region);
  widget.setAttribute('data-assets-base-url', window.location.origin);
  document.body.appendChild(widget);
})();
