# 🖥️ SysMaster

**SysMaster** is a modern, feature-rich web application designed to simplify the management of devices, users, and groups within corporate networks. Built with Next.js, it provides secure and efficient administration through a sleek, intuitive interface.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user login
- Role-based access control (admin/user)
- Protected routes and content

### 👥 User Management
- Create, edit, and delete users
- Assign roles and permissions
- Link users to specific devices

### 🏢 Group Management
- Device organization into logical groups
- Automated prefix assignment
- Location tracking and management

### 💻 Device Management
- Real-time device status monitoring
- Detailed technical specifications
- User and group associations

### 📊 Dashboard
- Overview statistics
- Device status insights
- Activity logs and recent updates

### 💾 Data Storage
- JSON file-based storage
- localStorage caching
- RESTful API integration

---

## 🛠️ Technology Stack

### ⚛️ Frontend
- Next.js 13 (App Router)
- TypeScript
- Styled Components
- Phosphor Icons

### 🎨 UI/UX
- Fully responsive design
- Dark and light themes
- Component-based architecture

### 🔧 Backend
- Next.js API Routes
- Local JSON data storage
- Client-side caching (localStorage)

---

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js 18+
- Yarn package manager

### 📦 Installation

Clone the repository:
```bash
git clone https://github.com/gustavofalcao1/sysmaster-app.git
cd sysmaster-app
```

Install dependencies:
```bash
yarn install
```

Run the development server:
```bash
yarn dev
```

Visit the app:
- [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Credentials
- **Admin:**
  - Username: `admin`
  - Password: `admin123`

---

## 📂 Project Structure

```
src/
  ├── app/            # Application pages and API routes
  │   ├── api/        # Backend API endpoints
  │   └── ...         # Next.js App Router pages
  ├── components/     # UI and layout components
  │   ├── layout/     # Layout-specific components
  │   └── ui/         # Reusable UI elements
  ├── context/        # React Context providers
  ├── data/           # JSON data storage
  ├── lib/            # Utility functions and services
  ├── styles/         # Global styling and themes
  └── types/          # TypeScript definitions
```

---

## 🧑‍💻 Development

### 📜 Available Scripts
- `yarn dev` - Run development server
- `yarn build` - Create optimized production build
- `yarn start` - Start the production server
- `yarn lint` - Lint and check code quality
- `yarn format` - Format codebase

---

## 📈 Current Development Status

### ✅ Implemented
- User authentication
- User, group, and device CRUD
- Dashboard with key statistics
- JSON-based data persistence
- REST API endpoints
- Client-side caching (localStorage)

### 🚧 In Development
- Real-time system updates
- Notification infrastructure
- Advanced monitoring of devices
- Performance and analytics features

---

## 🤝 Contributing

Contributions are encouraged and welcome:

1. Fork the repository
2. Create your branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

Licensed under the **MIT License**. Refer to [LICENSE](LICENSE) for more information.

---

## 👤 Author
**Gustavo Falcão**  
[GitHub @gustavofalcao1](https://github.com/gustavofalcao1)  
[Project Repository](https://github.com/gustavofalcao1/sysmaster-app)

---
