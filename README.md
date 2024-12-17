# DevBlog

Welcome to **DevBlog**, a modern blogging platform built for developers to share tutorials, stories, and technical expertise. This project is designed to foster collaboration and provide a seamless blogging experience with features tailored specifically for tech enthusiasts.

## 🌟 Features

### User Experience
- **Sign Up & Login:** Secure authentication for users to create and manage their accounts.
- **Profile Management:** Update your profile picture via drag-and-drop, change your email address, and update your profile details with ease.
- **Dashboard:** View, edit, and delete all your posts from a centralized dashboard.
- **Logout Functionality:** Securely log out and return to the homepage.

### Blogging Features
- **Dynamic Search with Suggestions:** Real-time suggestions make discovering content quick and intuitive.
- **SEO-Friendly Slugs:** Automatically generated optimized URLs to improve your post's visibility.
- **Rich Blog Editor:** Powered by React-Quill, providing markdown support, code snippets, and robust formatting options.

### Security
- **2FA (Two-Factor Authentication):** Enhanced security to protect user accounts.
- **Password Reset:** Quickly reset your password via email.

### Additional Highlights
- **Responsive Design:** Built with Tailwind CSS and ShadCN UI for a seamless experience across devices.
- **Image Uploads:** Integrated with Cloudinary for fast and reliable image storage.
- **Dark/Light Mode:** Toggle between light and dark themes for comfortable browsing.
- **PWA Support:** Access the platform like a native app on your mobile device.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) and [ShadCN UI](https://shadcn.dev/)
- **Editor:** [React-Quill](https://github.com/zenoamaro/react-quill)
- **Image Management:** [Cloudinary](https://cloudinary.com/)
- **Authentication:** JSON Web Tokens (JWT) and bcrypt.js
- **Hosting:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/devblog.git
   cd devblog
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create an `.env` file:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   CLOUDINARY_URL=your-cloudinary-url
   JWT_SECRET=your-jwt-secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

To create an optimized build:
```bash
npm run build
# or
yarn build
```

Serve the production build:
```bash
npm run start
# or
yarn start
```

## 📂 Folder Structure

```
├── app
│   ├── (auth)
│   │   ├── (routes)
│   │   │   ├── emailforgotpass
│   │   │   │   ├── page.tsx
│   │   │   ├── login
│   │   │   │   ├── page.tsx
│   │   │   ├── newpassword
│   │   │   │   ├── page.tsx
│   │   │   ├── signup
│   │   │   │   ├── page.tsx
│   │   │   ├── verifyemail
│   │   │   │   ├── page.tsx
│   ├── (dashboard)
│   │   ├── (routes)
│   │   │   ├── about
│   │   │   │   ├── page.tsx
│   │   │   ├── blog
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]
│   │   │   │   │   ├── page.tsx
│   │   │   ├── create
│   │   │   │   ├── page.tsx
│   │   │   ├── dashboard
│   │   │   │   ├── [userId]
│   │   │   │   │   ├── page.tsx
│   │   │   ├── edit
│   │   │   │   ├── [slug]
│   │   │   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   │   ├── page.tsx
│   │   ├── page.tsx
│   │   ├── types.ts
│   │   ├── _components
│   │   │   ├── CommentSection.tsx
│   │   │   ├── EditPost.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoginDialog.tsx
│   │   │   ├── LoginPrompt.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── navitem.tsx
│   │   │   ├── NavLinks.tsx
│   │   │   ├── NavLogin.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostUser.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Userprofile.tsx
│   ├── api
│   │   ├── blog
│   │   │   ├── route.ts
│   │   │   ├── [slug]
│   │   │   │   ├── route.ts
│   │   ├── comment
│   │   │   ├── [postId]
│   │   │   │   ├── route.ts
│   │   ├── create
│   │   │   ├── route.ts
│   │   ├── post
│   │   │   ├── route.ts
│   │   │   ├── [slug]
│   │   │   │   ├── route.ts
│   │   ├── profile
│   │   │   ├── route.ts
│   │   ├── suggestions
│   │   │   ├── route.ts
│   │   ├── userpro
│   │   │   ├── [username]
│   │   │   │   ├── route.ts
│   │   ├── users
│   │   │   ├── emailforgotpass
│   │   │   │   ├── route.ts
│   │   │   ├── forgotPass
│   │   │   │   ├── route.ts
│   │   │   ├── login
│   │   │   │   ├── route.ts
│   │   │   ├── logout
│   │   │   │   ├── route.ts
│   │   │   ├── me
│   │   │   │   ├── route.ts
│   │   │   ├── posts
│   │   │   │   ├── [userId]
│   │   │   │   │   ├── route.ts
│   │   │   ├── signup
│   │   │   │   ├── route.ts
│   │   │   ├── verifyemail
│   │   │   │   ├── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
├── components
│   ├── ModeToggle.tsx
│   ├── theme-provider.tsx
│   ├── ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── use-toast.ts
├── contexts
│   ├── UserContext.tsx
├── dbConfig
│   ├── dbConfig.ts
├── helpers
│   ├── action.ts
│   ├── getDataFromToken.ts
│   ├── mailer.ts
│   ├── PostContent.ts
│   ├── types.ts
├── lib
│   ├── CreatePostSchema.ts
│   ├── forgotPasswordSchema.ts
│   ├── formatDate.ts
│   ├── loginSchema.ts
│   ├── SendEmailforgotpassSchema.ts
│   ├── signUpSchema.ts
│   ├── utils.ts
├── middleware.ts
├── models
│   ├── CommentModel.ts
│   ├── PostModel.ts
│   ├── UserModel.ts
├── utils
│   ├── cloudinaryConfig.ts
│   ├── updateAuthorImage.ts

```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

Feel free to reach out with questions, suggestions, or feedback:
- **Email:** your-email@example.com
- **LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **GitHub:** [Your GitHub Profile](https://github.com/your-username)

---

Let’s build an incredible community of developers with **DevBlog**! 🚀
