/**
 *
 *
 */
function myFullTextPopUp() {
   // remove spinner once full text popup had loaded, needed due to some times a lag in loading no idea if its failed or not
   $(".fullTextIframe").removeClass("progress");
}

$(document).ready(function() {
   var ajaxCall = {
      /*
       * @param    string    typeOfCall
       * @param    string    urlToGet
       * @param    string    element
       * @param    string    errorMessage
       * @param    boolean   replace
       * @param    function  successCallFunction optional
       * @param    function  completeCallFunction optional
       */
      call: function(typeOfCall, urlToGet, element, errorMessage, replace, successCallFunction, completeCallFunction) {
         var $element = $(element),
             TIMEOUT = 200000; // Timeout in milliseconds...
         if ($element.hasClass("loaded")) {
            // alert ("called before and now loaded.");
         } else {
            $element.addClass("progress");
            $.ajax({
               type: typeOfCall,
               url: urlToGet,
               dataType: "html",
               timeout: TIMEOUT,
               success:function(dataResp) {
            	   var replacebody;
            	   //if ahah url contains param format=ahah then don't do any 
            	   //stripping of HTML response since it should already be stripped
            	   if (urlToGet.indexOf('format=ahah') !== -1) {
            		   replacebody = dataResp;
            	   } else {
            		   //this is fail safe to make sure we dont break the application somewhere else 
            		   replacebody = dataResp.substring(dataResp.indexOf("<div"),dataResp.lastIndexOf("</div>")+6);
            	   }
                   if (replace) {
                      $element.html(replacebody);
                   } else {
                      $element.append(replacebody);
                   }
                   if (typeof successCallFunction === "function") {
                      successCallFunction();
                   }
                },
               error:function(Xhr, statusMsg) {
                  $element.html(errorMessage);
                  // alert ("error: " + errorMessage);
               },
               complete:function(Xhr, statusMsg) {
                  $element.removeClass("progress");
                  if (typeof completeCallFunction === "function") {
                     completeCallFunction();
                  }
                  $element.addClass("loaded");
               }
            });
         }
      }
   };

   $("#sign-in-container .signInLink").on("click", function(evt) {
      evt.preventDefault();
      var $this = $(this),
          $siForm = $("#sign-in-container #sign-in-form"),
          $siIcon = $("#sign-in-container .signInLink .fa");
      if ($this.hasClass("open")) {
         $siForm.slideUp();
         $this.removeClass("open");
         $siIcon.removeClass("fa-minus").addClass("fa-plus");
      } else {
         $siForm.slideDown();
         $this.addClass("open");
         $siIcon.removeClass("fa-plus").addClass("fa-minus");
      }
   });

   $(".searchoptionmenu").on("click", ".searchoption", function(e) {
      var $this = $(this),
          $qsForm = $("#quicksearchform");
      if ($("#search-value1").val() !== "") {
         if ($this.hasClass("searchall")) {
            $(".navitem_search #option1").val("tka");
         }
         if ($this.hasClass("searchtitle")) {
            $(".navitem_search #option1").val("title");
         }
         if ($this.hasClass("searchfull")) {
            $(".navitem_search #option1").val("fulltext");
         }
         if ($this.hasClass("searchkeywords")) {
            $(".navitem_search #option1").val("keywords");
         }
         if ($this.hasClass("searchpubtitle")) {
            $qsForm.append("<input type='hidden' name='database' value='2' />");
            $qsForm.find("#option1").remove();
            $qsForm.append("<input type='hidden' name='title' value='" + $("#search-value1").val() + "' />");
            $qsForm.find("#search-value1").attr("name","x");
         }
         if ($this.hasClass("searchauthor")) {
            $qsForm.append("<input type='hidden' name='option2' value='author' />");
            $qsForm.find("#option1").remove();
            $qsForm.append("<input type='hidden' name='value2' value='" + $("#search-value1").val() + "' />");
            $qsForm.find("#search-value1").attr("name","x");
         }
         if ($this.hasClass("searchsubscriptions")) {
            $qsForm.append("<input type='hidden' name='freetype' value='subscribed' />");
         }
         if ($this.hasClass("searchoa")) {
            $qsForm.append("<input type='hidden' name='freetype' value='openaccess' />");
         }
         if ($this.hasClass("searchfree")) {
            $qsForm.append("<input type='hidden' name='freetype' value='freecontent' />");
         }
         if ($this.hasClass("searchallaccess")) {
            $qsForm.append("<input type='hidden' name='freetype' value='allfree' />");
         }
         $qsForm.submit();
      } else {
         alert("Please enter a search term first before choosing a filter option");
      }
      return false;
   });

   $(document).on("mouseover", "#subjectarea", function(e) {
      $("#subjectlist").show();
   });

   $(document).on("mouseout", "ul.toprightsidenav", function(e) {
      $("#subjectlist").hide();
   });

   // 508 accessibility work, get focus if error logging in
   if ($("#form-signin .error").length > 0 ) { // checks for error message then give focus to username input
      $(".navbar-toggle.signin-section-nav-button").trigger("click");
      $(".signInLink").addClass("open");
      // $(".signInLink").trigger("click");
      $(".signin-tools").toggleClass("show-login-box");
      $("#username").trigger("focus");
      $(".signInLink").trigger("click");
   }

   // share icons in more drop down need a link to get focus to trigger a drop down.
   $(".shareContent").on("click", ".Section508Share", function(e) {
      e.preventDefault();
   });

   $(".shareContent").on("focus", ".Section508Share", function(e) {
      $(this).parent().addClass("open");
   });


   $("form.advancedSearch").submit(function(e) {
      if ($("#title-box").val() === "" && $("#author").val() === "" && $("#journal-box").val() === "") {
         e.preventDefault();
         $("#title-box").trigger("focus");
         $(".searchForFields .rust").append("<div class=\"searcherror\">A search term, author or publication title is required</div>");
      }
   });

   // Clear error messages (if any) on re-entering details...
   $("#search-form").on("keypress", "#author, #journal-box, #title-box", function() {
      $(".searcherror").remove();
   });

   if ($(".perRegLogin .error").length > 0) {
      var $el = $(".perRegLogin .error").parent().find('input');
      $el.addClass("invalidField");
      // not functional?
      // $el[0].trigger("focus");
   }

   $(document).on("keypress", ".form-input-text.invalidField", function(e) {
      $(this).parent().find(".error").remove();
   });

   $(document).on("click", ".expandlinks", function(e) {
      e.preventDefault();
      var $this = $(this);
      if ($this.find(".plus").hasClass("hide")) {
         $this.find(".plus").removeClass("hide");
         $this.find(".minus").addClass("hide");
         $this.parent("span").parent("li").find(".expandable").slideUp();
      }  else {
         $this.find(".plus").addClass("hide");
         $this.find(".minus").removeClass("hide");
         $this.parent("span").parent("li").find(".expandable").slideDown();
      }
   });

   $(".expandlinks").click();

   function handleFilterOptions(e) {
      var $filterform = $("#filterform"),
          classList = e.target.classList,
          ok2Submit = false,
          newInput = "",
          newValue = "";
      if (classList.contains("allfilter")) {
         newValue = "all";
         ok2Submit = true;
      }
      if (classList.contains("subsfilter")) {
         newValue = "subs";
         ok2Submit = true;
      }
      if (classList.contains("freefilter")) {
         newValue = "free";
         ok2Submit = true;
      }
      if (ok2Submit) {
         newInput = "<input type='hidden' value='" + newValue + "' name='j_availability' />";
         $filterform.append(newInput);
         $filterform.submit();
      }
   }

   $(".filteroptions").on("click", handleFilterOptions);

   $(".searchoptionsbutton").on("click", function(e) {
      e.preventDefault();
      return false;
   });

   $(".printButton").on("click", function(e) {
      window.print();
      return false;
   });

   $(".fulltext").on("click", function(e) {
      var $this = $(this),
          downloadURL = $this.attr("data-popup");
      if (downloadURL) {
         popup(downloadURL,'downloadWindow','900','800');
      }

      if ($this.hasClass("html") || $this.hasClass("pdf")) {
         var pagegaAccount = $(".pubGAAccount").text();
         if (pagegaAccount) {
            console.log("about to call ga create and send for " + pagegaAccount);
            ga('create', pagegaAccount, 'ingentaconnect.com','userAccount');
            ga('userAccount.send', 'pageview');
         }
      }
   });

   function checkForCookie() {
      var ca = document.cookie.split(";"),
          nameEQ = "cookiepolicypopupIC02=",
          ShowHidePopUp = false;
      for (var i = 0; i < ca.length; i++) {
         if (ca[i].indexOf(nameEQ) === 1) {
            ShowHidePopUp = false;
            break;
         } else {
            ShowHidePopUp = true;
         }
      }

      if (ShowHidePopUp) {
         $(".mainCookiesPopUp").fadeIn().delay(7000).fadeOut();
      }
   }

   // sets cookie if they agree to it..
   $(document).on("click", ".setCookie", function(e) {
      var curDate = new Date(),
          expDate = new Date();
      // Set expiry for 3 years...
      expDate.setMonth(curDate.getMonth() + 36);
      document.cookie = "cookiepolicypopupIC02=1; expires=" + expDate.toUTCString() + "; path=/";
      $(".setCookie").text("Cookie Policy Approved");
      e.preventDefault();
   });

   $(document).on("click", ".closePolicyPopup", function(e) {
      $(".mainCookiesPopUp").hide();
   });

   // checks for Cookie on first load
   checkForCookie();

   $(document).on("click", ".opendeleteFolder a", function(e){
      var $this = $(e.target),
          $thisClass = $this.attr("class"),
          $itemFolderContainer = $this.parent().parent();

      if ($thisClass === 'openfolder') {
         $itemFolderContainer.find(".fa-folder-o").hide();
         $itemFolderContainer.find(".fa-folder-open-o").show();
      } else {
         $itemFolderContainer.find(".fa-folder-open-o").hide();
         $itemFolderContainer.find(".fa-folder-o").show();
      }
   });

   // full text popup
   $(document).on("click", ".fulltextSTOP", function(e){
      e.preventDefault();
      var $this = $(this),
          winWidth  = $(window).width(),
          winHeight = $(window).height(),
          newWidth  = winWidth - (winWidth * 0.45),
          newHeight = winHeight - (winHeight * 0.09),
          ifra,
          pagesValues,
          startPos = 0,
          endPos = 0,
          pageCount = 0;

      $(".fullTextContainer").remove(); // remove or duplicate popups and not all dialog branded
      $(".fullTextIframe").remove();
      $("body").append("<div id='dialog' class='fullTextContainer' title='" + $(".abstract-heading").text() + "'></div>");

      // work out window size and adjust as needed
      ifra = document.createElement("IFRAME");
      ifra.setAttribute("src",$this.attr("data-fulltext-url"));
      ifra.setAttribute("onload","myFullTextPopUp()");  // calls a function that removes the spinner once iframe loaded as can be a delay
      ifra.setAttribute("class","fullTextIframe progress");
      ifra.style.width = "100%";

      // hack below to set iframe height size just bigger than pdf, issue on Ipads not scrolling. CSS hack to assist this as well.
      pagesValues = $(".pagesNum").html();
      startPos = pagesValues.indexOf('\(') + 1;
      endPos = pagesValues.indexOf('\)', startPos);
      pageCount = pagesValues.substring(startPos,endPos);
      ifra.style.height = (pageCount * 1200) + "px";

      $(".fullTextContainer").append(ifra);

      $("#dialog").dialog({
         resizable:true,
         modal: true ,
         width:newWidth,
         height:newHeight,
         buttons: {
            "Close": function() {
               $(this).dialog("close");
               $(".fullTextIframe").remove();
            }
         }
      });
   });

   /* ##### Home Page AJAX Calls ##### */

   var tabFunctions = tabFunctions || {
     baseMsg : "Please refresh the page, there seems to be an issue loading ",
     tabMsgs : [
        "the content.",
        "the fast track content section.",
        "the references.",
        "the citations.",
        "the supplementary information.",
        "the fast track information."
     ],
      /**
       *
       */
      trimMostRecentArticles: function() {
         var mostRecentArticles = $(".homeLeftArticles ul li");
         $.each(mostRecentArticles,function(index, value) {
            var $this = $(this),
                $articleLink = $this.find("h4 a"),
                $articleSpan = $this.find("span.article"),
                articleLinkattr = $articleLink.attr("href"),
                articleSpanHtml = $articleSpan.html(),
                truncatedArticle = articleSpanHtml ? articleSpanHtml.substring(0, 650) : "";
            truncatedArticle += '...<a href="'+ articleLinkattr +'">more</a></xhtml:span>';
            $articleSpan.html(truncatedArticle);
         });
      },
      /**
       *
       */
      trimReferences: function() {
         var referenceItems = $("#ref-hook-content ul.suppDataList-ul").html(),
             $refHook = $("#ref-hook");
         $refHook.removeClass();
         $refHook.removeAttr("title");
         $refHook.html("<ul id='referenceItems' class='suppDataList-ul'>" + referenceItems + "</ul>");
      },
      /**
       *
       */
      trimCitations: function() {
         var citationInfo = $("#cit-hook-content div.heading-macfix").html(),
             citationItems = $("#cit-hook-content ul.suppDataList-ul").html(),
             citContent = "",
             $citHook = $("#cit-hook");
         if (citationItems) { citContent = "<ul id='citationItems' class='suppDataList-ul'>" + citationItems + "</ul>"; }
         $citHook.removeClass();
         $citHook.removeAttr("title");
         $citHook.html("<div id='citationInfo'>" + citationInfo + "</div>" + citContent);
      },
      /**
       *
       */
      trimSupplement: function() {
         var supplementInfo = $("#sup-hook-content div.heading-macfix").html(),
             supplementItems = $("#sup-hook-content ul.suppDataList-ul").html(),
             suppContent = "",
             $supHook = $("#sup-hook");
         if (supplementItems) { suppContent = "<ul id='supplementItems' class='suppDataList-ul'>" + supplementItems + "</ul>"; }
         $supHook.removeClass();
         $supHook.removeAttr("title");
         $supHook.html("<div id='supplementInfo'>" + supplementInfo + "</div>" + suppContent);
      },
      /**
       *
       */
      trimFasttrack: function() {
         var fasttrackInfo = $("#ft-hook-content div.heading-macfix").html(),
             fasttrackItems = $("#ft-hook-content ul.suppDataList-ul").html(),
             ftContent = "",
             $ftHook = $("#ft-hook");
         if (fasttrackItems) { ftContent = "<ul id='fasttrackItems' class='suppDataList-ul'>" + fasttrackItems + "</ul>"; }
         $ftHook.removeClass();
         $ftHook.removeAttr("title");
         $ftHook.html("<div id='fasttrackInfo'>" + fasttrackInfo + "</div>" + ftContent);
      },
      /**
       * @param    string    function name
       */
      alertComplete: function(source) {
         console.log("*** " + source + " - completed");
      }
   };

   // Home page main carousel, bootstrap own carousel, but now tweaked to call contents in via ajax
   if ($(".ingentaIntro").length > 0) {
      // Home page main carousel, as above ...
      ajaxCall.call("GET",
         "/docs/homeMainCarouselContents.html",
         "#carousel-example-generic",
         tabFunctions.baseMsg + tabFunctions.tabMsgs[0],
         true,
         null,
         tabFunctions.alertComplete("homeMainCarouselContents")
      );
      // Home page ad carousel, as above ...
      ajaxCall.call("GET",
         "/docs/carouselContentsAds.html",
         "#carousel-example-generic-sidebar",
         tabFunctions.baseMsg + tabFunctions.tabMsgs[0],
         true,
         null,
         tabFunctions.alertComplete("carouselContentsAds")
      );
   }
   if ($(".admin-home").length > 0) {
      // Publisher home page ad carousel, as above ...
      ajaxCall.call("GET",
         "/docs/carouselContentsPublisherAds.html",
         "#carousel-example-publisher-sidebar",
         tabFunctions.baseMsg + tabFunctions.tabMsgs[0],
         true,
         null,
         tabFunctions.alertComplete("carouselContentsPublisherAds")
      );
      // Library home page ad carousel, as above ...
      ajaxCall.call("GET",
         "/docs/carouselContentsLibraryAds.html",
         "#carousel-example-library-sidebar",
         tabFunctions.baseMsg + tabFunctions.tabMsgs[0],
         true,
         null,
         tabFunctions.alertComplete("carouselContentsLibraryAds")
      );
   }

   // Home page Fast Track Article call to ajax
   if ($(".homeLeftArticles").length > 0) {
      ajaxCall.call("GET",
         "/docs/fastTrackArticle.html",
         ".homeLeftArticles",
         tabFunctions.baseMsg + tabFunctions.tabMsgs[1],
         true,
         tabFunctions.trimMostRecentArticles,
         tabFunctions.alertComplete("homeLeftArticles")
      );
   }

   // pull in references for tab
   if ($("#ref-hook").length > 0) {
      $("#refLinkTab a").on("click", function() {
         ajaxCall.call("GET",
            $("#refLinkTab a").data("link"),
            "#ref-hook-content",
            tabFunctions.baseMsg + tabFunctions.tabMsgs[2],
            true,
            tabFunctions.trimReferences,
            tabFunctions.alertComplete("refLinkTab")
         );
      });
   }

   // pull in citations for tab
   if ($("#cit-hook").length > 0) {
      $("#citLinkTab a").on("click", function() {
         ajaxCall.call("GET",
            $("#citLinkTab a").data("link"),
            "#cit-hook-content",
            tabFunctions.baseMsg + tabFunctions.tabMsgs[3],
            true,
            tabFunctions.trimCitations,
            tabFunctions.alertComplete("citLinkTab")
         );
      });
   }

   // pull in supplemetary data for tab
   if ($("#sup-hook").length > 0) {
      $("#supLinkTab a").on("click", function() {
         ajaxCall.call("GET",
            $("#supLinkTab a").data("link"),
            "#sup-hook-content",
            tabFunctions.baseMsg + tabFunctions.tabMsgs[4],
            true,
            tabFunctions.trimSupplement,
            tabFunctions.alertComplete("supLinkTab")
         );
      });
   }

   // pull in fast track data for tab
   if ($("#ft-hook").length > 0) {
      $("#ftLinkTab a").on("click", function(e) {
    	  e.preventDefault();
         ajaxCall.call("GET",
            $("#ftLinkTab a").data("link"),
            "#ft-hook-content",
            tabFunctions.baseMsg + tabFunctions.tabMsgs[5],
            true,
            tabFunctions.trimFasttrack,
            tabFunctions.alertComplete("ftLinkTab")
         );
      });
   }

   // validation for 'Remove' on shopping cart
   var form = $(".cartForm"),
       checked = false,
       cartForm = $("form").hasClass(".cartForm");

   $(".cartForm").on("click", ".btn.btn-general.icbutton", function(e) {

      //check checkboxes
      $(".cartForm input[type=checkbox]").each(function() {
         checked = $(this).attr('checked');
         if (checked) {
            $(".cartForm input[type=checkbox]").each(function() {
               $(this).rules('add', {required: false});
            });
            return false;
         }
      });

      if (!checked && cartForm === true) {
         form.validate();
         $(".cartForm input[type=checkbox]").each(function() {
            $(this).rules('add', {
               required: true,
               messages: {
                  required: "You must select an item"
               }
            });
         });
      }
   });

   // MoreLikeThis (Related Articles)
   function relatedArticles() {
      var morelikethisurl = $("#hiddenContext").text() + "/search/morelikethis",
          data = {
             "pubrelatedcontentids": $("#hiddenmorelikethisids").text(),
             "webid"               : "/" + $("#hiddenmorelikethiswebid").text(),
             "fields"              : $("#hiddenmorelikethisfields").text(),
             "restrictions"        : $("#hiddenmorelikethisrestrictions").text(),
             "number"              : $("#hiddenmorelikethisnumber").text(),
             "numbershown"         : $("#hiddenmorelikethisnumbershown").text(),
             "numbershownMax"      : $("#hiddenmorelikethisnumbershownMax").text(),
             "numberIncrement"     : $("#hiddenmorelikethisnumbershownIncrement").text(),
             "numbershowndefault"  : $("#hiddenmorelikethisnumbershowndefault").text()
          };

      // Since we want to handle failure as well as success,
      // we need to use ajax() rather than post().
      // $.post fails silently on error!
      $.ajax({
         type : "POST",
         url : morelikethisurl,
         data : data,
         dataType: "text",
         success: function(resp) {
            var target = $("#morelikethiscontent").get(0);
            target.innerHTML = resp;
            $(".morelikethisloading").remove();
         },
         error : function(resp) {
            $(".morelikethisloading").remove();
         }
      });
   }

   $(document).on("click", ".morelink a", function(e) {
      e.preventDefault();
      // parseInt() should ALWAYS specify the base...
      var $this = $(this),
          likethisnum = parseInt($("#hiddenmorelikethisnumber").html(), 10) || 0,
          likethisnumshow = parseInt($("#hiddenmorelikethisnumbershown").html(), 10) || 0,
          likethisnumMax = parseInt($("#hiddenmorelikethisnumbershownMax").html(), 10) || 0,
          likethisnumshowdefault = parseInt($("#hiddenmorelikethisnumbershowndefault").html(), 10) || 0,
          likethisnumshowIncrement = parseInt($("#hiddenmorelikethisnumbershownIncrement").html(), 10) || 0;

      if (likethisnumshow < likethisnumMax && likethisnumshow === likethisnumshowdefault) {
         $this.parent().html("<img class=\"morelikethisloading\" src=\"/images/admin/spinner.gif\" alt=\"Loading\" />");
         $("#hiddenmorelikethisnumber").text(likethisnumshowIncrement + 1);
         $("#hiddenmorelikethisnumbershown").text(likethisnumshowIncrement);
//       removed as possibly causing downturn in TrendMD clicks
//       relatedArticles();
         $("#hiddenmorelikethisnumber").text(likethisnumMax);
         $("#hiddenmorelikethisnumbershown").text(likethisnumMax);
      } else {
         $this.parent().html("<img class=\"morelikethisloading\" src=\"/images/admin/spinner.gif\" alt=\"Loading\" />");
//       removed as possibly causing downturn in TrendMD clicks
//       relatedArticles();
      }
   });
   if ($("#hiddenmorelikethisids").size() > 0) {
//    removed as possibly causing downturn in TrendMD clicks
//    relatedArticles();
   }

   $(document).on("click", ".morelinkTruncate a", function(e) {
      // add class
      e.preventDefault();
      var $listItem = $(this).parent().parent().find(".expandedList");

      if ($listItem.hasClass("hidden")) {
         $listItem.removeClass("hidden");
         $(".morelinkTruncate .more").html("&gt; Less");
      } else {
         $listItem.addClass("hidden");//hasClass();
         $(".morelinkTruncate .more").html("&gt; More");
      }
   });

   // Insert the current year into the copyright year in the footer...
   var copyYear = document.querySelector("#copyyear");
   if (copyYear) {
      copyYear.innerHTML = new Date().getUTCFullYear();
   }

   // Set up some pointers for the payments page...
   var $rightNav = $(".rightnav"),
       $showNav  = $("#shownav");

   // Hide navigation on payment page by default
   $rightNav.hide();

   // Show navigation on payment page
   $(".container").on("click", "#shownavlink", function(e) {
      $showNav.hide();
      $rightNav.slideDown();
   });

   // Hide navigation on payment page
   $(".container").on("click", "#hidenavlink", function(e) {
      $showNav.show();
      $rightNav.slideUp();
   });

   // Saved Searches functionality...
   var $savedSearches = $(".savedSearches");

   $(".closefolder").hide();
   $(".foldercontents").hide();
   $savedSearches.on("click", ".openfolder", function(e) {
      var $this = $(this);
      $this.parents(".savedsearchfolder").find(".foldercontents").slideDown();
      $this.hide();
      $this.parent("div").find(".closefolder").show();
      return false;
   });
   $savedSearches.on("click", ".closefolder", function(e) {
      var $this = $(this);
      $this.parents(".savedsearchfolder").find(".foldercontents").slideUp();
      $this.hide();
      $this.parent("div").find(".openfolder").show();
      return false;
   });
   $savedSearches.on("click", ".deletefolder", function(e) {
      return confirm("Are you sure you want to delete this folder?");
   });

   // Counter page start end check...
   $("#counterfour\\:request-reports").on("click", function() {
      var startMM,
          endMM,
          startYYMM,
          endYYMM;
      startMM = $("#counterfour\\:startMonth").val();
      if (startMM < 10) {
         startMM = "0" + startMM;
      }
      endMM = $("#counterfour\\:endMonth").val();
      if (endMM < 10) {
         endMM = "0" + endMM;
      }
      startYYMM = $("#counterfour\\:startYear").val() + startMM;
      endYYMM   = $("#counterfour\\:endYear").val() + endMM;
      if (startYYMM > endYYMM) {
         $("#end-month-year-message").html("Please select an valid date range; End Date should be after Start Date.");
         return false;
      } else {
         $("#end-month-year-message").html("");
         $("#counterfour").submit();
      }
   });

   // Counter page start end check...
   $("#counterfive\\:request-reports").on("click", function() {
      var startMM,
          endMM,
          startYYMM,
          endYYMM;
      startMM = $("#counterfive\\:startMonth").val();
      if (startMM < 10) {
         startMM = "0" + startMM;
      }
      endMM = $("#counterfive\\:endMonth").val();
      if (endMM < 10) {
         endMM = "0" + endMM;
      }
      startYYMM = $("#counterfive\\:startYear").val() + startMM;
      endYYMM   = $("#counterfive\\:endYear").val() + endMM;
      if (startYYMM > endYYMM) {
         $("#end-month-year-message").html("Please select an valid date range; End Date should be after Start Date.");
         return false;
      } else {
         $("#end-month-year-message").html("");
         $("#counterfive").submit();
      }
   });
   
   $(".js-imageToLoadDynamically").each(function( index ) {
	   var img=new Image();
	   var ithis = $(this);
	   img.src= ithis.data('imageurltocheck');
	   img.onload=function(){
		   ithis.closest('div').find('p').remove();
		   ithis.attr('src', ithis.data('imageurltocheck')); //replace src
		   ithis.css('width', '100%');
		   //extra check to trigger lightbox in certain circumstances.
		   var doesIDExist = $('#triggerOpenOnLoad').length;
			if (doesIDExist > 0) {
				$(".previewthumbnailink").trigger('click');
			}
		}
   });
   
   $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	   let targetPane = $(e.target).attr("href");
	   let previousPane = $(e.relatedTarget).attr("href");
	   // active tab switch.
	   $(e.target).attr('aria-selected', 'true').attr('tabIndex', '0'); // newly activated tab 
	   $(e.relatedTarget).attr('aria-selected', 'false').attr('tabIndex', '-1'); // previous active tab 
	   // active tab pane switch
	   
	   targetPane = targetPane.split('#').pop(); 
	   previousPane = previousPane.split('#').pop(); 
	   
	   console.log('ids of tab pane to be targeted: #' + targetPane + ' #' + previousPane);
	   	
	   $('#' + targetPane).attr('aria-hidden','false'); // newly visible tab pane
	   $('#' + previousPane).attr('aria-hidden','true'); // previous visible tab pane
	 });



});
