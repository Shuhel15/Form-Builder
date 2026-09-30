# Form Builder

A modern full-stack form builder inspired by Google Forms. Create forms, customize questions, publish forms publicly, collect responses, and export response data as Excel or PDF.

## 🚀 Features

- 🔐 User authentication
- 🔁 Reset password
- �📝 Create, edit, and delete forms
- 📄 Form title and description
- ❓ Multiple question types
- 🔀 Reorder questions
- ✅ Required questions
- 👀 Form preview
- 🌐 Publish and unpublish forms
- 🔗 Public form URLs
- 📥 Collect form responses
- 📊 Response dashboard
- 👤 View individual responses
- 📊 Export responses to Excel
- 📄 Export responses to PDF
- 📱 Responsive design
- 🔒 Server-side authorization
- 👥 Users can only access their own forms and responses

## 🧩 Supported Question Types

- Short Text
- Long Text
- Multiple Choice
- Checkbox
- Dropdown
- Number
- Email
- Date

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Next.js App Router
- Server Components
- Server Actions
- API Routes

### Database

- MySQL
- Prisma ORM

### Authentication

- Auth.js / NextAuth
- Prisma Adapter
- Credentials Authentication
- Reset password flow
- Google OAuth

### Validation & Export

- Zod
- XLSX
- PDFKit

## 📊 Response Export

Form owners can export collected responses directly from the response dashboard.

### Excel Export

Responses are exported as an `.xlsx` file containing:

- Response number
- Submission date and time
- Question titles
- Submitted answers

### PDF Export

Responses are exported as a `.pdf` file containing:

- Form title
- Form description
- Total response count
- Submission date and time
- Questions
- Answers

## 🔒 Security

The application uses server-side authentication and authorization.

### Users can only:

- Access their own forms
- Edit their own forms
- Delete their own forms
- View their own responses
- Export responses from their own forms

## 📁 Folder Structure

```text
form-builder/
├── public/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── forms/
│   │   │       ├── page.tsx
│   │   │       └── [formId]/
│   │   │           ├── page.tsx
│   │   │           ├── edit/
│   │   │           │   └── page.tsx
│   │   │           ├── preview/
│   │   │           │   └── page.tsx
│   │   │           └── responses/
│   │   │               └── page.tsx
│   │   └── forms/
│   │       └── [formId]/
│   │           └── page.tsx
│   ├── actions/
│   │   ├── form.actions.ts
│   │   └── response.actions.ts
│   ├── components/
│   │   ├── form-builder/
│   │   ├── forms/
│   │   └── responses/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── types/
│       └── form.ts
├── .env
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## 🗄️ Database Models

```text
User
├── id
├── name
├── email
├── password
├── createdAt
└── updatedAt

Form
├── id
├── title
├── description
├── slug
├── published
├── userId
├── createdAt
└── updatedAt

Question
├── id
├── formId
├── type
├── title
├── required
├── order
├── options
├── createdAt
└── updatedAt

Submission
├── id
├── formId
├── answers
└── createdAt

User
 │
 └── Form
      │
      ├── Question
      │
      └── Submission
```

## 📦 Installation & Setup

1. **Clone the Repository**

```bash
git clone https://github.com/Shuhel15/form-builder.git
```

2. **Navigate to the Project**

```bash
cd form-builder
```

3. **Install Dependencies**

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database URL
DATABASE_URL="mysql://root:[YOUR PASSWORD]@localhost:3306/form_builder"

# Auth Secret
AUTH_SECRET= Your auth secret
```

## 🗃️ Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev
```
## ▶️ Run Locally
Start the development server:

```bash
npm run dev
```
Open the application at:[http://localhost:3000]

<p align="center">Made with ❤️ by <b>Shuhel Ahmed</b></p>