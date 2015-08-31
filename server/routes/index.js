var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var request = require('request');
router.get('/story', function(req,res,next){
  res.render('index',{title: story})
})

var accountSid = 'AC0b27ba7b433e49c90967b534102c8ad8';
var authToken = 'c8af31735b6f91c32b06126df0905308';


var message = "Once upon a time, Matthew the evangelist descended upon the land of Galvanize to enlighten and expand young minds..."
var story = "";
var activeNumber = 17192381373;
var cohort =
[
{name: 'Lance', number: '+17192381373'},
{name: 'Yusef', number: '+18082778469'},
{name:'Alex', number:'+18593962722'},
{name:'Amber', number: '+13039194337'},
{name:'Ashley', number: '+19706586078'},
{name: 'Bradley', number:'+17204733643'},
{name: 'Brandon', number: '+17207719884'},
{name: 'Charlie', number: '+13039818484'},
{name:'Chip', number: '+13036467088'},
{name: 'Crytal', number: '+16163070351'},
{name:'Dominic', number:'+19704206721'},
{name: 'Erik', number: '+19144385692'},
{name: 'Ethan',    number:'+13038420692'},
{name: 'Johnny', number: '+13035135606'},
{name: 'Keith', number:'+15856987729'},
{name: 'Kierston', number: '+13039294135'},
{name: 'Kyle', number: '+13034756824'},
{name:'Ben', number:'+19785052189'},
{name: 'Sarah', number:'+13035200766'},
{name: 'Lucy', number: '+14843565141'},
{name: 'Luis', number:'+17203087425'},
{name: 'Patrick', number:'+12243884883'},
{name: 'Pete', number: '+15102891955'},
{name: 'Robert', number:'+18473464660'},
{name: 'Suhayl', number:'+17209993948'},
{name: 'Zach', number: '15052802605'},
{name: 'Zoe', number:'+16036178399'},
];

// post method.
router.post('/', function(req, res, next) {
  console.log(accountSid, authToken);
  console.log(req.body.From);
  console.log(activeNumber);
  if(isUserTurn(req.body.From)){
    sendMessage(req.body.From, req.body.Body, req.body.MediaUrl);
  } else {
    notYourTurn(req.body.From);
  }
  res.end();
});

router.post('/test', function(req,res){
  var tag = getImageTag(req.body.url);
  console.log(req.body.url);
  res.send('hello');
})

//Finds the current number, sets the next as the active number and returns
function nextNumber(incomingNumber){
  if(isLastNumber(incomingNumber)){
    activeNumber = cohort[0].number;
    return activeNumber;
  }
  for (var i = 0; i < cohort.length; i++) {
    if(cohort[i].number === incomingNumber){
      activeNumber = cohort[i+1].number;
      return activeNumber;
    }
  }
}

//determines if the incoming number is the last in the array.
function isLastNumber(incomingNumber){
  if(incomingNumber === cohort[cohort.length-1].number){ return true; }
}

//determines if the incoming message is from the next user.
function isUserTurn(incomingNumber){
  console.log(incomingNumber == activeNumber);
  if(incomingNumber == activeNumber){return true;}
}

// adds incoming message to story, updates the message var, and returns.
function updateMessage(incomingNumber, incomingMessage){
    story += incomingMessage + ' \n';
    message = incomingMessage;
    return message;
}

// sends
function sendMessage(incomingNumber, incomingMessage) {
var client = require('twilio')(accountSid, authToken);
  client.messages.create({
    to: nextNumber(incomingNumber),
    from: "+17203707677",
    body: updateMessage(incomingNumber, incomingMessage)
  }, function(err, message) {
    console.log(incomingMessage, incomingNumber);
  });
}
// {console.log('send message ', updateMessage(incomingNumber, incomingMessage), nextNumber(incomingNumber))}

function notYourTurn(incomingNumber) {
var client = require('twilio')(accountSid, authToken);
  client.messages.create({
    to: incomingNumber,
    from: "+17203707677",
    body: 'Wait your turn!'
  }, function(err, message) {
    console.log('in not your turn');
  });
}
// {console.log(incomingNumber)}


function getImageTag(url){
  console.log('in getImageTag');
  request.get('http://access.alchemyapi.com/calls/url/URLGetRankedImageKeywords', {
    // url: 'http://access.alchemyapi.com/calls/url/URLGetRankedImageKeywords',
    // method: 'GET',
    // data:{
      apikey: '6889f9fd6f1a094a963298badffbb5cee0046edf',
      url: 'http://img.timeinc.net/time/daily/2010/1011/poy_nomination_agassi.jpg',
      outputMode: 'json',
    // }
  }, function(error, response, body) {
    console.log(body);
  })  
};

module.exports = router;
