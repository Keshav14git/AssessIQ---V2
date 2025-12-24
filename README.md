# Snipp 🧠
> *The Intelligent, Anti-Cheat Interview Platform.*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Convex](https://img.shields.io/badge/DB-Convex-orange)
![Stream](https://img.shields.io/badge/Video-Stream%20SDK-blue)

Snipp is a modern technical interview platform designed to conduct high-integrity, remote coding interviews. It combines real-time video, a collaborative code editor, and **AI Sentinel™**—a privacy-first proctoring system that monitors candidate behavior to ensure fair and valid assessments.

---

## 🚀 Key Features

### 🛡️ AI Sentinel™ Proctoring
-   **Strict Monitoring**: Uses client-side computer vision (MediaPipe) to track gaze, face visibility, and unauthorized persons.
-   **Full Screen Enforcement**: Candidates are locked into Full Screen mode. Exiting pauses the interview immediately.
-   **3-Tier Warning System**:
    -   **Tier 1**: Warning Toast (1-3 violations)
    -   **Tier 2**: Interviewer Alert (4 violations)
    -   **Tier 3**: Auto-Termination (6 violations)

### 💻 Immersive Coding Environment
-   **Monaco Editor**: A rich VS Code-like experience in the browser.
-   **Multi-Language**: Native support for JavaScript, Python, and Java.
-   **Real-Time Collaboration**: Changes sync instantly between candidate and interviewer.

### ⚡ Intelligent Scheduling
-   **Zero-Friction**: Interviewers create slots, and candidates receive automated invites with calendar links.
-   **Role-Based Access**: Dedicated dashboards for Interviewers (Conduct, Review) and Candidates (Join, Perform).

---

## 🛠️ Technology Stack

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS
-   **Database**: [Convex](https://convex.dev/) (Real-time backend-as-a-service)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Video**: [Stream Video SDK](https://getstream.io/video/sdk/react/)
-   **AI/ML**: Google MediaPipe (Vision), Gemini AI (Generative)
-   **Components**: shadcn/ui, Framer Motion, Lucide React

---

## 🏁 Getting Started

### Prerequisites
-   Node.js 18+
-   npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Keshav14git/AssessIQ---V2.git
    cd AssessIQ---V2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with the following keys:
    ```env
    # Convex
    CONVEX_DEPLOYMENT=
    NEXT_PUBLIC_CONVEX_URL=

    # Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    # Stream Video
    NEXT_PUBLIC_STREAM_API_KEY=
    STREAM_SECRET_KEY=

    # Gemini AI
    GEMINI_API_KEY=

    # Email (Nodemailer)
    GMAIL_USER=
    GMAIL_PASS=
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    and in a separate terminal:
    ```bash
    npx convex dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.
