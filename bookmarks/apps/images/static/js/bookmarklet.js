// Stupidly copied from a book and seems very dirty to me.
(function(){
  const JQUERY_VERSION = '3.5.1';
  const SITE_URL = 'https://321c11a717c7.ngrok.io/';
  const STATIC_URL = `${SITE_URL}static/`;
  // Minimal image size for add to bookmarklet.
  const MIN_WIDTH = 100;
  const MIN_HEIGHT = 100;
  const JQUERY_TIMEOUT_ATTEMPTS = 250;

  function bookmarklet(msg) {
    // Loading CSS styles (`bookmarklet.css`). `new Date().getTime()` returns
    // an integer to prevent caching bookmarklet by the browser for loading it
    // on change.
    let css = jQuery('<link>');
    css.attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: `${STATIC_URL}css/bookmarklet.css?r=${new Date().getTime()}`
    });
    jQuery('head').append(css);

    // Load HTML
    box_html = [
        '<div id="bookmarklet"><a href="#" id="close">&times;</a>',
        '<h1>Select an image to bookmark:</h1><div class="images"></div></div>'
    ].join('');

    // Add all finded images from a third-party site to its `<body>`.
    jQuery('body').append(box_html);

    // An event that removes the injected code. Use the selector
    // `#bookmarklet # close` to find an element with id` close` and parent
    // with id `bookmarklet`.
    // Details: https: //api.jquery.com/category/selectors
    jQuery('#bookmarklet #close').click(function(){
      jQuery('#bookmarklet').remove();
    });

    // Find images and display them.
    jQuery.each(jQuery('img[src$="jpg"]'), function(index, image) {
      if (jQuery(image).width() >= MIN_WIDTH
          && jQuery(image).height() >= MIN_HEIGHT)
      {
        let image_url = jQuery(image).attr('src');
        jQuery('#bookmarklet .images')
            .append(`<a href="#"><img src="${image_url}"></a>`);
      }
    });

    // When an image is selected open URL with it.
    jQuery('#bookmarklet .images a').click(function(e){
      selected_image = jQuery(this).children('img').attr('src');

      // Hide bookmarklet.
      jQuery('#bookmarklet').hide();

      // Open new window to submit the image.
      let url = [
        SITE_URL,
        'images/create/?url=',
        encodeURIComponent(selected_image),
        '&title=',
        encodeURIComponent(jQuery('title').text()),
        '_blank'
      ].join('');

      window.open(url);
    });
  }

  // If `JQuery` has not loaded yet - loads it. If the library is already
  // connected - run `bookmarklet()`.

  // Check if jQuery is loaded.
  if(typeof window.jQuery != 'undefined') {
    bookmarklet();
  } else {
    // Check for conflicts.
    // var conflict = typeof window.$ != 'undefined';

    // Create the script and point to Google API.
    let script = document.createElement('script');
    const JQUERY_URL = [
      `http://ajax.googleapis.com/ajax/libs/jquery/${JQUERY_VERSION}`,
      '/jquery.min.js'
    ].join('');
    script.setAttribute('src', JQUERY_URL);
    // Add the script to the `<head>` for processing.
    document.getElementsByTagName('head')[0].appendChild(script);
    // Add the ability to use multiple JQuery load attempts.
    let attempts = 15;
    (function(){
      // Check again if jQuery is undefined.
      if(typeof window.jQuery == 'undefined') {
        if(--attempts > 0) {
          // Calls himself in a few milliseconds.
          // if not loaded - try again.
          window.setTimeout(arguments.callee, JQUERY_TIMEOUT_ATTEMPTS);
        } else {
          // Too much attempts to load, send error.
          console.log('An error ocurred while loading jQuery');
        }
      } else {
          bookmarklet();
      }
    })();
  }

})();
