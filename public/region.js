(function () {
  var REGIONS = ['US', 'UK', 'EU'];
  var params = new URLSearchParams(window.location.search);
  var requested = (params.get('region') || '').toUpperCase();
  var region = REGIONS.indexOf(requested) !== -1 ? requested : 'US';

  function withRegion(href) {
    var url = new URL(href, window.location.href);
    url.searchParams.set('region', region);
    return url.pathname + url.search + url.hash;
  }

  var switcher = document.getElementById('region-switch');
  if (switcher) {
    var label = document.createElement('span');
    label.className = 'region-label';
    label.textContent = 'Region';
    switcher.appendChild(label);
    REGIONS.forEach(function (code) {
      var link = document.createElement('a');
      var url = new URL(window.location.href);
      url.searchParams.set('region', code);
      link.href = url.pathname + url.search;
      link.textContent = code;
      if (code === region) link.setAttribute('aria-current', 'true');
      switcher.appendChild(link);
    });
  }

  var links = document.querySelectorAll('a[data-keep-region]');
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute('href', withRegion(links[i].getAttribute('href')));
  }

  var widget = document.createElement('script');
  widget.src = '/widget/abe-widget.js';
  widget.defer = true;
  widget.setAttribute('data-region', region);
  widget.setAttribute('data-base-url', window.location.origin);
  document.body.appendChild(widget);
})();
