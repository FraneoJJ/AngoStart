CREATE DATABASE IF NOT EXISTS angostartbd;
USE angostartbd;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url LONGTEXT NULL,
  role ENUM('admin', 'empreendedor', 'mentor', 'investidor') NOT NULL DEFAULT 'empreendedor',
  admin_category ENUM('primary', 'secondary') NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  plan_code ENUM('free', 'pro', 'premium') NOT NULL DEFAULT 'free',
  billing_cycle ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  status ENUM('active', 'trialing', 'cancelled') NOT NULL DEFAULT 'active',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_password_reset_token_hash (token_hash),
  INDEX idx_password_reset_user (user_id),
  INDEX idx_password_reset_expires (expires_at),
  CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ideas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  sector VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  address VARCHAR(255) NULL,
  region VARCHAR(120) NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  initial_capital DECIMAL(14, 2) NOT NULL DEFAULT 0,
  problem TEXT NULL,
  differential_text TEXT NULL,
  target_audience TEXT NULL,
  status ENUM('draft', 'submitted', 'analyzing', 'active', 'archived') NOT NULL DEFAULT 'submitted',
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ideas_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS idea_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  idea_id BIGINT UNSIGNED NOT NULL,
  status ENUM('inicial', 'validacao', 'crescimento', 'escala') NOT NULL DEFAULT 'inicial',
  progress_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  goals_completed TEXT NULL,
  next_steps TEXT NULL,
  revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
  expenses DECIMAL(14, 2) NOT NULL DEFAULT 0,
  investment DECIMAL(14, 2) NOT NULL DEFAULT 0,
  total_clients INT NOT NULL DEFAULT 0,
  new_clients INT NOT NULL DEFAULT 0,
  lost_clients INT NOT NULL DEFAULT 0,
  customer_feedback TEXT NULL,
  marketing_campaigns TEXT NULL,
  marketing_channels TEXT NULL,
  marketing_results TEXT NULL,
  weekly_summary TEXT NULL,
  challenges TEXT NULL,
  learnings TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_idea_progress_user (user_id),
  INDEX idx_idea_progress_idea (idea_id),
  INDEX idx_idea_progress_created_at (created_at),
  CONSTRAINT fk_idea_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_idea_progress_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questionnaire_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  idea_id BIGINT UNSIGNED NULL,
  context_json JSON NOT NULL,
  questions_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_qs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_qs_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS questionnaire_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT UNSIGNED NOT NULL,
  question_key VARCHAR(120) NOT NULL,
  answer_text TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_session_question (session_id, question_key),
  CONSTRAINT fk_qa_session FOREIGN KEY (session_id) REFERENCES questionnaire_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS viability_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idea_id BIGINT UNSIGNED NULL,
  session_id BIGINT UNSIGNED NULL,
  viability_status ENUM('viavel', 'inviavel') NOT NULL,
  score INT NOT NULL,
  strengths_json JSON NOT NULL,
  weaknesses_json JSON NOT NULL,
  adjustments_json JSON NOT NULL,
  summary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vr_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL,
  CONSTRAINT fk_vr_session FOREIGN KEY (session_id) REFERENCES questionnaire_sessions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS legal_checklist_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  idea_id BIGINT UNSIGNED NULL,
  step_key VARCHAR(120) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_legal_progress (user_id, idea_id, step_key),
  CONSTRAINT fk_lcp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_lcp_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS legal_company_guides (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  idea_id BIGINT UNSIGNED NULL,
  business_sector VARCHAR(120) NULL,
  partner_count INT NOT NULL DEFAULT 1,
  estimated_monthly_revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
  has_foreign_partner TINYINT(1) NOT NULL DEFAULT 0,
  recommended_type ENUM('ENI', 'LDA', 'SA') NOT NULL,
  estimated_opening_days INT NOT NULL,
  estimated_cost_aoa DECIMAL(14, 2) NOT NULL,
  notes TEXT NULL,
  result_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lcg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_lcg_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS strategic_checklist_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  idea_id BIGINT UNSIGNED NULL,
  step_key VARCHAR(120) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_strategic_progress (user_id, idea_id, step_key),
  CONSTRAINT fk_scp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_scp_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS empreendedor_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  has_business TINYINT(1) NOT NULL DEFAULT 0,
  business_name VARCHAR(180) NULL,
  business_sector VARCHAR(120) NULL,
  business_stage VARCHAR(120) NULL,
  business_location VARCHAR(120) NULL,
  accept_terms TINYINT(1) NOT NULL DEFAULT 0,
  verification_id VARCHAR(40) NOT NULL,
  verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ep_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  identity_number VARCHAR(30) NOT NULL,
  birth_date DATE NOT NULL,
  province VARCHAR(120) NOT NULL,
  expertise_area VARCHAR(120) NOT NULL,
  experience_years INT NOT NULL,
  company VARCHAR(180) NOT NULL,
  current_role VARCHAR(180) NOT NULL,
  linkedin VARCHAR(255) NULL,
  bi_front_doc VARCHAR(255) NOT NULL,
  cv_doc VARCHAR(255) NULL,
  certificate_doc VARCHAR(255) NULL,
  declare_truth TINYINT(1) NOT NULL DEFAULT 0,
  accept_terms TINYINT(1) NOT NULL DEFAULT 0,
  verification_id VARCHAR(40) NOT NULL,
  verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_mp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investidor_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  identity_number VARCHAR(30) NOT NULL,
  province VARCHAR(120) NOT NULL,
  investor_type ENUM('individual', 'empresa') NOT NULL,
  profession VARCHAR(180) NULL,
  income_source VARCHAR(180) NULL,
  investment_range VARCHAR(120) NULL,
  company_name VARCHAR(180) NULL,
  company_nif VARCHAR(40) NULL,
  company_role VARCHAR(180) NULL,
  has_investment_experience ENUM('sim', 'nao') NULL,
  investment_experience_area VARCHAR(180) NULL,
  linkedin_or_website VARCHAR(255) NULL,
  bi_front_doc VARCHAR(255) NOT NULL,
  company_certificate_doc VARCHAR(255) NULL,
  declare_truth TINYINT(1) NOT NULL DEFAULT 0,
  accept_terms TINYINT(1) NOT NULL DEFAULT 0,
  verification_id VARCHAR(40) NOT NULL,
  verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ip_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mentorship_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  entrepreneur_user_id BIGINT UNSIGNED NOT NULL,
  mentor_user_id BIGINT UNSIGNED NOT NULL,
  idea_id BIGINT UNSIGNED NULL,
  topic VARCHAR(180) NOT NULL,
  session_type ENUM('online', 'presencial') NOT NULL DEFAULT 'online',
  preferred_datetime DATETIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  payment_method ENUM('multicaixa', 'transferencia', 'unitel-money', 'afrimoney') NOT NULL,
  price_kz DECIMAL(14,2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'accepted', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
  entrepreneur_notes TEXT NULL,
  mentor_notes TEXT NULL,
  mentor_response_at DATETIME NULL,
  scheduled_for DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mr_entrepreneur (entrepreneur_user_id),
  INDEX idx_mr_mentor (mentor_user_id),
  INDEX idx_mr_status (status),
  INDEX idx_mr_datetime (preferred_datetime),
  CONSTRAINT fk_mr_entrepreneur FOREIGN KEY (entrepreneur_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_mentor FOREIGN KEY (mentor_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_mr_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mensagens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sender_id BIGINT UNSIGNED NOT NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lida TINYINT(1) NOT NULL DEFAULT 0,
  INDEX idx_msg_sender (sender_id),
  INDEX idx_msg_receiver (receiver_id),
  INDEX idx_msg_time (timestamp),
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS call_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  channel_name VARCHAR(200) NOT NULL UNIQUE,
  caller_id BIGINT UNSIGNED NOT NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  call_type ENUM('video', 'voice') NOT NULL DEFAULT 'video',
  status ENUM('invited', 'accepted', 'rejected', 'ended', 'missed') NOT NULL DEFAULT 'invited',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME NULL,
  ended_at DATETIME NULL,
  ended_by_user_id BIGINT UNSIGNED NULL,
  INDEX idx_call_channel (channel_name),
  INDEX idx_call_caller (caller_id),
  INDEX idx_call_receiver (receiver_id),
  INDEX idx_call_status (status),
  CONSTRAINT fk_call_caller FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_call_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_call_ended_by FOREIGN KEY (ended_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);
