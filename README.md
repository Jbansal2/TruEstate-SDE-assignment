# Sales Management System

A full-stack sales transaction management application that allows users to search, filter, sort, and paginate through sales data. The system provides real-time customer, product, and store information with advanced filtering capabilities including region, gender, age range, product categories, payment methods, and more.

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Axios 1.13.2** - HTTP client for API requests
- **React Router DOM 7.10.1** - Client-side routing
- **React Icons 5.5.0** - Icon library

### Backend
- **Node.js** with **Express 5.2.1** - Server framework
- **MongoDB** with **Mongoose 9.0.1** - Database and ODM
- **Morgan 1.10.1** - HTTP request logger
- **CORS 2.8.5** - Cross-origin resource sharing
- **Joi 18.0.2** - Schema validation
- **dotenv 17.2.3** - Environment variable management

## Search Implementation Summary

The search functionality is implemented using **MongoDB's text search** on the `truestate` collection:

1. **Frontend**: Search input in [`Filters.jsx`](frontend/src/components/Filters.jsx) with 300ms debounce to minimize API calls
2. **Backend**: [`findCustomerIdsInTruestate()`](backend/src/services/transactionService.js) performs `$text` search on customer names and phone numbers
3. **Text Index**: Customer collection has a text index on `name` and `phone` fields (see [`Customer.js`](backend/src/models/Customer.js))
4. **Matching**: Retrieved customer IDs are used to filter sales transactions in the aggregation pipeline
5. **Empty Results**: If no customers match the search query, an empty result set is returned immediately

## Filter Implementation Summary

Filters are applied through a combination of **pre-lookup** and **post-lookup** MongoDB aggregation stages:

### Pre-Lookup Filters (on Sale collection)
Applied in [`buildSaleMatch()`](backend/src/services/transactionService.js):
- **Payment Methods** - Filters by `payment_method` field using `$in` operator
- **Date Range** - Filters using `date_from` and `date_to` with `$gte` and `$lte`
- **Order Status** - Filters by `order_status` field
- **Quantity Range** - Filters by `quantity_min` and `quantity_max`

### Post-Lookup Filters (after joining collections)
Applied in [`buildPostLookupFilters()`](backend/src/services/transactionService.js):
- **Customer Region** - Case-insensitive regex match on `customer.region`
- **Gender** - Case-insensitive regex match on `customer.gender`
- **Age Range** - Numeric range filter on `customer.age` using `$gte` and `$lte`
- **Product Category** - Case-insensitive regex match on `product.category`
- **Product Tags** - Array match on `product.tags` field

### Filter UI
All filters are implemented in [`Filters.jsx`](frontend/src/components/Filters.jsx) using dropdown selects. The `update()` function resets pagination to page 1 whenever filters change.

## Sorting Implementation Summary

Sorting is handled through a **validated sort field mapping** system:

1. **Frontend**: Sort dropdowns in [`Filters.jsx`](frontend/src/components/Filters.jsx) with options for:
   - Customer Name (A-Z)
   - Date (Newest/Oldest First)
   - Quantity (Highest First)

2. **Backend Validation**: [`validateSortField()`](backend/src/utils/sortValidator.js) ensures only allowed fields can be sorted

3. **Field Mapping**: [`SORT_FIELD_MAP`](backend/src/services/transactionService.js) maps frontend field names to MongoDB document paths:
   ```js
   'customer_name' → 'customer.name'
   'product_name' → 'product.name'
   'date' → 'date'
   'quantity' → 'quantity'
   ```

4. **Sort Direction**: Controlled by `sort_order` query parameter (`asc` or `desc`)

5. **Default**: Falls back to `date` descending if no valid sort is specified

## Pagination Implementation Summary

Pagination uses **MongoDB's `$skip` and `$limit`** with `$facet` for total count:

1. **Page Size**: Fixed at 10 items per page (defined in [`transactionService.js`](backend/src/services/transactionService.js))

2. **Aggregation Pipeline**: Uses `$facet` to simultaneously:
   - Retrieve paginated data with `$skip` and `$limit`
   - Count total matching documents with `$count`

3. **Meta Response**: Returns pagination metadata:
   ```json
   {
     "page": 1,
     "page_size": 10,
     "total_items": 150,
     "total_pages": 15
   }
   ```

4. **UI Component**: [`Pagination.jsx`](frontend/src/components/Pagination.jsx) displays:
   - Previous/Next buttons (disabled at boundaries)
   - Page numbers with 5-page sliding window
   - Current page highlighted

5. **State Management**: Page changes trigger filter state update in [`Transactions.jsx`](frontend/src/pages/Transactions.jsx), which re-fetches data via [`fetchTransactions()`](frontend/src/services/api.js)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance running
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=4000
   ```

4. Start the backend server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API base URL in [`api.js`](frontend/src/services/api.js) if needed (default: `http://localhost:4000/api`)

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

5. Build for production:
   ```bash
   npm run build
   ```

### Database Setup

Ensure your MongoDB database has:
- A `truestate` collection with customer, product, and store documents
- A `sales` collection with transaction data
- Text indexes on customer `name` and `phone` fields (see [`Customer.js`](backend/src/models/Customer.js))

### Access the Application

Open your browser and navigate to `http://localhost:5173` to view the Sales Management System.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   └── utils/           # Helper functions
    └── package.json
```

## API Endpoints

- `GET /api/transactions` - Fetch paginated, filtered, and sorted transactions
- `GET /api/transactions/:id` - Fetch a single transaction by ID

## Features

- Real-time search with debouncing
- Multiple filter options (region, gender, age, category, tags, payment method)
- Sorting by customer name, date, and quantity
- Pagination with page navigation
- Responsive design with Tailwind CSS
- Copy customer phone numbers to clipboard
- Loading states and error handling