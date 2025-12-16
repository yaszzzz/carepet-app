# CarePet App 🐾

CarePet is a modern Pet Care Management System designed to streamline pet boarding and care services. Built with the latest web technologies, it offers a robust platform for administrators to manage pets, services, and users securely and efficiently.

## 🚀 Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js v5](https://authjs.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Features

-   **🔐 Secure Authentication**:
    -   Role-based access (Admin vs User).
    -   Secure login/logout functionality via NextAuth.js.

-   **📊 Admin Dashboard**:
    -   **Overview**: Quick stats and insights.
    -   **Pet Management**: View, Add, Edit, and Delete pet records.
    -   **Service Management**: Manage boarding and care services.
    -   **User Management**: Oversee registered users.

-   **🐶 Pet Boarding System**:
    -   Track pet details (Name, Type, Age, Special Needs).
    -   Manage ownership information.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A PostgreSQL database URI (e.g., from Neon)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/carepet-app.git
    cd carepet-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
    AUTH_SECRET="your_generated_auth_secret" # Generate with: npx auth secret
    ```

4.  **Database Migration:**
    Push the database schema to your PostgreSQL instance:
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Run the application:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
carepet-app/
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/            # Admin dashboard routes
│   └── (auth)/           # Authentication routes
├── components/           # Reusable UI components
│   ├── atoms/            # Basic building blocks (Buttons, Inputs)
│   ├── molecules/        # Combinations of atoms (Form fields, Cards)
│   ├── organisms/        # Complex sections (Navbars, Modals)
│   └── templates/        # Page layouts
├── lib/                  # Utility functions and server actions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
