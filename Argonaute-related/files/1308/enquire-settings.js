// This loads JS files in the head element
function loadJS(url) {
   // adding the script tag to the head
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;
   // fire the loading
   head.appendChild(script);
 }

// Global name spaced variables.
var HPCarouselnumbertoMove = [], HPCarouselvisibleElements;

// Bespoke JS settings or workings bases on device width.
enquire.register("screen and (max-width:500px)", {
   match : function() {
      // Home page Featured Publication carousel - needs a reload of page to trigger these, not dynamicat present
      HPCarouselnumbertoMove = [1,2];
      HPCarouselvisibleElements = HPCarouselnumbertoMove.length;
   }
});
enquire.register("screen and (min-width:501px) and (max-width: 690px)", {
   match : function() {
      // Home page Featured Publication carousel - needs a reload of page to trigger these, not dynamicat present
      HPCarouselnumbertoMove = [1,2,3];
      HPCarouselvisibleElements = HPCarouselnumbertoMove.length;
   }
});
enquire.register("screen and (min-width: 691px) and (max-width:750px)", {
   match : function() {
      // Home page Featured Publication carousel - needs a reload of page to trigger these, not dynamicat present
      HPCarouselnumbertoMove = [1,2,3,4];
      HPCarouselvisibleElements = HPCarouselnumbertoMove.length;
   }
});
enquire.register("screen and (min-width:751px) and (max-width: 991px)", {
   match : function() {
      // Home page Featured Publication carousel - needs a reload of page to trigger these, not dynamicat present
      HPCarouselnumbertoMove = [1,2,3];
      HPCarouselvisibleElements = HPCarouselnumbertoMove.length;
   }
});
enquire.register("screen and (min-width:992px)", {
   match : function() {
      // Home page Featured Publication carousel - needs a reload of page to trigger these, not dynamic at present
      HPCarouselnumbertoMove = [1,2,3,4];
      HPCarouselvisibleElements = HPCarouselnumbertoMove.length;
   }
});
enquire.register("screen and (max-width:767px)", {
   match : function() {
      (function($) {
         $(document).ready(function() {
            var shareIcons = ['bibsonomy','blinklist','blogger','citeulike','digg','diigo','facebook','google','linkedin','stumbleupon','twitter'];
            $(".social.dropdown .bookmark_list li").clone().appendTo("ul.socialList").addClass("cloned-li");
            var ulShare = $(".cloned-li");
            $.each(ulShare, function(index) {
               $(this).addClass(shareIcons[index]);
               var thisLink = $(this).find("a");
               thisLink.addClass(shareIcons[index]);
               if (shareIcons[index] === 'diigo') {
                  thisLink.append("<span class=\"fa-stack\" title=\"Send to "+shareIcons[index]+"\"><img src=\"/images/" +shareIcons[index]+ "-icon.png\" alt=\"" +shareIcons[index]+ "\" /></span>");
               } else {
                  thisLink.append("<span class=\"fa-stack\" title=\"Send to "+shareIcons[index]+"\"><i class=\"fa fa-square fa-stack-2x\"></i><i class=\"fa fa-" + shareIcons[index] + " fa-stack-1x fa-inverse\"></i></span>");
               }
            });
            $(".social.dropdown").hide();

            // when account button clicked add class to sign in area container to create opacity area.
            $(".signin-section-nav-button").click(function() {
               $(".signin-tools").toggleClass("show-login-box");
            });

            // Tabbing in My Account, now has a accordian style feel to it, using this js and css tricks
            $("#tabbar #current").siblings("li").css("display","none");
            $("#tabbar #current").click(function() {
               $(this).siblings("li").toggle();
            });

            $(".search-dropdown-container").click(function() {
               $("#quicksearchform").toggleClass("expand-margin-mobile-search-dropdown");
            });
            $(".row.mainRow, .search-section-nav-button").click(function() {
               $("#quicksearchform").removeClass("expand-margin-mobile-search-dropdown");
            });
         }); // end doc ready
      })(jQuery);
   }
});
enquire.register("screen and (min-width:767px)", {
   match : function() {
      (function($) {
         $(document).ready(function(){
            // improved Social Icons work
            $(".social.dropdown").show();
            $(".cloned-li").remove();
         });
      })(jQuery);
   }
});
enquire.register("screen and (min-width:768px)", {
   match : function() {
      (function($) {
         $(document).ready(function() {
            // Tabbing in My Account, now has a accordian style feel to it, using this js and css tricks
            $("#tabbar #current").unbind("click");
            $("#tabbar #current").siblings("li").css("display","block");
         });
      })(jQuery);
   }
});
