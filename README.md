# Life's Too Short - Business Builder Insights Quiz

This project implements an interactive **"Business Builder Insights"** quiz designed to be embedded in a Wix website (`https://www.lifes2shortllc.com/`). It collects user contact information (Name, Email, Phone Number), assesses their business status across 9 key categories, calculates personalized score insights, displays inline results, and triggers automated email delivery to both the quiz respondent and the site owner (`judy@lifes2shortllc.com`).

---

## Project Structure

The codebase consists of three core files:

### 1. Frontend UI ([`quiz.html`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.html))
- **Type**: Embedded HTML Component (IFrame)
- **Description**: Standard HTML5/CSS3/JavaScript interface for the quiz.
  - **User Inputs**: Name, Email, and Phone Number.
  - **Category Sliders**: Interactive 1–10 sliders for 9 categories:
    - *Clarity, Mindset, Self-Management, Marketing, Selling, Customer Journey & Care, Leadership, Self-Care, Money Matters*.
  - **Design System**: Bold headers styled in `#DA364D` (matching the client's red logo & buttons), responsive mobile-friendly box selections, and animated result displays.
  - **Communication**: Sends JSON payload `{ type: "submit", name, email, phone, result, categoryScores }` to Wix parent frame via `window.parent.postMessage`.

### 2. Wix Velo Page Code ([`quiz.js`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.js))
- **Type**: Wix Velo Page Script (Frontend)
- **Description**: Runs on the Wix web page containing the `#html1` element.
  - Listens for `onMessage` events from `#html1`.
  - Passes user submission payload to the Velo backend web module `sendResultEmailWithContact`.

### 3. Backend Logic ([`email.web.js`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/email.web.js))
- **Type**: Wix Velo Backend Web Module
- **Description**: Server-side logic running on Wix backend.
  - **Validation**: Checks for required fields and validates email format.
  - **Contact CRM**: Searches Wix CRM by email using `wix-crm-backend`. Uses existing contact ID or creates a new contact with Name, Email, and Mobile Phone.
  - **Email Automation**:
    1. Triggers Wix Email Template `VAzpW4t` sent to the respondent contact.
    2. Dynamically queries/creates contact for `judy@lifes2shortllc.com` and sends a duplicate notification email to Judy automatically.

---

## Breakdown: What is Handled in Code vs. Manual Wix Dashboard

| Client Request Item | Handled By | Details |
| :--- | :--- | :--- |
| **1. Quiz UI Header Colors (`#DA364D`) & Bold** | **Code** ([`quiz.html`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.html)) | Completed in code. Category headers and buttons match exact brand red `#DA364D`. |
| **2. Dual Delivery (Respondent + Judy)** | **Code** ([`email.web.js`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/email.web.js)) | Completed in backend code. Automatically sends emails to both the quiz respondent and `judy@lifes2shortllc.com`. |
| **3. Spacing in Email Results Text** | **Code** ([`quiz.html`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.html)) | Completed in code. Double line breaks separate headers and descriptions. |
| **4. Email Sender Address (`judy@lifes2shortllc.com`)** | **Manual Wix Dashboard** | Wix security requires verifying the sender email in **Wix Settings > Triggered Emails / Business Info**. |
| **5. Email Subject Line Change** | **Manual Wix Dashboard** | Wix Triggered Email subject line is set inside template **`VAzpW4t`**. |
| **6. Email Opening Intro Message & Greetings** | **Manual Wix Dashboard** | The static text in template **`VAzpW4t`** is styled and edited directly in the Wix Email Editor. |
| **7. Red Bold Category Headings in Email** | **Manual Wix Dashboard** | Wix dynamic variables (`${Result}`) do not parse raw HTML strings (they render tags as plain text). For red bold headers in the email, style the text in the Wix Triggered Email Editor. |

---

## Step-by-Step Instructions for Wix Dashboard (Manual Configuration)

### Step 1: Update Email Template (`VAzpW4t`)
1. Go to **Wix Dashboard** > **Marketing & SEO** > **Triggered Emails**.
2. Locate template **`VAzpW4t`** and click **Edit**.
3. **Subject Line**: Change to:
   ```text
   View Your Business Builder Assessment Results!
   ```
4. **Body Greeting & Message**: Set the opening text to:
   ```text
   Thank you for taking my Business Builder's Assessment!

   Here's a look into your current score! Remember, as you continue to grow in your business, your scores will change.

   Hi ${First_Name},

   https://www.lifes2shortllc.com/
   ```
5. **Results Section**:
   - In the email editor, you can keep the dynamic variable `${Result}` (which now contains neat line spacing between categories), OR you can add styled text blocks with color `#DA364D` for each header and place corresponding variables (`${Clarity}`, `${Mindset}`, etc.) beneath each header.
6. Click **Save & Publish**.

---

### Step 2: Set Sender Email to `judy@lifes2shortllc.com`
1. In Wix Dashboard, go to **Settings** > **Triggered Emails** (or **Settings** > **Business Info** / **Email Settings**).
2. Set the **Sender Name** to `Judy` (or `Life's 2 Short LLC`) and **Sender Email** to `judy@lifes2shortllc.com`.
3. Check Judy's inbox to confirm any Wix verification link if prompted.

---

### Step 3: Copy Updated Code into Wix
1. **Frontend IFrame**: Copy [`quiz.html`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.html) into your `#html1` embed component.
2. **Page Code**: Copy [`quiz.js`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/quiz.js) into the Page Code tab.
3. **Backend Module**: Copy [`email.web.js`](file:///d:/nouman%20wix%20code/lifesTooShort_Quiz/email.web.js) into `backend/email.web.js`.
4. Click **Publish** on the Wix Editor.
