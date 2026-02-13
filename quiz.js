import { sendResultEmailWithContact } from "backend/email.web"
import wixWindow from 'wix-window';

$w('#html1').onMessage(async (event) => {
    let receivedMessage = event.data;
    console.log("🟨 Received message:", receivedMessage);
    if (receivedMessage.type === "submit") {
        try {
            await sendResultEmailWithContact(receivedMessage.name, receivedMessage.email, receivedMessage.result);
            wixWindow.openLightbox("quizPopup");
        } catch (error) {
            console.error("Error sending email:", error);
            // Still open the popup or handle error appropriately? 
            // Often better to show success to user anyway or fallback. 
            // For now, I'll still open the lightbox as the user likely wants the flow to continue visually.
            wixWindow.openLightbox("quizPopup");
        }
    }
})