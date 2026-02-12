import {sendResultEmailWithContact} from "backend/email.web"

$w('#html1').onMessage((event) => {
        let receivedMessage = event.data;
        console.log("🟨 Received message:", receivedMessage);
        if(receivedMessage.type === "submit"){
            sendResultEmailWithContact(receivedMessage.name, receivedMessage.email, receivedMessage.result);
        }
})