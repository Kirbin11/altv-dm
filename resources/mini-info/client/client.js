import * as alt from 'alt-client';
import * as native from 'natives';

let street = new alt.WebView("http://resource/client/cef/index.html");
const player = alt.Player.local;

const updateInterval = 500; 

var day = new Date().getDay();
const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
street.emit("miniinfo:UpdateDay", dayNames[day]);
var localTime = native.getLocalTime();
var date = addZero(localTime[3])+"."+addZero(localTime[2])+"."+localTime[1];
street.emit("miniinfo:UpdateDate", date);

var time = addZero(localTime[4])+":"+addZero(localTime[5]);
    street.emit("miniinfo:UpdateTime", time)

function addZero(number){
    if(number<10) return "0"+number;
    else return number.toString();
}
alt.setInterval(() => {
    var localTime = native.getLocalTime();
    var time = addZero(localTime[4])+":"+addZero(localTime[5]);
    street.emit("miniinfo:UpdateTime", time)
}, 60000);

alt.on('updateMoney', ()=>{
    street.emit("miniinfo:UpdateMoney");
});
alt.on('updateDate', ()=>{
    street.emit("miniinfo:UpdateDate");
});

alt.setInterval(() => {
    let getStreet = native.getStreetNameAtCoord(player.pos.x, player.pos.y, player.pos.z);

    let streetName = native.getStreetNameFromHashKey(getStreet[1]);
    let zoneName = native.getFilenameForAudioConversation(native.getNameOfZone(player.pos.x, player.pos.y, player.pos.z));
    street.emit("miniinfo:UpdateStreet", streetName, zoneName)
}, updateInterval);

