
alt.on("miniinfo:UpdateStreet", UpdateStreet);
alt.on("miniinfo:UpdateDate", UpdateDate);
alt.on("miniinfo:UpdateDay", UpdateDay);
alt.on("miniinfo:UpdateTime", UpdateTime);
alt.on("miniinfo:UpdateMoney", UpdateMoney);

function UpdateStreet(street, zone) {
    document.getElementsByClassName('street')[0].innerHTML = zone;
    document.getElementsByClassName('zone')[0].innerHTML = street;
}

function UpdateDate(date) {
    document.getElementsByClassName('date')[0].innerHTML = date;
}

function UpdateDay(day) {
    document.getElementsByClassName('day')[0].innerHTML = day;
}

function UpdateTime(time) {
    document.getElementsByClassName('time')[0].innerHTML = time;
}

function UpdateMoney(money) {
    document.getElementsByClassName('money')[0].innerHTML = money;
}