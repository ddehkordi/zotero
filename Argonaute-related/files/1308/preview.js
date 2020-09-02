$(document).ready(function() {

    // Some "global" variables...
    var filename,
        index = 0,
        previewClass = "previewNavGrey",
        height,
        width,
        $preview = $("#preview");

    if ($preview.length) {
        $preview.dialog({
            autoOpen: false,
            height: 500,
            width: 800,
            modal: true,
            title: "Preview",
            resize: function() {
                var dialogHeight = $preview.height(),
                    tabHeight = $("#top", $(this).get(0).contentDocument).height();
                $(".image", $(this).get(0).contentDocument).height(dialogHeight - tabHeight - 12); // -12 is the same offset as hardcoded in css
            }
        });
    }

    var loadPreview = function() {
        var $image = $preview.find(".image"),
            $imgFirst = $image.find(".first");
        if ($image.find(".notfirst").size() > 0) {
            $image.find(".notfirst").remove();
        }
        if (index > 0) {
            $imgFirst.hide();
            filename = $preview.find('.filename:eq(' + index + ')').text();
            var newImg = new Image();
            newImg.src = filename;
            newImg.onload = function() {
                height = newImg.height;
                width = newImg.width;
                $image.append("<img src=\"" + filename + "?" + new Date().getTime() +  "\" class=\"notfirst\" />");
            };
        } else {
            height = $imgFirst.height();
            width = $imgFirst.width();
            $imgFirst.show();
        }
    };
    
    var adjustPreviewSize = function(e, zoomDirection) {
        var newWidth,
            newHeight;
        if (zoomDirection === "zoomin") {
            newWidth = width + ((width / 100) * 10);
            newHeight = height + ((height / 100) * 10);
        } else {
            newWidth = width - ((width / 100) * 10);
            newHeight = height - ((height / 100) * 10);
        }
        width = newWidth;
        height = newHeight;
        $preview.find(".image img").css({"width": newWidth, "height": newHeight});
    };

    if ($("#openPreview").size() > 0) {
        var $previewImage = $preview.find(".image"),
            $previewImageImg = $previewImage.find("img"),
            imgHeight = $previewImageImg.get(0).height,
            imgWidth = $previewImageImg.get(0).width,
            dialogHeight = imgHeight + $("#top").height() * 2,
            dialogWidth = imgWidth + 35;
        $preview.dialog("option", {"width": dialogWidth, "height": dialogHeight});
        $previewImage.height(imgHeight).width(imgWidth).css("overflow", "visible");

        $preview.dialog("option", "position", {
            my: "top",
            at: "top",
            of: $(".publisherBrandingContainer"),
            collision: "none",
            using: function(pos) {
                var $this = $(this),
                    topOffset = $this.css(pos).offset().top;
                $this.css("left", pos.left + 135);
                if (topOffset < 0 ) {
                    $this.css("top", pos.top - topOffset);
                }
            }
        });
        $preview.dialog("open");
    }

    $(".previewthumbnailink").on("click", function(e) {
        $preview.find(".previous").addClass(previewClass);
        $preview.find(".navdivider").addClass(previewClass);
        // we need to be able to test to see if there is only one fulltext thumbnail and if that is the case we can grey out the link.
        if ($preview.find(".filename").size() == 1) {
            $preview.find(".next").addClass(previewClass);
        }
        index = 0;
        $preview.dialog("open");
        loadPreview();
        return false;
    });

    $("#preview .next").on("click", function(e) {
        e.preventDefault();
        if (($preview.find(".filename").size() > 0)  && (index < ($preview.find(".filename").size() - 1))) {
            $preview.find(".previous").removeClass(previewClass);
            $preview.find(".navdivider").removeClass(previewClass);
            index++;
            loadPreview();
            $preview.find("#pagenum").html(index + 1);
            if (index === ($preview.find(".filename").size() - 1)) {
                $preview.find(".next").addClass(previewClass);
                $preview.find(".navdivider").addClass(previewClass);
            }
        }
    });

    $("#preview .previous").on("click", function(e) {
        e.preventDefault();
        if (($preview.find(".filename").size() > 0)  && (index > 0)) {
            $preview.find(".next").removeClass(previewClass);
            $preview.find(".navdivider").removeClass(previewClass);
            index--;
            loadPreview();
            $preview.find("#pagenum").html(index + 1);
            if (index === 0) {
                $preview.find(".previous").addClass(previewClass);
                $preview.find(".navdivider").addClass(previewClass);
            }
        }
    });

    $preview.find("#zoomcontrols #zoomin").on("click", function(e) {
        adjustPreviewSize(e, "zoomin");
    });

    $preview.find("#zoomcontrols #zoomout").on("click", function(e) {
        adjustPreviewSize(e, "zoomout");
    });

});
