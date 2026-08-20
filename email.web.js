import { webMethod, Permissions } from 'wix-web-module';
import { contacts, triggeredEmails } from 'wix-crm-backend';

export const sendResultEmailWithContact = webMethod(Permissions.Anyone, async (name, email, phone, result, categoryScores = {}) => {
    try {

        console.log("🟨 Input received:", { name, email, result, categoryScores });

        // ✅ Validate input
        if (!name || !email || !phone) {
            throw new Error("Missing required fields: name, email, or phone.");
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
            emails: [{ email, tag: "WORK", primary: true }],
            phones: [{ phone, tag: "MOBILE", primary: true }]
        };

        // 🔍 Check if contact already exists
        const queryOptions = { suppressAuth: true };
        const existingContacts = await contacts.queryContacts()
            .eq("info.emails.email", email)
            .find(queryOptions);

        let contactId;

        if (existingContacts.items.length > 0) {
            // Use existing contact
            contactId = existingContacts.items[0]._id;
            console.log("✅ Found existing contact:", contactId);

            // Optional: Update contact info if needed
            // await contacts.updateContact(contactId, contactInfo, options);
        } else {
            // Create new contact
            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };
            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
            console.log("✅ Created new contact:", contactId);
        }

        if (!contactId) throw new Error("Failed to retrieve contact ID.");

        const variables = {
            First_Name: firstName,
            Last_Name: lastName,
            Phone: phone,
            SITE_URL: "https://www.lifes2shortllc.com/",
            Clarity: categoryScores.Clarity || "",
            Mindset: categoryScores.Mindset || "",
            Self_Management: categoryScores.Self_Management || "",
            Marketing: categoryScores.Marketing || "",
            Selling: categoryScores.Selling || "",
            Customer_Journey_and_Care: categoryScores.Customer_Journey_and_Care || "",
            Leadership: categoryScores.Leadership || "",
            Self_Care: categoryScores.Self_Care || "",
            Money_Matters: categoryScores.Money_Matters || ""
        };

        // 1. Email the user who completed the quiz
        const emailResult = await triggeredEmails.emailContact("VAzpW4t", contactId, { variables });

        // 2. Email a copy to Judy (judy@lifes2shortllc.com)
        const JUDY_EMAIL = "judy@lifes2shortllc.com";
        let emailResultJudy = null;
        try {
            const existingJudy = await contacts.queryContacts()
                .eq("info.emails.email", JUDY_EMAIL)
                .find(queryOptions);

            let judyContactId;
            if (existingJudy.items.length > 0) {
                judyContactId = existingJudy.items[0]._id;
            } else {
                const judyContact = await contacts.createContact({
                    name: { first: "Judy", last: "" },
                    emails: [{ email: JUDY_EMAIL, tag: "WORK", primary: true }]
                }, { allowDuplicates: false, suppressAuth: true });
                judyContactId = judyContact._id;
            }

            if (judyContactId && judyContactId !== contactId) {
                emailResultJudy = await triggeredEmails.emailContact("VAzpW4t", judyContactId, { variables });
            }
        } catch (judyErr) {
            console.error("⚠️ Error sending copy to Judy:", judyErr);
        }

        console.log("📧 Email sent successfully.");
        return { success: true, message: "Email sent successfully.", result: emailResult, resultJudy: emailResultJudy };

    } catch (error) {
        console.error("❌ Error in sendQuoteEmailWithContact:", error);
        return { success: false, message: error.message || "Unable to send quote email." };
    }
});