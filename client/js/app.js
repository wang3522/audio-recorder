//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;            //stream from getUserMedia()
var rec;              //Recorder.js object
var input;              //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var uploadButton = document.getElementById("uploadButton");

var upblob;

window.onload = function () {
    if (isGetUserMediaSupported()) {
        //add events to those 2 buttons
        recordButton.addEventListener("click", startRecording);
        uploadButton.addEventListener("click", uploadRecording);
    }
    else {
        window.location.href = "./unsupported.html";        
    }

};

function isGetUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    || !!(navigator.getUserMedia)
    || !!(navigator.webkitGetUserMedia)
    || !!(navigator.mozGetUserMedia);
}

function startRecording() {
  console.log("recordButton clicked");

  /*
    Simple constraints object, for more advanced audio features see
    https://addpipe.com/blog/audio-constraints-getusermedia/
  */
    
    var constraints = { audio: true, video:false }

  /*
      Disable the record button until we get a success or fail from getUserMedia() 
  */

  recordButton.disabled = true;
  recordButton.innerHTML = "Recording";

  /*
      We're using the standard promise based getUserMedia() 
      https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  */

  navigator.mediaDevices.getUserMedia(constraints).then( stream => {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

    /*
      create an audio context after getUserMedia is called
      sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
      the sampleRate defaults to the one set in your OS for your playback device

    */
    audioContext = new AudioContext();

    /*  assign to gumStream for later use  */
    gumStream = stream;
    
    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);

    /* 
      Create the Recorder object and configure to record mono sound (1 channel)
      Recording 2 channels  will double the file size
    */
    rec = new Recorder(input,{numChannels:1})

    //start the recording process
    rec.record()

    console.log("Recording started"); 

    const sleep = time => new Promise(resolve => setTimeout(resolve, time));
    (async () => {        
          await sleep(4000);          
          console.log("after sleep");
          rec.stop();
          gumStream.getAudioTracks()[0].stop();
          recordButton.disabled = false;
          recordButton.innerHTML = "Record";
          rec.exportWAV(createDownloadLink);
    })();
  }, reason => {
    console.log("user denied the access");
    alert('You need to grant access to microphone in order to finish recording')
  }).catch(function(err) {
      //enable the record button if getUserMedia() fails
      recordButton.disabled = false;
      recordButton.innerHTML = "Record";
  });
}

function getUploadUrl(filename) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
      if(this.readyState === 4) {
        //console.log('response:', this.responseText);
        uploadRecording(upblob, filename,this.responseText)
      }
    }
    xhr.open("POST", "/upload", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ filename: filename }));
}

function uploadRecording(blob, filename, url){
  var xhr=new XMLHttpRequest();
  xhr.onload=function(e) {
      if(this.readyState === 4) {
          console.log("Server returned: ",e.target.responseText);
      }
  };
  var file = new File([blob], filename, {type: 'audio/wav', lastModified: Date.now()});
  xhr.open("PUT",url,true);
  xhr.send(file);
  
}


function createDownloadLink(blob) {
  upblob = blob;
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');

  //name of .wav file to use during upload and download (without extendion)
  var dateStr = new Date().toISOString();

  // unlikely but still want to avoid file name conflict for upload
  var randomSuffix = Math.random().toString(36).substr(2, 5);

  var filename = dateStr+"."+randomSuffix+".wav ";
  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //save to disk link
  link.href = url;
  link.download = filename; //download forces the browser to donwload the file using the filename
  link.innerHTML = " download";

  //add the new audio element to li
  li.appendChild(au);
  
  //add the filename to the li
  li.appendChild(document.createTextNode(filename))

  //add the save to disk link to li
  li.appendChild(link);
  
  //add the li element to the ol
  recordingsList.appendChild(li);

  // get the s3 presigned url for upload
  getUploadUrl(filename);


  return filename;
}
