// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/



function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string

	mCurrentIndex = mCurrentIndex % 4;
	if(mCurrentIndex < 0){mCurrentIndex=4 + mCurrentIndex;}
	$("#slideShow img#photo").attr("src",mImages[mCurrentIndex].img);
	$(".details p.location").html("Location: "+mImages[mCurrentIndex].location);
	$(".details p.date").html("Date: "+mImages[mCurrentIndex].date);
	$(".details p.description").html("Description: "+mImages[mCurrentIndex].description);
	/*if(mCurrentIndex  == mImages.length - 1){
		mCurrentIndex = 0;
	}else{
		mCurrentIndex +=1;
	}*/
	mCurrentIndex +=1;
	//console.log('swap hoto');
}

// Counter for the mImages array
var mCurrentIndex = 0;



// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mURL = "images-short.json"; 


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

	$("img.moreIndicator").click(function(){
		if($(this).hasClass("rot90")){
			$(this).addClass("rot270");
			$(this).removeClass("rot90");
		}else{
			$(this).removeClass("rot270");
			$(this).addClass("rot90");
		}
		$(".details").toggle("200");
	});

	$("#nextPhoto, #prevPhoto").hover(function(){
		$(this).css("opacity", ".8");
	});

	$("#prevPhoto").click(function(){
		mCurrentIndex -= 2;
		swapPhoto();
	});

	$("#nextPhoto").click(function(){
		swapPhoto();
	});


	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');



}, false);

function GalleryImage(loc, des, date, img) {
	this.location = loc;
	this.description = des;
	this.date = date;
	this.img = img;	
}


mRequest.onreadystatechange = function() {
	// Do something interesting if file is opened successfully
	if (mRequest.readyState == 4 && mRequest.status == 200) {
		try {
			// Let’s try and see if we can parse JSON
			mJson = JSON.parse(mRequest.responseText);
			// Let’s print out the JSON; It will likely show as “obj”
			//console.log(mJson["images"].length);
			for(var i = 0; i < mJson["images"].length;i++){
				mImages.push(new GalleryImage(mJson["images"][i]["imgLocation"],mJson["images"][i]["description"],mJson["images"][i]["date"],mJson["images"][i]["imgPath"]));
			}
			swapPhoto();

		} catch(err) {
			console.log(err.message)
		}
	}
};

	

mRequest.open("GET", mURL, true);

mRequest.send();