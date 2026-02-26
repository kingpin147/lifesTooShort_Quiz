import { sendResultEmailWithContact } from "backend/email.web"
import wixWindow from 'wix-window';

$w('#html1').onMessage(async (event) => {
    let receivedMessage = event.data;
    console.log("🟨 Received message:", receivedMessage);
    if (receivedMessage.type === "submit") {
        try {
            await sendResultEmailWithContact(receivedMessage.name, receivedMessage.email, receivedMessage.phone, receivedMessage.result);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
})