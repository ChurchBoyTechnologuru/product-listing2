# Database Setup Guide

This guide will help you set up the local database for the International Marketplace application.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Database Configuration

1. **Install PostgreSQL** (if not already installed):
   - **macOS**: `brew install postgresql`
   - **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

2. **Create a database**:
   ```sql
   CREATE DATABASE marketplace_db;
   CREATE USER marketplace_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO marketplace_user;
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://marketplace_user:your_password@localhost:5432/marketplace_db"
   NEXT_PUBLIC_API_BASE="/api"
   ```

## Database Setup Commands

### Quick Setup (Recommended)
```bash
npm run db:setup
```
This command will:
- Generate Prisma client
- Push schema to database
- Seed the database with sample data

### Manual Setup
If you prefer to run commands individually:

1. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

2. **Push schema to database**:
   ```bash
   npm run db:push
   ```

3. **Seed the database**:
   ```bash
   npm run db:seed
   ```

### Development Commands

- **View database in browser**: `npm run db:studio`
- **Reset database**: `npm run db:reset`
- **Create migration**: `npm run db:migrate`

## Database Schema

The database includes the following main entities:

### Core Entities
- **Users**: User accounts with authentication
- **Categories**: Product and service categories with hierarchy
- **Products**: Products and services with images
- **Shops**: Seller shops and storefronts
- **Orders**: Order management and tracking

### Key Features
- **Password Authentication**: Secure password hashing with bcrypt
- **Image Storage**: Product images with metadata
- **Category Hierarchy**: Nested categories for products and services
- **Multi-currency Support**: Products in different currencies
- **International Shipping**: Shipping options for different countries

## Sample Data

The seed script creates:
- 5 users (1 admin, 3 sellers, 2 buyers)
- 3 shops with different specializations
- 6 sample products across different categories
- 50+ product and service categories
- Sample reviews, orders, and shipping options

## Troubleshooting

### Common Issues

1. **Connection Error**:
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database and user exist

2. **Permission Error**:
   - Grant proper permissions to the database user
   - Check if the user can connect to the database

3. **Schema Error**:
   - Run `npm run db:reset` to reset the database
   - Then run `npm run db:setup` again

### Reset Database
If you need to start fresh:
```bash
npm run db:reset
npm run db:setup
```

## Production Setup

For production deployment:

1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Set up proper environment variables
3. Run migrations instead of db:push
4. Consider using connection pooling
5. Set up database backups

## Support

If you encounter issues:
1. Check the Prisma documentation
2. Verify your database connection
3. Check the console for error messages
4. Ensure all dependencies are installed

