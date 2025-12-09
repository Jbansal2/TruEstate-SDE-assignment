# Sales Management System - Architecture Document

## Table of Contents
1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Data Flow](#data-flow)
4. [Folder Structure](#folder-structure)
5. [Module Responsibilities](#module-responsibilities)

---

## Backend Architecture

### Overview
The backend follows a **layered MVC architecture** with Express.js, implementing separation of concerns through Controllers, Services, and Models.

### Architecture Layers

```
┌─────────────────────────────────────┐
│         API Routes Layer            │
│  (HTTP Request Routing)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controllers Layer              │
│  (Request/Response Handling)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │
│  (Business Logic & Validation)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Models Layer                 │
│  (MongoDB Schema Definitions)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       MongoDB Database              │
│  (Data Persistence)                 │
└─────────────────────────────────────┘
```

### Key Components

#### 1. **Routes** (`/src/routes/`)
- Define API endpoints and HTTP methods
- Map URLs to controller functions
- Apply middleware (validation, error handling)

#### 2. **Controllers** (`/src/controllers/`)
- Handle HTTP requests and responses
- Extract and validate query parameters
- Call service layer functions
- Format API responses

#### 3. **Services** (`/src/services/`)
- Contain core business logic
- Build MongoDB aggregation pipelines
- Handle data transformations
- Implement search, filter, sort, and pagination logic

#### 4. **Models** (`/src/models/`)
- Define Mongoose schemas
- Set up database indexes
- Configure virtual properties
- Implement schema validation

#### 5. **Utils** (`/src/utils/`)
- Provide reusable utility functions
- Sort field validation
- Error handling helpers
- Common middleware functions

### Database Design

**Collections:**
- `sales` - Transaction records
- `customers` - Customer information (from truestate)
- `products` - Product catalog (from truestate)
- `stores` - Store locations (from truestate)

**Relationships:**
- Sales → Customer (via `customer_id`)
- Sales → Product (via `product_id`)
- Sales → Store (via `store_id`)

**Indexes:**
- Text index on `customer.name` and `customer.phone`
- Index on `sale.date` for date range queries
- Index on `sale.payment_method` for filter performance

---

## Frontend Architecture

### Overview
The frontend follows a **Component-Based Architecture** built with React and Vite, implementing the Container-Presenter pattern.

### Architecture Pattern

```
┌─────────────────────────────────────┐
│         App Component               │
│  (Root & Routing)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Pages (Containers)             │
│  (State Management & Logic)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Components (Presenters)           │
│  (UI Rendering & User Input)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Services Layer                 │
│  (API Communication)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Backend API                   │
│  (RESTful Endpoints)                │
└─────────────────────────────────────┘
```

### Key Components

#### 1. **Pages** (`/src/pages/`)
- **Transactions.jsx**: Main container component
  - Manages application state (filters, pagination)
  - Orchestrates data fetching
  - Passes props to child components

#### 2. **Components** (`/src/components/`)
- **Filters.jsx**: Search and filter UI
  - Renders all filter inputs
  - Handles user input with debouncing
  - Emits filter changes to parent

- **TransactionTable.jsx**: Data display
  - Renders paginated transaction data
  - Displays customer, product, and store info
  - Provides copy-to-clipboard functionality

- **Pagination.jsx**: Navigation controls
  - Displays page numbers
  - Handles page changes
  - Shows current page state

- **LoadingSpinner.jsx**: Loading state
  - Shows during data fetching
  - Provides visual feedback

#### 3. **Services** (`/src/services/`)
- **api.js**: API communication layer
  - Axios instance configuration
  - API endpoint functions
  - Error handling and response transformation

#### 4. **Utils** (`/src/utils/`)
- Helper functions
- Format utilities
- Constants and configurations

### State Management

**Local Component State:**
- Uses React's `useState` hook
- Managed in `Transactions.jsx` container
- Props drilling to child components

**Filter State Structure:**
```javascript
{
  search: "",
  region: "",
  gender: "",
  age_from: "",
  age_to: "",
  category: "",
  tags: "",
  payment_method: "",
  date_from: "",
  date_to: "",
  order_status: "",
  quantity_min: "",
  quantity_max: "",
  sort_by: "date",
  sort_order: "desc",
  page: 1
}
```

---

## Data Flow

### Complete Request-Response Cycle

```
┌──────────────┐
│   Browser    │
│  (User Input)│
└──────┬───────┘
       │ 1. User enters search/filter
       ▼
┌──────────────┐
│  Filters.jsx │
│  Component   │
└──────┬───────┘
       │ 2. 300ms debounce
       │ 3. Call update() callback
       ▼
┌────────────────┐
│ Transactions   │
│    .jsx        │
│  (Container)   │
└──────┬─────────┘
       │ 4. Update state
       │ 5. Call fetchTransactions()
       ▼
┌──────────────┐
│   api.js     │
│  (Service)   │
└──────┬───────┘
       │ 6. HTTP GET with query params
       ▼
┌──────────────────┐
│  Backend API     │
│  /transactions   │
└──────┬───────────┘
       │ 7. Route to controller
       ▼
┌───────────────────┐
│ transactionCtrl   │
│  .getAll()        │
└──────┬────────────┘
       │ 8. Validate & extract params
       │ 9. Call service method
       ▼
┌───────────────────┐
│ transactionSvc    │
│ .findTransactions │
└──────┬────────────┘
       │ 10. Build aggregation pipeline
       │     - Search customer IDs
       │     - Apply filters
       │     - Join collections ($lookup)
       │     - Sort results
       │     - Paginate with $facet
       ▼
┌──────────────┐
│   MongoDB    │
│  Aggregate   │
└──────┬───────┘
       │ 11. Execute query
       │ 12. Return results + count
       ▼
┌───────────────────┐
│ transactionSvc    │
│  (Format response)│
└──────┬────────────┘
       │ 13. Structure JSON response
       ▼
┌───────────────────┐
│ transactionCtrl   │
│  (Send response)  │
└──────┬────────────┘
       │ 14. HTTP 200 with JSON
       ▼
┌──────────────┐
│   api.js     │
│  (Transform) │
└──────┬───────┘
       │ 15. Parse response
       ▼
┌────────────────┐
│ Transactions   │
│    .jsx        │
└──────┬─────────┘
       │ 16. Update state with data
       ▼
┌──────────────────┐
│ TransactionTable │
│    .jsx          │
└──────┬───────────┘
       │ 17. Render table rows
       ▼
┌──────────────┐
│   Browser    │
│  (Display)   │
└──────────────┘
```

### Search Flow Detail

```
User types "John" → Filters.jsx
                        ↓
                   300ms debounce
                        ↓
              update({ search: "John" })
                        ↓
              Transactions.jsx state update
                        ↓
              fetchTransactions() called
                        ↓
         API: GET /api/transactions?search=John
                        ↓
         transactionService.findCustomerIdsInTruestate()
                        ↓
         MongoDB: db.customers.find({ $text: { $search: "John" } })
                        ↓
         Extract customer IDs: ["id1", "id2"]
                        ↓
         Build aggregation with { customer_id: { $in: [...] } }
                        ↓
         Return matching sales records
                        ↓
         Display in TransactionTable
```

### Filter Flow Detail

```
User selects "Electronics" category → Filters.jsx
                                          ↓
                    update({ category: "Electronics" })
                                          ↓
                    Transactions.jsx (page reset to 1)
                                          ↓
              API: GET /api/transactions?category=Electronics
                                          ↓
              transactionService builds aggregation:
                    - $lookup products
                    - $match { "product.category": /Electronics/i }
                                          ↓
              MongoDB executes aggregation
                                          ↓
              Return filtered results
                                          ↓
              Display in TransactionTable
```

---

## Folder Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/                    # Configuration files
│   │   └── database.js           # MongoDB connection setup
│   │
│   ├── controllers/              # Request handlers
│   │   └── transactionController.js  # Transaction API logic
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── Customer.js          # Customer schema with text index
│   │   ├── Product.js           # Product schema
│   │   ├── Sale.js              # Sale transaction schema
│   │   └── Store.js             # Store schema
│   │
│   ├── routes/                   # API routes
│   │   └── transactionRoutes.js # Transaction endpoints
│   │
│   ├── services/                 # Business logic
│   │   └── transactionService.js # Core transaction operations
│   │
│   ├── utils/                    # Utilities
│   │   ├── sortValidator.js     # Sort field validation
│   │   └── errorHandler.js      # Error handling middleware
│   │
│   └── app.js                    # Express app setup
│
├── .env                          # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
└── server.js                    # Entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Filters.jsx         # Search & filter inputs
│   │   ├── TransactionTable.jsx # Data table display
│   │   ├── Pagination.jsx      # Page navigation
│   │   └── LoadingSpinner.jsx  # Loading indicator
│   │
│   ├── pages/                   # Page containers
│   │   └── Transactions.jsx    # Main page (state manager)
│   │
│   ├── services/                # API layer
│   │   └── api.js              # Axios instance & API calls
│   │
│   ├── utils/                   # Helper functions
│   │   └── formatters.js       # Data formatting utilities
│   │
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS imports
│
├── public/                      # Static assets
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── vite.config.js               # Vite build configuration
```

---

## Module Responsibilities

### Backend Modules

#### **1. server.js**
**Responsibility:** Application entry point
- Load environment variables
- Connect to MongoDB
- Start Express server
- Handle server errors

#### **2. app.js**
**Responsibility:** Express application configuration
- Set up middleware (CORS, Morgan, JSON parser)
- Mount API routes
- Configure error handlers
- Export configured app

#### **3. config/database.js**
**Responsibility:** Database connection management
- Create MongoDB connection
- Handle connection events
- Provide connection pooling
- Export connection instance

#### **4. models/Customer.js**
**Responsibility:** Customer data schema
- Define customer document structure
- Create text index on name and phone
- Set validation rules
- Export Customer model

#### **5. models/Product.js**
**Responsibility:** Product data schema
- Define product document structure
- Configure category and tags fields
- Set validation rules
- Export Product model

#### **6. models/Sale.js**
**Responsibility:** Sale transaction schema
- Define sale document structure
- Configure references to customer, product, store
- Set date, quantity, payment method fields
- Export Sale model

#### **7. models/Store.js**
**Responsibility:** Store data schema
- Define store document structure
- Configure location and contact fields
- Export Store model

#### **8. routes/transactionRoutes.js**
**Responsibility:** API route definitions
- Define GET /transactions endpoint
- Define GET /transactions/:id endpoint
- Map routes to controller methods
- Export router

#### **9. controllers/transactionController.js**
**Responsibility:** Request/response handling
- Extract and validate query parameters
- Call service layer methods
- Format success responses
- Handle and format errors
- Implement `getAll()` and `getById()` methods

#### **10. services/transactionService.js**
**Responsibility:** Core business logic
- **findCustomerIdsInTruestate()**: Search customers by text
- **buildSaleMatch()**: Build pre-lookup filters
- **buildPostLookupFilters()**: Build post-lookup filters
- **findTransactions()**: Main query orchestration
  - Execute customer search
  - Build aggregation pipeline
  - Perform $lookup joins
  - Apply sorting and pagination
  - Return formatted results with metadata

#### **11. utils/sortValidator.js**
**Responsibility:** Sort field validation
- Define allowed sort fields
- Validate incoming sort parameters
- Prevent injection attacks
- Return validated field names

---

### Frontend Modules

#### **1. main.jsx**
**Responsibility:** React application entry point
- Render root React component
- Mount to DOM element
- Import global styles

#### **2. App.jsx**
**Responsibility:** Root component and routing
- Set up React Router
- Define application routes
- Render header/navigation
- Provide layout structure

#### **3. pages/Transactions.jsx**
**Responsibility:** Main container component
- **State Management:**
  - Manage filter state object
  - Track loading and error states
  - Store transactions and pagination data

- **Data Fetching:**
  - `fetchTransactions()`: API call orchestration
  - Handle loading states
  - Process API responses
  - Error handling

- **Event Handlers:**
  - `handleFilterChange()`: Update filter state
  - `handlePageChange()`: Navigate pages
  - Reset page on filter changes

- **Component Composition:**
  - Render Filters component
  - Render TransactionTable component
  - Render Pagination component
  - Conditional rendering (loading, error, empty states)

#### **4. components/Filters.jsx**
**Responsibility:** Filter and search UI
- **Input Fields:**
  - Search input with debouncing
  - Region dropdown
  - Gender dropdown
  - Age range inputs
  - Category dropdown
  - Tags input
  - Payment method dropdown
  - Date range inputs
  - Order status dropdown
  - Quantity range inputs
  - Sort by dropdown
  - Sort order toggle

- **Event Handling:**
  - Capture user input
  - Implement 300ms debounce on search
  - Call parent `update()` callback
  - Reset page to 1 on filter changes

- **State Management:**
  - Receive filters as props
  - Maintain local input state
  - Sync with parent state

#### **5. components/TransactionTable.jsx**
**Responsibility:** Transaction data display
- Receive transactions array as prop
- Render table with columns:
  - Customer (name, phone with copy button)
  - Product (name, category)
  - Store (name, location)
  - Date
  - Quantity
  - Payment Method
  - Order Status
  - Total Price

- **Features:**
  - Copy phone number to clipboard
  - Format dates and currency
  - Responsive table design
  - Empty state message

#### **6. components/Pagination.jsx**
**Responsibility:** Page navigation controls
- Receive pagination props (page, totalPages, onPageChange)
- Render page buttons with 5-page window
- Implement Previous/Next buttons
- Disable buttons at boundaries
- Highlight current page
- Handle page clicks

#### **7. components/LoadingSpinner.jsx**
**Responsibility:** Loading state indicator
- Display animated spinner
- Show during data fetching
- Center on screen
- Provide visual feedback

#### **8. services/api.js**
**Responsibility:** API communication layer
- **Axios Configuration:**
  - Create axios instance
  - Set base URL (http://localhost:4000/api)
  - Configure timeout
  - Add interceptors (if needed)

- **API Methods:**
  - `fetchTransactions(filters)`: GET /transactions
    - Build query string from filters object
    - Handle response transformation
    - Return { data, meta }
  
  - `fetchTransactionById(id)`: GET /transactions/:id
    - Fetch single transaction details
    - Return transaction object

- **Error Handling:**
  - Catch network errors
  - Format error messages
  - Throw structured errors

#### **9. utils/formatters.js**
**Responsibility:** Data formatting utilities
- `formatDate()`: Convert ISO date to readable format
- `formatCurrency()`: Format numbers as currency
- `formatPhone()`: Format phone numbers
- `capitalizeFirst()`: Capitalize strings

---

## Design Patterns Used

### Backend Patterns

1. **MVC (Model-View-Controller)**
   - Models: Mongoose schemas
   - Controllers: Request handlers
   - Views: JSON responses

2. **Service Layer Pattern**
   - Separate business logic from controllers
   - Reusable service methods

3. **Repository Pattern**
   - Models act as data access layer
   - Mongoose provides abstraction over MongoDB

4. **Middleware Pattern**
   - Express middleware for CORS, logging, error handling

### Frontend Patterns

1. **Container-Presenter Pattern**
   - Containers: Transactions.jsx (logic)
   - Presenters: Filters.jsx, TransactionTable.jsx (UI)

2. **Service Layer Pattern**
   - API service abstracts HTTP communication

3. **Component Composition**
   - Small, reusable components
   - Props-based communication

4. **Controlled Components**
   - Form inputs controlled by React state

---

## Performance Optimizations

### Backend
- **Database Indexes**: Text index on customer names/phones
- **Aggregation Pipeline**: Efficient MongoDB queries
- **$facet**: Single query for data + count
- **Pre-filtering**: Apply filters before joins

### Frontend
- **Debouncing**: 300ms delay on search input
- **Pagination**: Limit data fetching to 10 items
- **Lazy Loading**: Only fetch visible page data
- **Memoization**: Can be added with React.memo for components

---

## Security Considerations

### Backend
- **Input Validation**: Joi schema validation (if implemented)
- **Sort Field Whitelist**: Prevent NoSQL injection
- **CORS Configuration**: Restrict allowed origins
- **Environment Variables**: Sensitive data in .env

### Frontend
- **API Base URL**: Configurable via environment
- **XSS Prevention**: React's built-in escaping
- **No sensitive data**: Client-side code is public

---

## Future Enhancements

1. **Caching**: Redis for frequently accessed data
2. **Authentication**: JWT-based user authentication
3. **Rate Limiting**: Prevent API abuse
4. **WebSockets**: Real-time updates
5. **State Management**: Redux or Context API for complex state
6. **Testing**: Unit tests (Jest) and E2E tests (Cypress)
7. **Docker**: Containerization for easy deployment
8. **CI/CD**: Automated testing and deployment pipelines

---

## Technology Justifications

### Why Express.js?
- Lightweight and flexible
- Rich middleware ecosystem
- Easy to learn and use
- Great for RESTful APIs

### Why MongoDB?
- Flexible schema for evolving requirements
- Powerful aggregation framework
- Text search capabilities
- Horizontal scaling support

### Why React?
- Component-based architecture
- Large ecosystem and community
- Virtual DOM for performance
- Hooks for state management

### Why Vite?
- Lightning-fast HMR (Hot Module Replacement)
- Optimized build process
- Native ES modules support
- Better developer experience than CRA

### Why Tailwind CSS?
- Utility-first approach
- Rapid prototyping
- Consistent design system
- Small production bundle size

---

## Conclusion

This architecture provides a scalable, maintainable foundation for the Sales Management System. The separation of concerns, layered architecture, and modular design make it easy to extend functionality, add new features, and maintain code quality over time.