import { webMethod, Permissions } from 'wix-web-module';
import { contacts, triggeredEmails } from 'wix-crm-backend';

export const sendResultEmailWithContact = webMethod(Permissions.Anyone, async (name, email, result) => {
    try {

        console.log("🟨 Input received:", { name, email, result });

        // ✅ Validate input
        if (!name || !email) {
            throw new Error("Missing required fields: name or email.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }

        // 👤 Split name
        const [firstName, ...rest] = name.trim().split(" ");
        const lastName = rest.length > 0 ? rest.join(" ") : "";

        // 👥 Create contact
        const contactInfo = {
            name: { first: firstName, last: lastName },
            emails: [{ email, tag: "WORK", primary: true }]
        };

        const options = {
            allowDuplicates: true,
            suppressAuth: true
        };

        const contact = await contacts.createContact(contactInfo, options);
        const contactId = contact._id;

        if (!contactId) throw new Error("Failed to retrieve contact ID.");

        // 📤 Send triggered email
        const emailResult = await triggeredEmails.emailContact("VAzpW4t", contactId, {
            variables: {
                First_Name: firstName,
                Last_Name: lastName,
                Result: result,
                SITE_URL: "https://www.simply-accounting.com/"
            }
        });
        const emailResult1 = await triggeredEmails.emailMember("VAzpW4t", "054e2505-8ea4-41c0-98f7-785a7302ec3d", {
            variables: {
                First_Name: firstName,
                Last_Name: lastName,
                Result: result,
                SITE_URL: "https://www.simply-accounting.com/"
            }
        });
        

        console.log("📧 Email sent successfully.");
        return { success: true, message: "Email sent successfully.", result: emailResult , result2: emailResult1};

    } catch (error) {
        console.error("❌ Error in sendQuoteEmailWithContact:", error);
        return { success: false, message: error.message || "Unable to send quote email." };
    }
});