(function () {
  var PATH_REGIONS = { us: 'US', uk: 'UK', de: 'EU' };
  var ENV_KEY = 'abe-demo-env';
  var ENVS = ['dev', 'prod'];
  var WIDGET_SRC = {
    dev: '/widget/abe-widget.js',
    prod: 'https://askbuyingexpert.com/widget/abe-widget.js'
  };
  // Chat state the widget keeps in the browser. Dev and prod share this origin,
  // so it is cleared when the environment changes.
  var CHAT_KEY_PREFIXES = ['askbe_chat:', 'askbe_chat_cleared:', 'askbe_chat_abort:'];
  var CHAT_KEYS = ['askbe_chat_panel_ui', 'askbe_session', 'lastActivity'];

  var script = document.currentScript;
  var region = script ? (script.getAttribute('data-region') || '').toUpperCase() : '';
  if (region !== 'US' && region !== 'UK' && region !== 'EU') {
    var match = /^\/(us|uk|de)(\/|$)/.exec(window.location.pathname);
    region = match ? PATH_REGIONS[match[1]] : 'US';
  }

  function readStored() {
    try {
      var value = window.localStorage.getItem(ENV_KEY);
      return ENVS.indexOf(value) !== -1 ? value : null;
    } catch (e) {
      return null;
    }
  }

  function store(env) {
    try { window.localStorage.setItem(ENV_KEY, env); } catch (e) { /* storage unavailable */ }
  }

  function clearChatState() {
    ['localStorage', 'sessionStorage'].forEach(function (name) {
      try {
        var area = window[name];
        var doomed = [];
        for (var i = 0; i < area.length; i++) {
          var key = area.key(i);
          var hit = CHAT_KEYS.indexOf(key) !== -1 || CHAT_KEY_PREFIXES.some(function (p) {
            return key.indexOf(p) === 0;
          });
          if (hit) doomed.push(key);
        }
        doomed.forEach(function (key) { area.removeItem(key); });
      } catch (e) { /* storage unavailable */ }
    });
  }

  var fromUrl = null;
  try {
    var param = (new URLSearchParams(window.location.search).get('env') || '').toLowerCase();
    if (ENVS.indexOf(param) !== -1) fromUrl = param;
  } catch (e) { /* ignore */ }

  var stored = readStored();
  var env = fromUrl || stored || 'dev';

  if (env !== (stored || 'dev')) clearChatState();
  if (fromUrl && fromUrl !== stored) store(fromUrl);

  function switchTo(next) {
    if (next === env) return;
    clearChatState();
    store(next);
    var url = new URL(window.location.href);
    url.searchParams.set('env', next);
    window.location.assign(url.toString());
  }

  function buildControl() {
    var box = document.createElement('div');
    box.className = 'env-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Widget environment');
    ENVS.forEach(function (name) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = name.toUpperCase();
      button.setAttribute('aria-pressed', name === env ? 'true' : 'false');
      button.addEventListener('click', function () { switchTo(name); });
      box.appendChild(button);
    });
    document.body.appendChild(box);
  }

  buildControl();

  var widget = document.createElement('script');
  widget.src = WIDGET_SRC[env];
  widget.defer = true;
  widget.setAttribute('data-region', region);
  widget.setAttribute('data-assets-base-url', window.location.origin);
  document.body.appendChild(widget);
})();
