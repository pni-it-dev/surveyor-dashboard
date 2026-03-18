# Trade Area Analysis Report Dashboard

A professional, modern dashboard for demographic and trade area analysis with interactive charts, geographic visualization, and real-time filtering capabilities.

## Features

### Dashboard Features

- 🔐 **Secure Authentication**: Email/password auth with bcrypt hashing, cookie-based sessions, and password reset via email
- 🗺️ **Interactive Maps**: Leaflet-based GeoJSON mapping for geographic trade area visualization
- 📊 **Rich Chart Library**: Comprehensive demographic dashboards with multiple chart types
- 🎨 **Modern UI**: Professional design with Framer Motion animations and responsive layout
- 🔄 **Global Filtering**: Click any chart element to filter all visualizations in real-time
- 💾 **PostgreSQL Database**: Drizzle ORM for type-safe database operations
- 📧 **Email Service**: Nodemailer integration for password reset emails
- 📥 **Dashboard PDF Export**: Download complete dashboard as PDF report

### Data Management Features

- 📋 **Data Table**: TanStack React Table with sortable columns and full-width sticky headers
- 🔍 **Advanced Filtering**: Filter by gender, marital status, employment, occupation, and cities
- 📑 **Pagination**: Customizable page sizes (10, 20, 50, 100 records per page)
- ✅ **Row Selection**: Individual row checkboxes and batch select all functionality
- ✏️ **Add/Edit Records**: Form dialog for adding and editing demographic data with validation
- 🗑️ **Delete Operations**: Single row delete with confirmation dialog and batch delete support
- 📤 **Multiple Export Formats**: Export data as JSON, CSV, Excel (.xlsx), or PDF
- 📱 **Responsive Design**: Fully responsive table layout that adapts to mobile and desktop screens

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Custom email/password auth with bcryptjs
- **Mapping**: Leaflet + React-Leaflet with GeoJSON support
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Email**: Nodemailer
- **Styling**: Tailwind CSS + shadcn/ui
- **Email Auth**: Better Auth integration ready

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- (Optional) Gmail or SMTP email account for password reset

### Installation

1. **Clone and install dependencies**:

   ```bash
   pnpm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

3. **Configure `.env.local`**:

   ```env
   # Database (PostgreSQL connection string)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trade_area_db"

   # Email Service (Optional - for password reset emails)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   SMTP_FROM="noreply@tradearea.com"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   JWT_SECRET="your-secret-key-min-32-characters"
   ```

4. **Initialize database**:

   ```bash
   pnpm run db:migrate     # Run migrations
   pnpm run db:seed        # Seed with sample data
   ```

   Or use the automated setup:

   ```bash
   bash scripts/setup.sh
   ```

5. **Start development server**:

   ```bash
   pnpm run dev
   ```

6. **Open browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Sign up for an account or log in
   - Explore the dashboard

## Database Schema

The application includes 13 PostgreSQL tables:

- **users**: User accounts and authentication
- **sessions**: Cookie-based session management
- **password_reset_tokens**: Password reset token tracking
- **cities**: Geographic trade area definitions
- **demographics**: Population and household data
- **gender_breakdown**: Gender distribution
- **marital_status_breakdown**: Marital status distribution
- **occupation_status_breakdown**: Employment status
- **job_occupations**: Job type breakdown
- **age_group_data**: Age distribution with generations
- **socioeconomic_data**: Income category distribution
- **income_data**: Monthly income ranges
- **food_expenditure_data**: Food spending patterns
- **points_of_interest**: Nearby retail, restaurant, hospital data

## Features & Components

### Authentication

- Signup with email validation
- Email/password login with secure sessions
- Logout functionality
- Password reset via email tokens (24-hour expiry)
- HTTP-only cookie storage

### Dashboard

- **City Information Header**: Location, address, coordinates
- **Filter Controls**: City selector with global filter state
- **GeoJSON Map**: Interactive map showing trade area boundaries
- **Demographics Summary**: Population, households, avg household size
- **Gender Chart**: Clickable bar chart for gender filtering
- **Marital Status**: Doughnut chart with status breakdown
- **Occupation Status**: Distribution across employment categories
- **Job Occupations**: Horizontal bar chart of job types
- **Age Groups**: Stacked bar chart grouped by generation
- **Socioeconomic Data**: Income category breakdown
- **Monthly Income**: Income range distribution
- **Food Expenditure**: Spending by food category
- **POI Summary**: Count of nearby retail, restaurants, hospitals, etc.
- **Footer**: Navigation and company information

## Global Filtering

Click any chart element (bar, pie slice, etc.) to apply filters:

- Filter persists across the page
- Multiple filters can be combined
- "Clear All" button resets all filters
- All charts update dynamically

## Sample Data

The seeder generates realistic data for 3 cities:

- **Jakarta**: Central Jakarta with ~2.5M population
- **Surabaya**: East Java with ~1.8M population
- **Bandung**: West Java with ~2.0M population

Each city includes complete demographic, occupational, age, income, and POI data.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset
- `POST /api/auth/validate-reset-token` - Validate reset token

### Data

- `GET /api/cities` - List all cities
- `GET /api/demographics?cityId=1` - Get demographic data for city
- `GET /api/demographics/list` - List all demographic records
- `POST /api/demographics/list` - Add new demographic record
- `PUT /api/demographics/list` - Update demographic record
- `DELETE /api/demographics/list?id=1` - Delete demographic record

## Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── cities/            # Cities data
│   └── demographics/      # Demographic data endpoints
├── dashboard/             # Protected dashboard with charts
├── data/                  # Data management table page
├── forgot-password/       # Password reset request
├── login/                 # Login page
├── reset-password/        # Password reset form
├── signup/                # Account creation
└── page.tsx               # Home/redirect

components/
├── dashboard/             # Dashboard components
│   ├── age-group-chart.tsx
│   ├── city-info.tsx
│   ├── demographics-summary.tsx
│   ├── filter-controls.tsx
│   ├── food-expenditure-chart.tsx
│   ├── gender-chart.tsx
│   ├── income-chart.tsx
│   ├── job-occupation-chart.tsx
│   ├── map-chart.tsx
│   ├── map-component.tsx
│   ├── marital-status-chart.tsx
│   └── occupation-status-chart.tsx
├── data-table.tsx         # TanStack table with pagination and filters
├── data-form-dialog.tsx   # Add/Edit data form
├── navbar.tsx             # Navigation with Dashboard/Data links
├── footer.tsx             # Footer component
│   ├── poi-summary.tsx
│   └── socioeconomic-chart.tsx
├── footer.tsx             # Footer component
└── navbar.tsx             # Navigation bar

lib/
├── auth.ts                # Authentication utilities
├── db.ts                  # Database connection
├── email.ts               # Email service
├── filter-context.ts      # Global filter context
└── schema.ts              # Drizzle ORM schema

scripts/
├── migrate.sql            # Database migrations
├── seed.ts                # Sample data seeder
└── setup.sh               # Automated setup
```

## Development

### Database Management

View available commands:

```bash
pnpm run db:migrate    # Run SQL migrations
pnpm run db:seed       # Populate sample data
pnpm run db:setup      # Automated setup
```

### Environment Variables

All sensitive data should be in `.env.local`:

```bash
DATABASE_URL         # PostgreSQL connection
SMTP_HOST           # Email SMTP host
SMTP_PORT           # Email SMTP port
SMTP_USER           # Email account username
SMTP_PASSWORD       # Email account password
JWT_SECRET          # Session encryption key
```

## Email Configuration

### Gmail Setup

1. Enable "Less secure app access" or use an App Password
2. Use `smtp.gmail.com` as SMTP_HOST
3. Set SMTP_PORT to `587` (TLS)
4. Use your Gmail address as SMTP_USER
5. Use an App Password, not your regular password

### Alternative Email Services

Replace SMTP settings with your email provider:

- SendGrid, Mailgun, Office 365, AWS SES, etc.

## Production Deployment

Before deploying to production:

1. **Security**:
   - Set strong JWT_SECRET
   - Use environment variables from hosting platform
   - Enable HTTPS
   - Set secure cookie flags

2. **Database**:
   - Use managed PostgreSQL service
   - Enable automated backups
   - Monitor performance

3. **Email**:
   - Configure production email service
   - Test password reset flow
   - Monitor email delivery

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT NOW();"
```

### Email Not Sending

- Check SMTP credentials in `.env.local`
- Verify email service is enabled
- Check email service logs/dashboard
- For Gmail, ensure App Password is used (not regular password)

### Migration Fails

```bash
# Check database exists
psql postgres -c "CREATE DATABASE trade_area_db;"

# Re-run migration
pnpm run db:migrate
```

## Using the Data Management System

### Navigation

The navbar includes two main sections:

- **Dashboard**: Interactive charts with global filtering and GeoJSON maps
- **Data**: Table view for managing demographic data

### Data Table Features

#### Viewing Data

1. Navigate to the **Data** page from the navbar
2. View all demographic records in a sortable, paginated table
3. Use the **Per page** selector to adjust rows displayed (10, 20, 50, 100)

#### Filtering

- **City**: Filter records by specific cities
- **Gender**: Show records with male or female majority
- **Status**: Filter by marital or employment status
- Click **Clear** to reset all filters

#### Adding Records

1. Click **Add** button at the top
2. Fill in the demographic form:
   - Select a city
   - Enter population, households, and demographic breakdown
   - Input gender, marital status, and employment data
3. Click **Add Data** to save

#### Editing Records

1. Click the **Edit** (pencil) icon on any row
2. Update the demographic information in the form dialog
3. Click **Update Data** to save changes

#### Deleting Records

- **Single Delete**: Click the **Delete** (trash) icon on any row, confirm in the dialog
- **Batch Delete**: Select multiple rows using checkboxes, click **Delete [X]** button, confirm in the dialog

#### Exporting Data

Click the **Export** dropdown to download data in multiple formats:

- **JSON**: Raw JSON format for integration
- **CSV**: Spreadsheet format for Excel
- **Excel**: Native .xlsx format with formatted columns
- **PDF**: Formatted PDF report with headers and styling

#### Dashboard PDF Report

While viewing the **Dashboard** page:

1. Open the account menu (top right)
2. Select **Download PDF Report**
3. A PDF snapshot of the dashboard will be generated and downloaded

### Batch Operations

- **Select All**: Use the checkbox in the table header to select all visible records
- **Individual Selection**: Check boxes next to specific rows
- **Batch Delete**: With rows selected, click **Delete [X]** to remove multiple records at once

## Security Notes

- Passwords are hashed with bcrypt (10-round salt)
- Sessions use HTTP-only, Secure cookies
- Password reset tokens expire after 24 hours
- CSRF protection ready with shadcn/ui
- Input validation on all forms
- SQL injection prevention via Drizzle ORM parameterized queries

## Performance

- Lazy-loaded Leaflet map component
- Optimized Recharts visualizations
- CSS-in-JS with Tailwind (utility-first)
- Server-side rendering with Next.js
- Efficient database queries with Drizzle

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:

- Email: support@tradearea.com
- Documentation: [Link to docs]
- GitHub Issues: [Link to issues]

## Changelog

### v1.0.0 (Initial Release)

- Complete authentication system
- Interactive dashboard with 10+ charts
- GeoJSON mapping support
- Global filtering system
- Sample data for 3 cities
- Email-based password reset
