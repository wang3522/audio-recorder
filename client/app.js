<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Yummly Wake Word Recorder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <h1>Yummly Wake Word Recorder</h1>
    <p>
        Please update your browser. Chrome (49 and later) and Firefox (30 and later) are supported.
    </p>

    <p> Please record in a quiet room. Speak "yummly" clearly</p>
    <p> You need to create 10 samples</p>
    <div id="controls">
  	 <button id="recordButton">Record</button>
     <button id="stopButton" disabled>Stop</button>
  	 <button id="uploadButton">Upload</button>
    </div>
    <div><p></p></div>
  	<h3>Recordings</h3>
  	<ol id="recordingsList"></ol>

    <!-- inserting these scripts at the end to be able to use all the elements in the DOM -->
  	<script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script>
  	<script src="js/app.js"></script>
    
  </body>
</html>