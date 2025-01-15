# SysMaster

A modern web application for managing devices, users, and groups in a corporate network.

## Features

- 🔐 **Authentication & Authorization**
  - Secure login
  - Role-based access (admin/user)
  - Protected routes

- 👥 **User Management**
  - User creation and editing
  - Role assignment
  - Device association

- 🏢 **Group Management**
  - Device organization
  - Automatic prefixes
  - Location management

- 💻 **Device Management**
  - Real-time status
  - Technical specifications
  - Group and user association

- 📊 **Dashboard**
  - General statistics
  - Device status
  - Recent activities

- 💾 **Data Storage**
  - JSON file storage
  - localStorage cache
  - REST API

## Technologies

- ⚛️ **Frontend**
  - Next.js 13 (App Router)
  - TypeScript
  - Styled Components
  - Phosphor Icons

- 🎨 **UI/UX**
  - Responsive design
  - Dark/light theme
  - Reusable components

- 🔧 **Backend**
  - Next.js API Routes
  - Local file system
  - localStorage cache

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gustavofalcao1/sysmaster-app.git
cd sysmaster-app
```

2. Install dependencies:
```bash
yarn install
```

3. Start development server:
```bash
yarn dev
```

4. Access http://localhost:3000

### Test Credentials

- Admin
  - Username: admin
  - Password: admin123

## Project Structure

```
src/
  ├── app/              # Pages and API routes
  │   ├── api/         # API endpoints
  │   └── ...          # Application pages
  ├── components/       # Reusable components
  │   ├── layout/      # Layout components
  │   └── ui/          # UI components
  ├── context/         # React contexts
  ├── data/            # JSON data files
  ├── lib/             # Utilities and services
  ├── styles/          # Global styles
  └── types/           # Type definitions
```

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Create production build
- `yarn start` - Start production server
- `yarn lint` - Run linter
- `yarn format` - Format code

## Current Status

### Implemented
- ✅ Authentication system
- ✅ User CRUD
- ✅ Group CRUD
- ✅ Device CRUD
- ✅ Dashboard with statistics
- ✅ JSON data persistence
- ✅ localStorage cache
- ✅ REST API

### In Development
- 🚧 Real-time updates
- 🚧 Notification system
- 🚧 Advanced device monitoring
- 🚧 Performance metrics

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
