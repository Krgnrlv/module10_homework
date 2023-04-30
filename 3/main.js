const message = document.querySelector('.messageInput'),
    send=document.querySelector('.btn'),
    geolocation=document.querySelector('.geolocation'),
    chat=document.querySelector('.placeForMessage');

const error = () => {
    writeToScreenServer('Невозможно получить ваше местоположение');
} 
const success = (position) => {
    console.log('position', position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    writeToScreenServer(`Широта: ${latitude} °, Долгота: ${longitude} °`);
    writeToScreenLink(latitude,longitude,"Ссылка на карту")
}    
geolocation.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        writeToScreenServer('Определение местоположения…');
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        writeToScreenServer('geolocation не поддерживается вашим браузером');
    }
});

function writeToScreenServer(message){
    let pre=document.createElement("div")
    pre.style.wordWrap="break-word";
    pre.className="message";
    pre.innerHTML=message;
    chat.appendChild(pre);
}
function writeToScreenLink(latitude,longitude,message){
    let  link = document.createElement('a');
    link.style.wordWrap="break-word";
    link.className="message";
    link.href =  `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    link.target="_blank"
    link.innerHTML=message
    chat.appendChild(link);
}
function writeToScreenUser(message){
    let pre=document.createElement("div")
    pre.style.wordWrap="break-word";
    pre.className="message message-user";
    pre.innerHTML=message;
    chat.appendChild(pre);
}
let skipEchoMessage = false;
let repeatIntervalId = 0;
function initWebSocket() {
    webSocket = new WebSocket("wss://echo-ws-service.herokuapp.com");

    webSocket.onopen = () => {
        writeToScreenServer("Соединение установлено");
        clearInterval(repeatIntervalId);
    }
    webSocket.onclose = () => {
        writeToScreenServer("Соединение закрыто. Повторная попытка через 10 секунд.");
        if (repeatIntervalId === 0)
            repeatIntervalId = setInterval(() => initWebSocket(), 10000);
    }
    webSocket.onmessage = (event) => {
        if (!skipEchoMessage) writeToScreenServer(event.data);
        skipEchoMessage = false;
    }
    webSocket.onerror = () => {
        writeToScreenServer("Произошла ошибка");
    }
     
};
initWebSocket();
send.addEventListener("click",()=>{
    if (message.value.length === 0) return;
    writeToScreenUser(message.value);
    webSocket.send(message.value);
    message.value = "";
})

