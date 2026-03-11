import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'your-anon-key'
);

app.use(cors());
app.use(express.json());

// Custom JSON parser to handle BigInt
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Convert string representations of bigints back to numbers
    const convertBigInts = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && /^\d{13,}$/.test(obj[key])) {
          // If it's a very large number string (timestamp), convert to number
          obj[key] = Number(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertBigInts(obj[key]);
        }
      }
    };
    convertBigInts(req.body);
  }
  next();
});

// Initialize default admin
async function initializeAdmin() {
  try {
    const { data, error } = await supabase
      .from('hospital_doctors')
      .select('username')
      .eq('username', 'admin')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking for admin:', error);
      throw error;
    }

    if (!data) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const { error: insertError } = await supabase.from('hospital_doctors').insert({
        username: 'admin',
        password_hash: hashedPassword,
        is_admin: true
      });
      
      if (insertError) {
        console.error('Error creating admin:', insertError);
        throw insertError;
      }
      
      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Failed to initialize admin:', error);
    throw error;
  }
}

// Hospital login
app.post('/api/hospital-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);
    
    const { data: doctor, error } = await supabase
      .from('hospital_doctors')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Database error during login:', error);
      return res.json({ __kind__: 'err', err: 'Invalid username or password' });
    }

    if (!doctor) {
      console.log('No doctor found with username:', username);
      return res.json({ __kind__: 'err', err: 'Invalid username or password' });
    }

    console.log('Doctor found, checking password...');
    const isValid = await bcrypt.compare(password, doctor.password_hash);
    
    if (!isValid) {
      console.log('Password invalid for username:', username);
      return res.json({ __kind__: 'err', err: 'Invalid username or password' });
    }

    console.log('Login successful for:', username);
    res.json({
      __kind__: 'ok',
      ok: { role: 'hospital', doctorName: username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ __kind__: 'err', err: error.message });
  }
});

// Patient login
app.post('/api/patient-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const { data: patient, error } = await supabase
      .from('patient_credentials')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !patient) {
      return res.json({ __kind__: 'err', err: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, patient.password_hash);
    if (!isValid) {
      return res.json({ __kind__: 'err', err: 'Invalid username or password' });
    }

    res.json({
      __kind__: 'ok',
      ok: { role: 'patient', recordId: Number(patient.record_id) }
    });
  } catch (error) {
    res.status(500).json({ __kind__: 'err', err: error.message });
  }
});

// Create patient record
app.post('/api/patient-records', async (req, res) => {
  try {
    const { patientRecord, patientUsername, patientPassword } = req.body;
    
    console.log('Creating patient record:', patientRecord);
    
    // Handle recordDate - it comes as nanoseconds, convert to milliseconds then to Date
    let recordDate;
    if (typeof patientRecord.recordDate === 'number') {
      // If it's in nanoseconds (very large number), convert to milliseconds
      if (patientRecord.recordDate > 1e15) {
        recordDate = new Date(patientRecord.recordDate / 1_000_000);
      } else {
        recordDate = new Date(patientRecord.recordDate);
      }
    } else {
      recordDate = new Date();
    }
    
    const { data: record, error: recordError } = await supabase
      .from('patient_records')
      .insert({
        patient_name: patientRecord.patientName,
        date_of_birth: patientRecord.dateOfBirth,
        gender: patientRecord.gender,
        blood_type: patientRecord.bloodType,
        diagnosis: patientRecord.diagnosis,
        treatment: patientRecord.treatment,
        medications: patientRecord.medications,
        allergies: patientRecord.allergies,
        notes: patientRecord.notes,
        doctor_name: patientRecord.doctorName,
        record_date: recordDate
      })
      .select()
      .single();

    if (recordError) {
      console.error('Error creating record:', recordError);
      throw recordError;
    }

    console.log('Record created with ID:', record.id);

    const hashedPassword = await bcrypt.hash(patientPassword, 10);
    const { error: credError } = await supabase.from('patient_credentials').insert({
      username: patientUsername,
      password_hash: hashedPassword,
      record_id: record.id
    });

    if (credError) {
      console.error('Error creating credentials:', credError);
      throw credError;
    }

    console.log('Patient credentials created');
    // Supabase may return a BigInt for the serial id; convert before sending JSON
    res.json(Number(record.id));
  } catch (error) {
    console.error('Create patient record error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all patient records
app.get('/api/patient-records', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patient_records')
      .select('*')
      .order('id');

    if (error) throw error;

    const records = data.map(r => ({
      // make sure id is a JSON-safe number/string
      recordId: Number(r.id),
      record: {
        patientName: r.patient_name,
        dateOfBirth: r.date_of_birth,
        gender: r.gender,
        bloodType: r.blood_type,
        diagnosis: r.diagnosis,
        treatment: r.treatment,
        medications: r.medications,
        allergies: r.allergies,
        notes: r.notes,
        doctorName: r.doctor_name,
        recordDate: new Date(r.record_date).getTime()
      }
    }));

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single patient record
app.get('/api/patient-records/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patient_records')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.json(null);
    }

    res.json({
      patientName: data.patient_name,
      dateOfBirth: data.date_of_birth,
      gender: data.gender,
      bloodType: data.blood_type,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      medications: data.medications,
      allergies: data.allergies,
      notes: data.notes,
      doctorName: data.doctor_name,
      recordDate: new Date(data.record_date).getTime()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient record
app.put('/api/patient-records/:id', async (req, res) => {
  try {
    const { updatedRecord } = req.body;
    
    const { error } = await supabase
      .from('patient_records')
      .update({
        patient_name: updatedRecord.patientName,
        date_of_birth: updatedRecord.dateOfBirth,
        gender: updatedRecord.gender,
        blood_type: updatedRecord.bloodType,
        diagnosis: updatedRecord.diagnosis,
        treatment: updatedRecord.treatment,
        medications: updatedRecord.medications,
        allergies: updatedRecord.allergies,
        notes: updatedRecord.notes,
        doctor_name: updatedRecord.doctorName,
        record_date: new Date(Number(updatedRecord.recordDate))
      })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient record
app.delete('/api/patient-records/:id', async (req, res) => {
  try {
    await supabase.from('patient_credentials').delete().eq('record_id', req.params.id);
    const { error } = await supabase.from('patient_records').delete().eq('id', req.params.id);
    
    if (error) throw error;
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change patient credentials
app.put('/api/patient-credentials/:id', async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { error } = await supabase
      .from('patient_credentials')
      .update({
        username: newUsername,
        password_hash: hashedPassword
      })
      .eq('record_id', req.params.id);

    if (error) throw error;
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const { data: existing } = await supabase
      .from('hospital_doctors')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('hospital_doctors').insert({
      username,
      password_hash: hashedPassword,
      is_admin: false
    });

    if (error) throw error;
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`Server running on port ${PORT}`);
});
