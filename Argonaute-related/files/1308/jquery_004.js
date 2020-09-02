/* http://keith-wood.name/bookmark.html
   Sharing bookmarks for jQuery v1.4.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
   Please attribute the author if you use it. */

/* Allow your page to be shared with various bookmarking sites.
   Attach the functionality with options like:
   $('div selector').bookmark({sites: ['digg']});
*/

(function($) { // Hide scope, no $ conflict

var PROP_NAME = 'bookmark';

/* Bookmark sharing manager. */
function Bookmark() {
   this._defaults = {
      url: '',  // The URL to bookmark, leave blank for the current page
      sourceTag: '', // Extra tag to add to URL to indicate source when it returns
      title: '',  // The title to bookmark, leave blank for the current one
      description: '',  // A longer description of the site
      sites: [],  // List of site IDs or language selectors (lang:xx) or
         // category selectors (category:xx) to use, empty for all
      iconsStyle: 'bookmark_icons', // CSS class for site icons
      icons: 'bookmarks.png', // Horizontal amalgamation of all site icons
      iconSize: 16,  // The size of the individual icons
      iconCols: 16,  // The number of icons across the combined image
      target: '_blank',  // The name of the target window for the bookmarking links
      compact: true,  // True if a compact presentation should be used, false for full
      hint: 'Send to {s}',  // Popup hint for links, {s} is replaced by display name
      popup: false, // True to have it popup on demand, false to show always
      popupText: 'Bookmark this site...', // Text for the popup trigger
      addFavorite: false,  // True to add a 'add to favourites' link, false for none
      favoriteText: 'Favorite',  // Display name for the favourites link
      favoriteIcon: 0,  // Icon for the favourites link
      addEmail: false,  // True to add a 'e-mail a friend' link, false for none
      emailText: 'E-mail',  // Display name for the e-mail link
      emailIcon: 1,  // Icon for the e-mail link
      emailSubject: 'Interesting page',  // The subject for the e-mail
      emailBody: 'I thought you might find this page interesting:\n{t} ({u})', // The body of the e-mail,
         // use '{t}' for the position of the page title, '{u}' for the page URL,
         // '{d}' for the description, and '\n' for new lines
      manualBookmark: 'Please close this dialog and\npress Ctrl-D to bookmark this page.',
         // Instructions for manually bookmarking the page
      addShowAll: false, // True to show listed sites first, then all on demand
      showAllText: 'Show all ({n})', // Display name for show all link, use '{n}' for the number of sites
      showAllIcon: 2, // Icon for show all link
      showAllTitle: 'All bookmarking sites', // Title for show all popup
      onSelect: null, // Callback on selection
      addAnalytics: false, // True to include Google Analytics for links
      analyticsName: '/share/{r}/{s}' // The "URL" that is passed to the Google Analytics,
         // use '{s}' for the site code, '{n}' for the site name,
         // '{u}' for the current full URL, '{r}' for the current relative URL,
         // or '{t}' for the current title
   };
   this._sites = {  // The definitions of the available bookmarking sites, in URL use
      // '{u}' for the page URL, '{t}' for the page title, and '{d}' for the description
      'bibsonomy': {display: 'BibSonomy', icon: 53, lang: 'en', category: 'bookmark',
         url: 'http://www.bibsonomy.org/BibtexHandler?requTask=upload&amp;url={u}&amp;description={t}'},
      'blinklist': {display: 'BlinkList', icon: 57, lang: 'en', category: 'bookmark',
         url: 'http://www.blinklist.com/index.php?Action=Blink/addblink.php&amp;Url={u}&amp;Title={t}'},
      'blogger': {display: 'Blogger', icon: 5, lang: 'en', category: 'blog',
         url: 'http://www.blogger.com/blog_this.pyra?t=&amp;u={u}&amp;n={t}'},
      'citeulike': {display: 'citeulike', icon: 84, lang: 'en', category: 'bookmark',
         url: 'http://www.citeulike.org/posturl?url={u}&amp;title={t}'},
      'digg': {display: 'Digg', icon: 7, lang: 'en', category: 'news',
         url: 'http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}'},
      'diigo': {display: 'Diigo', icon: 8, lang: 'en', category: 'social',
         url: 'http://www.diigo.com/post?url={u}&amp;title={t}'},
      'facebook': {display: 'Facebook', icon: 10, lang: 'en', category: 'social',
         url: 'http://www.facebook.com/sharer.php?u={u}&amp;t={t}'},
      'google': {display: 'Google', icon: 12, lang: 'en', category: 'bookmark',
         url: 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={u}&amp;title={t}'},
      'linkedin': {display: 'LinkedIn', icon: 15, lang: 'en', category: 'social',
         url: 'http://www.linkedin.com/shareArticle?mini=true&amp;url={u}&amp;title={t}&amp;ro=false&amp;summary={d}&amp;source='},
      'stumbleupon': {display: 'StumbleUpon', icon: 22, lang: 'en', category: 'bookmark',
         url: 'http://www.stumbleupon.com/submit?url={u}&amp;title={t}'},
      'twitter':{display: 'twitter', icon: 26, lang: 'en', category: 'blog',
         url: 'http://twitter.com/home?status={t}%20{u}'}
   };
   this.commonSites = [];
   for (var id in this._sites) {
      this.commonSites.push(id);
   }
}

$.extend(Bookmark.prototype, {
   /* Class name added to elements to indicate already configured with bookmarking. */
   markerClassName: 'hasBookmark',

   /* Override the default settings for all bookmarking instances.
      @param  settings  (object) the new settings to use as defaults
      @return void */
   setDefaults: function(settings) {
      extendRemove(this._defaults, settings || {});
      return this;
   },

   /* Add a new bookmarking site to the list.
      @param  id        (string) the ID of the new site
      @param  display   (string) the display name for this site
      @param  icon      (string) the location (URL) of an icon for this site (16x16), or
                        (number) the index of the icon within the combined image
      @param  lang      (string) the language code for this site
      @param  category  (string) the category for this site
      @param  url       (string) the submission URL for this site,
                        with {u} marking where the current page's URL should be inserted,
                        and {t} indicating the title insertion point
      @return this singleton */
   addSite: function(id, display, icon, lang, category, url) {
      this._sites[id] = {display: display, icon: icon, lang: lang, category: category, url: url};
      return this;
   },

   /* Return the list of defined sites.
      @return  (object[]) indexed by site id (string), each object contains
               display (string) the display name,
               icon    (string) the location of the icon, or
                       (number) the icon's index in the combined image
               lang    (string) the language code for this site
               url     (string) the submission URL for the site */
   getSites: function() {
      return this._sites;
   },

   /* Attach the bookmarking widget to a div.
      @param  target    (element) the bookmark container
      @param  settings  (object) the settings for this container */
   _attachBookmark: function(target, settings) {
      target = $(target);
      if (target.hasClass(this.markerClassName)) {
         return;
      }
      target.addClass(this.markerClassName);
      this._updateBookmark(target, settings);
   },

   /* Reconfigure the settings for a bookmarking div.
      @param  target    (element) the bookmark container
      @param  settings  (object) the new settings for this container or
                        (string) a single setting name
      @param  value     (any) the single setting's value */
   _changeBookmark: function(target, settings, value) {
      target = $(target);
      if (!target.hasClass(this.markerClassName)) {
         return;
      }
      if (typeof settings == 'string') {
         var name = settings;
         settings = {};
         settings[name] = value;
      }
      this._updateBookmark(target, settings);
   },

   /* Construct the requested bookmarking links.
      @param  target    (element) the bookmark container
      @param  settings  (object) the settings for this container */
   _updateBookmark: function(target, settings) {
      var oldSettings = $.data(target[0], PROP_NAME) || $.extend({}, this._defaults);
      settings = extendRemove(oldSettings, settings || {});
      $.data(target[0], PROP_NAME, settings);
      var sites = settings.sites;
      if (sites.length == 0) { // All sites
         $.each($.bookmark._sites, function(id) {
            sites.push(id);
         });
         sites.sort();
      } else {
         $.each(sites, function(index, value) {
            var lang = value.match(/lang:(.*)/); // Select by language
            if (lang) {
               $.each($.bookmark._sites, function(id, site) {
                  if (site.lang == lang[1] && $.inArray(id, sites) == -1) {
                     sites.push(id);
                  }
               });
            }
            var category = value.match(/category:(.*)/); // Select by category
            if (category) {
               $.each($.bookmark._sites, function(id, site) {
                  if (site.category == category[1] && $.inArray(id, sites) == -1) {
                     sites.push(id);
                  }
               });
            }
         });
      }
      target.empty();
      var container = target;
      if (settings.popup) {
         target.append('<a href="#" class="bookmark_popup_text">' + settings.popupText + '</a>');
         container = $('<div class="bookmark_popup"></div>').appendTo(target);
      }
      var details = $.bookmark._getSiteDetails(settings);
      var list = $('<ul class="bookmark_list' +
         (settings.compact ? ' bookmark_compact' : '') + '"></ul>').appendTo(container);
      if (settings.addFavorite) {
         $.bookmark._addOneSite(settings, list, settings.favoriteText, settings.favoriteIcon, '#', function() {
               $.bookmark._addFavourite(details.url.replace(/'/g, '\\\''), details.title.replace(/'/g, '\\\''));
               return false;
            });
      }
      if (settings.addEmail) {
         $.bookmark._addOneSite(settings, list, settings.emailText, settings.emailIcon,
            'mailto:?subject=' + encodeURIComponent(settings.emailSubject) +
            '&amp;body=' + encodeURIComponent(settings.emailBody.
            replace(/\{u\}/, details.url).replace(/\{t\}/, details.title).replace(/\{d\}/, details.desc)));
      }
      $.bookmark._addSelectedSites(sites, details, settings, list);
      if (settings.addShowAll) {
         var count = 0;
         for (var n in $.bookmark._sites) {
            count++;
         }
         var showAll = settings.showAllText.replace(/\{n\}/, count);
         $.bookmark._addOneSite(settings, list, showAll, settings.showAllIcon, '#', function() {
               $.bookmark._showAll(this, settings);
               return false;
            }, showAll);
      }
      if (settings.popup) {
         target.find('.bookmark_popup_text').click(function() {
            var target = $(this).parent();
            var offset = target.offset();
            target.find('.bookmark_popup').css('left', offset.left).
               css('top', offset.top + target.outerHeight()).toggle();
            return false;
         });
         $(document).click(function(event) { // Close on external click
            target.find('.bookmark_popup').hide();
         });
      }
   },

   /* Add all the selected sites to the list.
      @param  sites     (string[]) the IDs of the selected sites
      @param  details   (object) details about this page
      @param  settings  (object) the bookmark settings
      @param  list      (jQuery) the list to add to */
   _addSelectedSites: function(sites, details, settings, list) {
      $.each(sites, function(index, id) {
         var site = $.bookmark._sites[id];
         if (site) {
            $.bookmark._addOneSite(settings, list, site.display, site.icon, (settings.onSelect ? '#' :
               site.url.replace(/\{u\}/, details.url2 + (details.sourceTag ? details.sourceTag + id : '')).
               replace(/\{t\}/, details.title2).replace(/\{d\}/, details.desc2)),
               function() {
                  $('#bookmark_all').remove();
                  $(document).unbind('click.bookmark');
                  if (settings.onSelect) {
                     $.bookmark._selected($(this).closest('.' + $.bookmark.markerClassName)[0], id);
                     return false;
                  }
                  return true;
               });
         }
      });
   },

   /* Add a single site to the list.
      @param  settings  (object) the bookmark settings
      @param  list      (jQuery) the list to add to
      @param  display   (string) the display name for this site
      @param  icon      (string) the location (URL) of an icon for this site (16x16), or
                        (number) the index of the icon within the combined image
      @param  url       (string) the URl for this site
      @param  onclick   (function, optional) additional processing for this link
      @param  hint      (string, optional) the hint text to use for this link */
   _addOneSite: function(settings, list, display, icon, url, onclick, hint) {
      var hintFormat = settings.hint || '{s}';
      var html = '<li><a href="' + url + '"' +
         (settings.target ? ' target="' + settings.target + '"' : '') + '>';
      if (icon != null) {
         var title = hint || hintFormat.replace(/\{s\}/, display);
         if (typeof icon == 'number') {
            html += '<span title="' + title + '" ' +
               (settings.iconsStyle ? 'class="' + settings.iconsStyle + '" ' : '') +
               'style="' + (settings.iconsStyle ? 'background-position: ' :
               'background: transparent url(' + settings.icons + ') no-repeat ') + '-' +
               ((icon % settings.iconCols) * settings.iconSize) + 'px -' +
               (Math.floor(icon / settings.iconCols) * settings.iconSize) + 'px;' +
               // ($.browser.mozilla && $.browser.version < '1.9' ? ' padding-left: ' + settings.iconSize + 'px; padding-bottom: ' + (Math.max(0, settings.iconSize - 16)) + 'px;' : '')
               '' // browser never mozilla < 1.9!!!
               + '"></span>';
         } else {
            html += '<img src="' + icon + '" alt="' + title + '" title="' +
               title + '"'
               // + (($.browser.mozilla && $.browser.version < '1.9') ||
               // ($.browser.msie && $.browser.version < '7.0') ?
               // ' style="vertical-align: bottom;"' :
               // ($.browser.msie ? ' style="vertical-align: middle;"' :
               // ($.browser.opera || $.browser.safari ?
               // ' style="vertical-align: baseline;"' : '')))
               // don't style the img - let CSS do it!!!
               + '/>';
         }
         html +=   (settings.compact ? '' : '&#xa0;');
      }
      html +=   (settings.compact ? '' : display) + '</a></li>';
      html = $(html).appendTo(list);
      if (onclick) {
         html.find('a').click(onclick);
      }
   },

   /* Remove the bookmarking widget from a div.
      @param  target  (element) the bookmark container */
   _destroyBookmark: function(target) {
      target = $(target);
      if (!target.hasClass(this.markerClassName)) {
         return;
      }
      target.removeClass(this.markerClassName).empty();
      $.removeData(target[0], PROP_NAME);
   },

   /* Callback when selected.
      @param  target  (element) the target div
      @param  siteID  (string) the selected site ID */
   _selected: function(target, siteID) {
      var settings = $.data(target, PROP_NAME);
      var site = $.bookmark._sites[siteID];
      var details = $.bookmark._getSiteDetails(settings);
      settings.onSelect.apply(target, [siteID, site.display, site.url.replace(/&amp;/g,'&').
         replace(/\{u\}/, details.url2 + (details.sourceTag ? details.sourceTag + siteID : '')).
         replace(/\{t\}/, details.title2).replace(/\{d\}/, details.desc2)]);
   },

   /* Add the current page as a favourite in the browser.
      @param  url    (string) the URL to bookmark
      @param  title  (string) the title to bookmark */
   _addFavourite: function(url, title) {
      // if ($.browser.msie) {
      // old version ... below grabbed from stackoverflow!!!
      if (navigator.userAgent.match(/msie/i)) {
         window.external.addFavorite(url, title);
      } else {
         alert(this._defaults.manualBookmark);
      }
   },

   /* Show all sites in a popup list.
      @param  elem      (element) the clicked 'Show all' link
      @param  settings  (object) the bookmark settings */
   _showAll: function(elem, settings) {
      var sites = [];
      $.each($.bookmark._sites, function(id) {
         sites.push(id);
      });
      sites.sort();
      var details = $.bookmark._getSiteDetails(settings);
      var list = $('<ul class="bookmark_list"></ul>');
      var saveCompact = settings.compact;
      settings.compact = false;
      $.bookmark._addSelectedSites(sites, details, settings, list);
      settings.compact = saveCompact;
      var all = $('<div id="bookmark_all"><p>' + settings.showAllTitle + '</p></div>').
         append(list).appendTo('body');
      all.css({left: ($(window).width() - all.width()) / 2, top: ($(window).height() - all.height()) / 2}).show();
      $(document).bind('click.bookmark', function(event) {
         if ($(event.target).closest(elem).length == 0 && $(event.target).closest('#bookmark_all').length == 0) {
            $('#bookmark_all').remove();
            $(document).unbind('click.bookmark');
         }
      });
   },

   /* Retrieve details about the current site.
      @param  settings  (object) the bookmark settings
      @return  (object) the site details */
   _getSiteDetails: function(settings) {
      var url = settings.url || window.location.href;
      var title = settings.title || document.title || $('h1:first').text();
      var desc = settings.description || $('meta[name="description"]').attr('content') || '';
      var sourceTag = (!settings.sourceTag ? '' :
         encodeURIComponent((url.indexOf('?') > -1 ? '&' : '?') + settings.sourceTag + '='));
      return {url: url, title: title, desc: desc, relUrl: url.replace(/^.*\/\/[^\/]*\//, ''),
         sourceTag: sourceTag, url2: encodeURIComponent(url),
         title2: encodeURIComponent(title), desc2: encodeURIComponent(desc)};
   }
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
   $.extend(target, props);
   for (var name in props) {
      if (props[name] == null) {
         target[name] = null;
      }
   }
   return target;
}

/* Attach the bookmarking functionality to a jQuery selection.
   @param  command  (string) the command to run (optional, default 'attach')
   @param  options  (object) the new settings to use for these bookmarking instances
   @return  (jQuery object) for chaining further calls */
$.fn.bookmark = function(options) {
   var otherArgs = Array.prototype.slice.call(arguments, 1);
   return this.each(function() {
      if (typeof options == 'string') {
         if (!$.bookmark['_' + options + 'Bookmark']) {
            throw 'Unknown operation: ' + options;
         }
         $.bookmark['_' + options + 'Bookmark'].
            apply($.bookmark, [this].concat(otherArgs));
      } else {
         $.bookmark._attachBookmark(this, options || {});
      }
   });
};

/* Initialise the bookmarking functionality. */
$.bookmark = new Bookmark(); // singleton instance

})(jQuery);

$(document).ready(function () {
   /* bookmarks - November 2017 */
   $('#selectBookmark').bookmark({sites: ['bibsonomy','blinklist','blogger','citeulike','digg','diigo','facebook','google','linkedin','stumbleupon','twitter']});

   /* ga-event-tracking bookmarking buttons selection */
   $('#selectBookmark ul li a').on("click", function() {
      gaEventCategory = "share";
      gaEventAction = "button-click";
      gaEventLabel = $(this).children("span").attr("title");
      ga('send', 'pageview', 'share button-click ' + gaEventLabel)
   });

   /* ga-event-tracking adverts mouseover */
   $('#carousel-example-generic-sidebar').on("mouseenter", "div div", function() {
      gaEventCategory = "sidebar-advert";
      gaEventAction = "advert-mouseover";
      gaEventLabel = $(this).children("a").attr("title");
      ga('send', 'pageview', 'sidebar-advert advert-mouseover ' + gaEventLabel)
   });
   /* ga-event-tracking adverts selection */
   $('#carousel-example-generic-sidebar').on("click", "div div a", function() {
      gaEventCategory = "sidebar-advert";
      gaEventAction = "advert-click";
      gaEventLabel = $(this).attr("title");
      ga('send', 'pageview', 'sidebar-advert advert-click ' + gaEventLabel)
   });
   /* ga-event-tracking publisher adverts mouseover */
   $('#carousel-example-publisher-sidebar').on("mouseenter", "div div", function() {
      gaEventCategory = "publisher-advert";
      gaEventAction = "advert-mouseover";
      gaEventLabel = $(this).children("a").attr("title");
      ga('send', 'pageview', 'publisher-advert advert-mouseover ' + gaEventLabel)
   });
   /* ga-event-tracking publisher adverts selection */
   $('#carousel-example-publisher-sidebar').on("click", "div div a", function() {
      gaEventCategory = "publisher-advert";
      gaEventAction = "advert-click";
      gaEventLabel = $(this).attr("title");
      ga('send', 'pageview', 'publisher-advert advert-click ' + gaEventLabel)
   });
   /* ga-event-tracking library adverts mouseover */
   $('#carousel-example-library-sidebar').on("mouseenter", "div div", function() {
      gaEventCategory = "library-advert";
      gaEventAction = "advert-mouseover";
      gaEventLabel = $(this).children("a").attr("title");
      ga('send', 'pageview', 'library-advert advert-mouseover ' + gaEventLabel)
   });
   /* ga-event-tracking publisher adverts selection */
   $('#carousel-example-library-sidebar').on("click", "div div a", function() {
      gaEventCategory = "library-advert";
      gaEventAction = "advert-click";
      gaEventLabel = $(this).attr("title");
      ga('send', 'pageview', 'library-advert advert-click ' + gaEventLabel)
   });
});



