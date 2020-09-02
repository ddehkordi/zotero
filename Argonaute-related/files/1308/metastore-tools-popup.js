/*
 * @param  event object
 */
function metastoreToolsPopup(evt) {

   const DIALOG_WIDTH  = 800,
         DIALOG_HEIGHT = 600,
         MAGIC_WIDTH   = DIALOG_WIDTH - 20,
         MSG1          = "Please wait until all uploads have completed before submitting the form.",
         MSG2          = "Are you sure you want to close this window? Any changes will be lost.";

   var $this = $(this),
       iframe = $("<iframe id='metastore-tools-popup'></iframe>"),
       type = $this.attr("resourcetype"),
       urlcontext = $this.attr("urlcontext"),
       context = $this.attr("resourcecontext"),
       url = $this.attr("itemurl"),
       redirectTo = $this.attr("redirectto"),
       title = $this.attr("title"),
       action = $this.attr("resourceaction");

    // Stop the page from jumping to the top...
   evt.preventDefault();

   iframe.css({"border" : "0", "margin" : "0", "padding" : "0"});

   if (urlcontext !== "") {
      url = urlcontext + url;
      redirectTo = urlcontext + redirectTo;
   }

   url = url.split("?")[0].split(";")[0];

   if (action.toUpperCase() === "CREATE") {
      url += "/create";
   }
   if (action.toUpperCase() === "EDIT") {
      url += "/edit";
   }
   if (action.toUpperCase() === "DELETE") {
      url += "/delete";
   }

   url += "?&popup=true&portal=admin&context=" + context;

   if (action.toUpperCase() === "CREATE") {
      url += "&type=" + type;
   }
   if (redirectTo) {
      url += "&redirectTo=" + redirectTo;
   }

   $("body").append(iframe);
   iframe.get(0).src = url;

   var iframeButtons = {
      Cancel: function() {
         $(this).dialog("close");
      }
   };

   iframeButtons[action] = function() {
      var iframeContent = $("#metastore-tools-popup").get(0).contentWindow;
      if (iframeContent.UPLOADS_IN_PROGRESS > 0) {
         alert(MSG1);
         return;
      }
      iframeContent.$(".facet-form, .delete-form").submit();
      return false;
   };

   iframe.dialog({
      height: DIALOG_HEIGHT,
      width: DIALOG_WIDTH,
      modal: true,
      title: title,
      resizable: false,
      buttons: iframeButtons,
      beforeClose: function() {
         return confirm(MSG2);
      },
      close: function() {
         this.src = "about:blank";
         $(this).remove();
      }
   });

   iframe.css({"width": MAGIC_WIDTH + "px"});
}

$(document).ready(function() {
   $(document).on("click", ".metastore-tools-trigger", metastoreToolsPopup);
});
