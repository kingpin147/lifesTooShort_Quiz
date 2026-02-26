import { webMethod, Permissions } from 'wix-web-module';
import { contacts, triggeredEmails } from 'wix-crm-backend';

export const sendResultEmailWithContact = webMethod(Permissions.Anyone, async (name, email, phone, result) => {
    try {

        console.log("🟨 Input received:", { name, email, result });

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

        const emailResult = await triggeredEmails.emailContact("VAzpW4t", contactId, {
            variables: {
                First_Name: firstName,
                Last_Name: lastName,
                Phone: phone,
                Result: result,
                SITE_URL: "https://evpdesigns.wixstudio.com/my-site"
            }
        });
        const emailResult1 = await triggeredEmails.emailMember("VAzpW4t", "054e2505-8ea4-41c0-98f7-785a7302ec3d", {
            variables: {
                First_Name: firstName,
                Last_Name: lastName,
                Phone: phone,
                Result: result,
                SITE_URL: "https://evpdesigns.wixstudio.com/my-site"
            }
        });


        console.log("📧 Email sent successfully.");
        return { success: true, message: "Email sent successfully.", result: emailResult, result2: emailResult1 };

    } catch (error) {
        console.error("❌ Error in sendQuoteEmailWithContact:", error);
        return { success: false, message: error.message || "Unable to send quote email." };
    }
});