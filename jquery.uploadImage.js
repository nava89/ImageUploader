(function ($) {

    var settings;
    $.fn.uploadImage = function (args) {

        settings = $.extend({
            MAX_HEIGHT: 200,
        },args || {});
        var canvas = document.createElement("canvas");
        var fileInput = document.getElementById($(this).attr('id'));
        var file = fileInput.files[0];
        loadImage(file,canvas);
        
    }

    var loadImage = function(src, canvas) {
        //	Prevent any non-image file type from being read.
        if (!src.type.match(/image.*/)) {
            console.log("The dropped file is not an image: ", src.type);
            return;
        }

        //	Create our FileReader and run the results through the render function.
        var reader = new FileReader();
        reader.onload = function (e) {
            render(e.target.result, canvas);
        };
        reader.readAsDataURL(src);
    }
        
    var render = function(src, canvas) {
        var image = new Image();
        image.onload = function () {
            if (image.height > settings.MAX_HEIGHT) {
                image.width *= settings.MAX_HEIGHT / image.height;
                image.height = settings.MAX_HEIGHT;
            }
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var uri = canvas.toDataURL();
            var imageBase64 = uri.slice(uri.indexOf(',') + 1);
            var ext = uri.split('/')[1].split(';')[0];
            
            $.ajax({
                type: "POST",
                url: settings.urlAction,
                data: { 'imageBase64': imageBase64, 'ext': ext },
                dataType: "json",
                success: function (json) {
                    settings.callbackSuccess(json);
                },
                error: function (xhr, status, error) {
                    settings.callbackFail(error);
                },

            });
            
            }
        image.src = src;
    }
    
})(window.jQuery);