var config = {
    apiKey: "AIzaSyAu0QBwDEGkLaIlo1dQiL0tAO8Vemkxy5g",
    authDomain: "pinnapple-c0131.firebaseapp.com",
    databaseURL: "https://pinnapple-c0131.firebaseio.com",
    projectId: "pinnapple-c0131",
    storageBucket: "pinnapple-c0131.appspot.com",
    messagingSenderId: "606794224912"
  };
  
firebase.initializeApp(config);
  
var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

function currentTime() {
    var now = moment().format("dddd, MMMM Do, YYYY");
    var currentT = moment().format('LT');
    $("#currentDate").text(now);
    $("#currentTime").text(currentT);
    setTimeout(currentTime, 1000);
  };

currentTime();

$("#submit").on("click", function(event) {
    event.preventDefault();

    console.log("ffffff");

    //me no work
    if ($("#train-name").val().trim() === "" ||
        $("#destination").val().trim() === "" ||
        $("#first-train").val().trim() === "" ||
        $("#frequency").val().trim() === "") {

            alert("Please fill in all details to add new train");

        } else {
    
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");
    
    }

});

database.ref().on("child_added", function(childSnapshot) {
    
    console.log(childSnapshot.val());

        var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
        //minutes from now to last year
        var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
        console.log(timeDiff)
        //remainder from frequency
        var timeRemain = timeDiff % childSnapshot.val().frequency;
        console.log(timeRemain)
        //turns to minutes away
        var minToArrival = childSnapshot.val().frequency - timeRemain;
        console.log(minToArrival)
        //time for next train
        var nextTrain = moment().add(minToArrival, "minutes");
        console.log(nextTrain)
        //removal
        var key = childSnapshot.key;
      
        var newrow = $("<tr>");
          newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
          newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
          newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
          newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
          newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
          newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>Remove</button></td>"));
      
        $("#newTrains").append(newrow);
    
    });

//delete train
$(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
  });



//refresh
//setInterval(function() {
//    window.location.reload();
//}, 1000 * 60);
  