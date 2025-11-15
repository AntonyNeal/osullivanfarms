-- SheepSheet Database Schema
-- Created: 2025-11-16
-- Purpose: Farm management system for O'Sullivan Farms sheep operations

-- ============================================================================
-- 1. MOBS TABLE
-- Core table for managing sheep mobs
-- ============================================================================
CREATE TABLE IF NOT EXISTS mobs (
  mob_id SERIAL PRIMARY KEY,
  mob_name VARCHAR(255),
  
  -- Classification
  breed_name VARCHAR(100) NOT NULL,  -- Merinos, Dohnes, etc.
  status_name VARCHAR(50) NOT NULL,  -- ewe, maidens, wethers, rams
  zone_name VARCHAR(100) NOT NULL,   -- Deni, Elmore, Goolgowi
  team_name VARCHAR(100) NOT NULL,   -- Self Replacing, Terminal
  
  -- Current Status
  current_stage VARCHAR(50) NOT NULL DEFAULT 'Pre-Joining',  -- Joining, Scanning, Lambing, Marking, Weaning
  current_location VARCHAR(255),
  
  -- Lifecycle Dates
  joining_date DATE,
  scanning_date DATE,
  lambing_date DATE,
  marking_date DATE,
  weaning_date DATE,
  
  -- Joining Data
  ewes_joined INT,
  rams_in INT,
  ram_to_ewe_ratio DECIMAL(5,2),
  
  -- Scanning Data
  scanned_date DATE,
  in_lamb INT,
  dry INT,
  twins INT,
  singles INT,
  triplets INT DEFAULT 0,
  scanning_percent DECIMAL(5,2),  -- Calculated: ((twins*2 + triplets*3 + singles) / in_lamb) * 100
  
  -- Lambing Data
  lambs_born INT,
  lambs_died INT,
  lambs_alive INT,
  lambing_percent DECIMAL(5,2),
  
  -- Marking Data
  lambs_marked INT,
  marking_percent DECIMAL(5,2),  -- (lambs_marked / ewes_joined) * 100
  
  -- Weaning Data
  lambs_weaned INT,
  weaning_percent DECIMAL(5,2),  -- (lambs_weaned / ewes_joined) * 100
  average_weaning_weight DECIMAL(6,2),  -- kg
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  
  -- Constraints
  CONSTRAINT valid_stage CHECK (current_stage IN ('Pre-Joining', 'Joining', 'Scanning', 'Lambing', 'Marking', 'Weaning', 'Complete')),
  CONSTRAINT valid_status CHECK (status_name IN ('ewe', 'maidens', 'wethers', 'rams', 'mixed')),
  CONSTRAINT positive_ewes CHECK (ewes_joined IS NULL OR ewes_joined > 0),
  CONSTRAINT positive_rams CHECK (rams_in IS NULL OR rams_in > 0)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mobs_active ON mobs(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_mobs_stage ON mobs(current_stage);
CREATE INDEX IF NOT EXISTS idx_mobs_zone ON mobs(zone_name);
CREATE INDEX IF NOT EXISTS idx_mobs_breed ON mobs(breed_name);
CREATE INDEX IF NOT EXISTS idx_mobs_updated ON mobs(last_updated DESC);

-- ============================================================================
-- 2. MOB HISTORY TABLE
-- Track changes to mob data over time
-- ============================================================================
CREATE TABLE IF NOT EXISTS mob_history (
  history_id SERIAL PRIMARY KEY,
  mob_id INT NOT NULL,
  change_type VARCHAR(50) NOT NULL,  -- stage_change, data_update, note_added
  field_changed VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(255),  -- User ID or system
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_mob FOREIGN KEY (mob_id) REFERENCES mobs(mob_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mob_history_mob ON mob_history(mob_id);
CREATE INDEX IF NOT EXISTS idx_mob_history_date ON mob_history(changed_at DESC);

-- ============================================================================
-- 3. PADDOCKS TABLE
-- Track paddock information and mob locations
-- ============================================================================
CREATE TABLE IF NOT EXISTS paddocks (
  paddock_id SERIAL PRIMARY KEY,
  paddock_name VARCHAR(255) NOT NULL,
  zone_name VARCHAR(100) NOT NULL,
  size_hectares DECIMAL(10,2),
  carrying_capacity INT,  -- Estimated number of sheep
  current_mob_id INT,
  
  -- GPS Coordinates (for mapping)
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Status
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  
  CONSTRAINT fk_current_mob FOREIGN KEY (current_mob_id) REFERENCES mobs(mob_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_paddocks_zone ON paddocks(zone_name);
CREATE INDEX IF NOT EXISTS idx_paddocks_available ON paddocks(is_available) WHERE is_available = TRUE;

-- ============================================================================
-- 4. BREEDING EVENTS TABLE
-- Track specific breeding-related events
-- ============================================================================
CREATE TABLE IF NOT EXISTS breeding_events (
  event_id SERIAL PRIMARY KEY,
  mob_id INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,  -- joining_start, joining_end, scan, lamb_birth, marking, weaning
  event_date DATE NOT NULL,
  event_time TIME,
  
  -- Event-specific data (JSON for flexibility)
  event_data JSONB,
  
  -- Examples:
  -- Joining: {"rams_in": 10, "ewes_joined": 500}
  -- Scanning: {"in_lamb": 450, "dry": 50, "twins": 200, "singles": 250}
  -- Lambing: {"lambs_born": 5, "ewes_lambed": 3}
  
  recorded_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  
  CONSTRAINT fk_mob_event FOREIGN KEY (mob_id) REFERENCES mobs(mob_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_breeding_events_mob ON breeding_events(mob_id);
CREATE INDEX IF NOT EXISTS idx_breeding_events_date ON breeding_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_breeding_events_type ON breeding_events(event_type);

-- ============================================================================
-- 5. FARM SETTINGS TABLE
-- Store farm-wide configuration and preferences
-- ============================================================================
CREATE TABLE IF NOT EXISTS farm_settings (
  setting_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string',  -- string, number, boolean, json
  description TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255)
);

-- Insert default settings
INSERT INTO farm_settings (setting_key, setting_value, setting_type, description) VALUES
  ('farm_name', 'O''Sullivan Farms', 'string', 'Farm name'),
  ('default_ram_ratio', '50', 'number', 'Default ewes per ram'),
  ('target_scanning_percent', '150', 'number', 'Target scanning percentage'),
  ('target_marking_percent', '130', 'number', 'Target marking percentage'),
  ('target_weaning_percent', '125', 'number', 'Target weaning percentage')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- 6. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current mob summary with calculated KPIs
CREATE OR REPLACE VIEW mob_kpi_summary AS
SELECT 
  m.mob_id,
  m.mob_name,
  m.breed_name,
  m.status_name,
  m.zone_name,
  m.team_name,
  m.current_stage,
  m.current_location,
  m.ewes_joined,
  m.rams_in,
  m.joining_date,
  m.scanning_date,
  m.in_lamb,
  m.dry,
  m.twins,
  m.singles,
  m.scanning_percent,
  m.lambing_percent,
  m.marking_percent,
  m.weaning_percent,
  m.is_active,
  m.last_updated,
  
  -- Calculated fields
  CASE 
    WHEN m.rams_in > 0 AND m.ewes_joined > 0 
    THEN ROUND(m.ewes_joined::DECIMAL / m.rams_in, 2)
    ELSE NULL 
  END as actual_ram_ratio,
  
  CASE 
    WHEN m.scanning_percent >= 150 THEN 'Excellent'
    WHEN m.scanning_percent >= 130 THEN 'Good'
    WHEN m.scanning_percent >= 100 THEN 'Average'
    WHEN m.scanning_percent IS NOT NULL THEN 'Below Target'
    ELSE 'Not Scanned'
  END as scanning_performance
  
FROM mobs m
WHERE m.is_active = TRUE;

-- Farm-wide statistics
CREATE OR REPLACE VIEW farm_statistics AS
SELECT 
  COUNT(*) as total_mobs,
  SUM(ewes_joined) as total_ewes,
  AVG(scanning_percent) as avg_scanning_percent,
  AVG(marking_percent) as avg_marking_percent,
  AVG(weaning_percent) as avg_weaning_percent,
  SUM(CASE WHEN current_stage = 'Joining' THEN 1 ELSE 0 END) as mobs_joining,
  SUM(CASE WHEN current_stage = 'Scanning' THEN 1 ELSE 0 END) as mobs_scanning,
  SUM(CASE WHEN current_stage = 'Lambing' THEN 1 ELSE 0 END) as mobs_lambing,
  SUM(CASE WHEN current_stage = 'Marking' THEN 1 ELSE 0 END) as mobs_marking,
  SUM(CASE WHEN current_stage = 'Weaning' THEN 1 ELSE 0 END) as mobs_weaning
FROM mobs
WHERE is_active = TRUE;

-- ============================================================================
-- 7. FUNCTIONS
-- ============================================================================

-- Function to calculate scanning percentage
CREATE OR REPLACE FUNCTION calculate_scanning_percent(
  p_twins INT,
  p_singles INT,
  p_triplets INT,
  p_in_lamb INT
) RETURNS DECIMAL(5,2) AS $$
BEGIN
  IF p_in_lamb IS NULL OR p_in_lamb = 0 THEN
    RETURN NULL;
  END IF;
  
  RETURN ROUND(
    ((COALESCE(p_twins, 0) * 2 + COALESCE(p_triplets, 0) * 3 + COALESCE(p_singles, 0))::DECIMAL / p_in_lamb) * 100,
    2
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to automatically update scanning_percent when related fields change
CREATE OR REPLACE FUNCTION update_scanning_percent()
RETURNS TRIGGER AS $$
BEGIN
  NEW.scanning_percent := calculate_scanning_percent(
    NEW.twins,
    NEW.singles,
    NEW.triplets,
    NEW.in_lamb
  );
  
  NEW.last_updated := CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_scanning_percent
BEFORE INSERT OR UPDATE OF twins, singles, triplets, in_lamb ON mobs
FOR EACH ROW
EXECUTE FUNCTION update_scanning_percent();

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mobs_last_updated
BEFORE UPDATE ON mobs
FOR EACH ROW
EXECUTE FUNCTION update_last_updated();

-- ============================================================================
-- 8. SAMPLE DATA (for development/testing)
-- ============================================================================

-- Insert sample mobs
INSERT INTO mobs (
  mob_name, breed_name, status_name, zone_name, team_name,
  current_stage, current_location, ewes_joined, rams_in,
  joining_date, scanning_date, in_lamb, dry, twins, singles
) VALUES
  ('Mob 1 - Merino Ewes', 'Merinos', 'ewe', 'Deni', 'Self Replacing',
   'Scanning', 'home paddock', 545, 11,
   '2024-11-01', '2025-02-06', 465, 25, 200, 265),
  
  ('Mob 2 - Dohne Maidens', 'Dohnes', 'maidens', 'Elmore', 'Terminal',
   'Joining', 'north paddock', 320, 8,
   '2024-11-15', NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Insert sample paddocks
INSERT INTO paddocks (paddock_name, zone_name, size_hectares, carrying_capacity) VALUES
  ('Home Paddock', 'Deni', 50.5, 600),
  ('North Paddock', 'Elmore', 45.0, 500),
  ('South Paddock', 'Deni', 60.0, 700)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE mobs IS 'Core table for managing sheep mobs and their breeding lifecycle';
COMMENT ON TABLE mob_history IS 'Audit trail for changes to mob data';
COMMENT ON TABLE paddocks IS 'Paddock management and mob location tracking';
COMMENT ON TABLE breeding_events IS 'Detailed event tracking for breeding operations';
COMMENT ON TABLE farm_settings IS 'Farm-wide configuration and preferences';

COMMENT ON COLUMN mobs.scanning_percent IS 'Automatically calculated: ((twins*2 + triplets*3 + singles) / in_lamb) * 100';
COMMENT ON COLUMN mobs.marking_percent IS '(lambs_marked / ewes_joined) * 100';
COMMENT ON COLUMN mobs.weaning_percent IS '(lambs_weaned / ewes_joined) * 100';
