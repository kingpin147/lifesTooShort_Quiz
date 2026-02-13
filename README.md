# Life's Too Short - Business Builder Insights Quiz

This project implements an interactive "Business Builder Insights" quiz designed to be embedded in a Wix website. It collects user information, assesses their business status across various categories, and emails them a personalized report.

## Project Structure

The project consists of three main components:

### 1. Frontend UI (`quiz.html`)
- **Type**: HTML/CSS/JS (Embedded HTML Component)
- **Description**: This file contains the entire user interface for the quiz.
  - **Inputs**: User name and email.
  - **Quiz Sections**: Interactive sliders for categories like Clarity, Mindset, Self-Management, Marketing, etc.
  - **Logic**: Calculates results based on slider values and generates a summary string.
  - **Communication**: Sends the submitted data (name, email, results) to the parent Wix page using `window.parent.postMessage`.
  - **Feedback**: Displays a success message upon submission.

### 2. Wix Velo Page Code (`quiz.js`)
- **Type**: Wix Velo (Frontend)
- **Description**: This script runs on the Wix page containing the HTML component.
  - **Event Listener**: Listens for the `message` event from the HTML component (`#html1`).
  - **Action**: When a "submit" message is received, it calls the backend function `sendResultEmailWithContact`.
  - **Lightbox**: Opens a success lightbox (`quizPopup`) after the email process is initiated.

### 3. Backend Logic (`email.web.js`)
- **Type**: Wix Backend Web Module
- **Description**: Handles secure server-side operations.
  - **Contact Management**: Checks if a contact with the provided email already exists in Wix CRM.
    - If **Yes**: Uses the existing contact ID.
    - If **No**: Creates a new contact.
  - **Email Sending**: Sends a Triggered Email to the contact (and a copy to the site owner) using the template `VAzpW4t`.
  - **Validation**: Validates email format and ensures required fields are present.

## Setup & Integration

1.  **HTML Component**:
    - Add an HTML Element to your Wix page.
    - Paste the code from `quiz.html` into the element.

2.  **Page Code**:
    - Open the Code Panel (Dev Mode) for the page.
    - Paste the code from `quiz.js`.
    - Ensure the HTML element ID matches (`#html1`).

3.  **Backend Web Module**:
    - Create a new web module file named `email.web.js` in the `backend/` folder.
    - Paste the code from `email.web.js`.

4.  **Triggered Emails**:
    - Go to your Wix Dashboard > Marketing & SEO > Automations > Triggered Emails.
    - Create an email with the ID `VAzpW4t`.
    - Ensure it accepts variables: `First_Name`, `Last_Name`, `Result`, and `SITE_URL`.

## Features

- **Responsive Design**: Adapts for mobile and desktop views.
- **Real-time Feedback**: Interactive sliders with dynamic descriptions.
- **Smart Contact Handling**: Prevents duplicate contacts in Wix CRM.
- **Automated Emails**: Instant personalized results sent to the user.
