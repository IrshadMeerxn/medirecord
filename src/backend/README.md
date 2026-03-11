# MediRecord Backend

Simple Express.js REST API with Supabase PostgreSQL database.

## Features
- Patient record management (CRUD)
- Hospital staff authentication
- Patient authentication
- Password hashing with bcrypt
- CORS enabled for frontend

## API Endpoints

### Authentication
- `POST /api/hospital-login` - Hospital staff login
- `POST /api/patient-login` - Patient login

### Patient Records
- `GET /api/patient-records` - Get all records
- `GET /api/patient-records/:id` - Get single record
- `POST /api/patient-records` - Create new record
- `PUT /api/patient-records/:id` - Update record
- `DELETE /api/patient-records/:id` - Delete record

### Patient Credentials
- `PUT /api/patient-credentials/:id` - Update patient username/password

### Hospital Staff
- `POST /api/doctors` - Add new doctor/staff

## Environment Variables
```
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3001
```

## Development
```bash
npm install
npm run dev  # Auto-reload on changes
```

## Production
```bash
npm start
```

## Database Schema
See `schema.sql` for complete database structure.

Tables:
- `hospital_doctors` - Hospital staff accounts
- `patient_records` - Patient medical records
- `patient_credentials` - Patient login credentials
