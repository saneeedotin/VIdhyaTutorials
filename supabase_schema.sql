-- Vidhya Tutorials Supabase Schema

-- 1. Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');
CREATE TYPE fee_status AS ENUM ('PAID', 'PARTIALLY_PAID', 'PENDING');
CREATE TYPE material_type AS ENUM ('DOCUMENT', 'VIDEO');
CREATE TYPE material_status AS ENUM ('PUBLISHED', 'FLAGGED');
CREATE TYPE announcement_type AS ENUM ('NEWS', 'EVENT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE consent_status AS ENUM ('GRANTED', 'REVOKED');

-- 2. Core Authentication & Profiles

-- Public Users table (Syncs with auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Standards
CREATE TABLE standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view standards" ON standards FOR SELECT USING (true);
CREATE POLICY "Admins can manage standards" ON standards FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Student Profile
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  standard_id UUID REFERENCES standards(id),
  roll_number INTEGER,
  enrollment_date DATE DEFAULT CURRENT_DATE
);
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own profile" ON student_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins and teachers view all student profiles" ON student_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER'))
);
CREATE POLICY "Admins manage student profiles" ON student_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Teacher Profile
CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE
);
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teacher profiles" ON teacher_profiles FOR SELECT USING (true);
CREATE POLICY "Admins manage teacher profiles" ON teacher_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 3. Academics & Curriculum

-- Subjects / Batches
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  standard_id UUID REFERENCES standards(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL
);
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Admins manage subjects" ON subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Student_Subject (Enrollments)
CREATE TABLE student_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(student_id, subject_id)
);
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own enrollments" ON student_subjects FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Teachers and Admins view all enrollments" ON student_subjects FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER'))
);
CREATE POLICY "Admins manage enrollments" ON student_subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 4. Operations & Tracking

-- Attendance Record
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  recorded_by UUID REFERENCES users(id),
  UNIQUE(student_id, subject_id, date)
);
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own attendance" ON attendance_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Teachers and Admins view all attendance" ON attendance_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER'))
);
CREATE POLICY "Teachers and Admins manage attendance" ON attendance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER'))
);

-- Teacher Proxy
CREATE TABLE teacher_proxies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grantor_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  proxy_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);
ALTER TABLE teacher_proxies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers and Admins view proxies" ON teacher_proxies FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER'))
);
CREATE POLICY "Admins manage proxies" ON teacher_proxies FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 5. Financial & Assets

-- Fees Ledger
CREATE TABLE fees_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  status fee_status DEFAULT 'PENDING',
  amount_due DECIMAL NOT NULL,
  amount_paid DECIMAL DEFAULT 0,
  due_date DATE,
  receipt_url TEXT,
  updated_by UUID REFERENCES users(id)
);
ALTER TABLE fees_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own fees" ON fees_ledger FOR SELECT USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Admins manage fees" ON fees_ledger FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type material_type NOT NULL,
  url TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  status material_status DEFAULT 'FLAGGED',
  country_of_origin TEXT NOT NULL, -- Mandatory for E-Commerce Rules 2026
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view published materials for their subjects" ON materials FOR SELECT USING (
  status = 'PUBLISHED' AND EXISTS (
    SELECT 1 FROM student_subjects ss 
    JOIN student_profiles sp ON ss.student_id = sp.id 
    WHERE ss.subject_id = materials.subject_id AND sp.user_id = auth.uid()
  )
);
CREATE POLICY "Teachers view their own materials" ON materials FOR SELECT USING (
  EXISTS (SELECT 1 FROM teacher_profiles WHERE id = teacher_id AND user_id = auth.uid())
);
CREATE POLICY "Admins view all materials" ON materials FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Teachers manage their own materials" ON materials FOR ALL USING (
  EXISTS (SELECT 1 FROM teacher_profiles WHERE id = teacher_id AND user_id = auth.uid())
);
CREATE POLICY "Admins manage all materials" ON materials FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 6. Communications & Support

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type announcement_type NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  img_url TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  severity severity_level NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admins and System create audit logs" ON audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN') OR auth.uid() IS NULL
);

-- CERT-In Compliance: WORM Storage (Prevent Updates/Deletes)
REVOKE UPDATE, DELETE ON audit_logs FROM public, authenticated, anon;
-- (Note: deletion will be handled strictly by pg_cron below)

-- DPDP Act: Consent Ledger
CREATE TABLE consent_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  notice_version TEXT NOT NULL,
  status consent_status DEFAULT 'GRANTED',
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);
ALTER TABLE consent_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own consent" ON consent_ledger FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own consent" ON consent_ledger FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own consent" ON consent_ledger FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins view all consent" ON consent_ledger FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Algorithmic Guardrails (E-Commerce Rules: Flash Sales Ban)
-- Example placeholder table if selling courses with limited inventory
CREATE TABLE courses_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL,
  stock_limit INTEGER,
  -- Hardcoded guardrail: Inventory cannot be artificially limited below 10 for general sales to prevent "flash sale" panic
  CONSTRAINT prevent_flash_sales CHECK (stock_limit IS NULL OR stock_limit >= 10)
);

-- DPDP & CERT-In: Automated Data Lifecycle (pg_cron)
-- Requires Supabase pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Retain logs for exactly 180 days (CERT-In)
SELECT cron.schedule(
  'cert_in_log_retention',
  '0 0 * * *',
  $$ DELETE FROM audit_logs WHERE timestamp < NOW() - INTERVAL '180 days'; $$
);

-- 2. Anonymize/Delete data where consent is revoked (DPDP Act)
SELECT cron.schedule(
  'dpdp_consent_anonymization',
  '0 2 * * *',
  $$
    UPDATE users SET name = 'Anonymized User', email = 'anon_' || id || '@deleted.com', active = false 
    WHERE id IN (
      SELECT user_id FROM consent_ledger WHERE status = 'REVOKED' AND revoked_at < NOW() - INTERVAL '30 days'
    );
  $$
);

-- Support Tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'OPEN',
  priority severity_level DEFAULT 'LOW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tickets" ON support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins view all tickets" ON support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Users create own tickets" ON support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage tickets" ON support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 7. Sync Trigger for auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'STUDENT'::user_role)
  );
  
  -- Create corresponding profile based on role
  IF (new.raw_user_meta_data->>'role') = 'STUDENT' THEN
    INSERT INTO public.student_profiles (user_id) VALUES (new.id);
  ELSIF (new.raw_user_meta_data->>'role') = 'TEACHER' THEN
    INSERT INTO public.teacher_profiles (user_id) VALUES (new.id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Storage Buckets
-- Note: Requires executing in Supabase SQL editor
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true) ON CONFLICT DO NOTHING;
