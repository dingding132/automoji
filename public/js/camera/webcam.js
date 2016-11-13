//linking var to html elements 
var startRecording = document.getElementById('start-recording'); 
var stopRecording = document.getElementById('stop-recording'); 
var cameraPreview = document.getElementById('camera-preview');  

var recordVideo; 
//when the button start Recording is pressed 
startRecording.onclick = function() { 
//button disabled after start recording 
    startRecording.disabled = true;  
    navigator.getUserMedia({
        video: true
    }, function(stream) {
        cameraPreview.src = window.URL.createObjectURL(stream);
        cameraPreview.play();

        recordAudio = RecordRTC(stream, {
            bufferSize: 16384
        });

        recordVideo = RecordRTC(stream, {
            type: 'video'
        });

        recordVideo.startRecording();
        stopRecording.disabled = false;

    }, function(error) {
        alert(JSON.stringify(error));
    });
}; 

//when button stop recording is called TODO: change that to a timer in the future
 stopRecording.onclick = function() {  
    //start recording button is enabled, stop recording button is disabled 
    startRecording.disabled = false; 
    stopRecording.disabled = true;  
    //stop recording video 
    recordVideo.stopRecording();  
    onStopRecording();  

    //what to do after the recording has stopped 
    function onStopRecording() { 
        //get data url from whammy 
        recordVideo.getDataURL(function(videoDataURL) { 
        //call another function post file to post the videoData 
            postFiles(videoDataURL); 
        }); 
    } 
};  

var fileName; 
//method to save file from videoDataURL function
postFiles(videoDataURL) { 
    fileName = getRandomString();
    //TODO: give it a meaningful name later 
    //create file with videoDataURL as content 
    var files = { }; 
    files.video = { 
        name: fileName + '.webm', 
        type: 'video/webm', 
        contents: videoDataURL     };  

    cameraPreview.src = ''; 
    cameraPreview.poster = 'media/ajax-loader.gif';  

    xhr('/upload', JSON.stringify(files), function(_fileName) {
        var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
        cameraPreview.src = href + 'uploads/' + _fileName;
        cameraPreview.play();

        var h2 = document.createElement('h2');
        h2.innerHTML = '<a href="' + cameraPreview.src + '">' + cameraPreview.src + '</a>';
        document.body.appendChild(h2);
    });
}  

function xhr(url, data, callback) { 
    var request = new XMLHttpRequest(); 
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200) { 
        callback(request.responseText); 
        } 
    }; 
    request.open('POST', url); 
    request.send(data);
 }  

//when refreshing windows 
window.onbeforeunload = function() { 
    startRecording.disabled = false; 
};  

//generate random name for file function
getRandomString() {     if (window.crypto) {         var a = window.crypto.getRandomValues(new Uint32Array(3)),         token = '';         for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);         return token;     } else {             return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');         } }

// this function uploads files
function upload(response, postData) {
    var files = JSON.parse(postData);

    // writing video file to disk
    _upload(response, files.video);

}
function _upload(response, file) {
    var fileRootName = file.name.split('.').shift(),
        fileExtension = file.name.split('.').pop(),
        filePathBase = config.upload_dir + '/',
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath = fileRootNameWithBase + '.' + fileExtension,
        fileID = 2,
        fileBuffer;

    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    file.contents = file.contents.split(',').pop();

    fileBuffer = new Buffer(file.contents, "base64");

    fs.writeFileSync(filePath, fileBuffer);
}