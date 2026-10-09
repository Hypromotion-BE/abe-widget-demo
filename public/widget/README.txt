The widget build (abe-widget.js) is copied into this folder.

Every page loads it from /widget/abe-widget.js through region.js, which
chooses the region (US, UK or EU) from the page's own ?region= query
parameter. Until the file is present the pages render normally and the
script request simply returns 404.
