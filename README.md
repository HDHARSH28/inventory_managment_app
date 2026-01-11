<<<<<<< HEAD
# Inventory_Managment_System
=======
# Stock Management System

A modern, full-stack inventory management application for efficient stock tracking and management. Built with React, Express.js, and MongoDB Atlas.

## Features

- ✅ **Add Items**: Create new inventory items with name, size (2x2, 4x2, 18x12, 12x12, or custom), and initial quantity
- ✅ **Adjust Quantities**: Add or remove units from items using a dedicated input box
- ✅ **Remove Items**: Delete items from inventory with confirmation
- ✅ **View Inventory**: Comprehensive list view of all current stock items
- ✅ **Search Functionality**: Search items by name or size in real-time
- ✅ **History Tracking**: Complete audit trail of all inventory changes (created, quantity added/removed, deleted)
- ✅ **MongoDB Atlas Integration**: Cloud-based database for reliable data storage

## Tech Stack

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **HTTP Client**: Axios

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. MongoDB Atlas Configuration

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user (remember the username and password)
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
7. Update `.env` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
   PORT=5000
   ```

### 3. Run the Application

#### Option 1: Run Both Server and Client (Recommended)

```bash
npm run dev:full
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
IM_system/
├── server/                 # Backend server
│   ├── index.js           # Express server setup
│   ├── models/            # MongoDB models
│   │   ├── Item.js        # Item schema
│   │   └── History.js     # History schema
│   └── routes/            # API routes
│       ├── items.js       # Item CRUD operations
│       └── history.js     # History endpoints
├── src/                   # Frontend React app
│   ├── components/        # React components
│   │   ├── AddItemForm.jsx
│   │   ├── InventoryList.jsx
│   │   ├── HistoryTab.jsx
│   │   └── SearchBar.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
└── package.json
```

## API Endpoints

### Items
- `GET /api/items` - Get all items (supports ?search=query)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PATCH /api/items/:id/quantity` - Update item quantity
- `DELETE /api/items/:id` - Delete item

### History
- `GET /api/history` - Get all history entries
- `GET /api/history/item/:itemId` - Get history for specific item

## Usage

1. **Adding Items**: Click "Add New Item" button, fill in the form with item name, size, and initial quantity
2. **Adjusting Quantities**: Enter a number in the quantity input box and click "+ Add" or "- Remove"
3. **Searching**: Type in the search bar to filter items by name or size
4. **Viewing History**: Click the "History" tab to see all inventory changes
5. **Deleting Items**: Click the "×" button on any item card to remove it from inventory

## Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

## License

MIT
>>>>>>> 88e27bb (Initial commit)
