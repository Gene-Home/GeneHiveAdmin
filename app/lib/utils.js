    // from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
     var dateSort=function(x,y) {
	   var dx=Date.parse(x)
	   var dy=Date.parse(y)
	   if(dx<dy) return -1;
	   if(dy<dx) return 1;
	   return 0;
    };