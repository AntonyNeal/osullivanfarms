-- =====================================================
-- SheepSheet Database Schema - Azure SQL Database
-- Farm Management CRUD Application
-- Version: 1.0 (MVP)
-- =====================================================

-- =====================================================
-- 1. REFERENCE/LOOKUP TABLES
-- =====================================================

-- Breeds lookup
CREATE TABLE Breeds (
    breed_id INT PRIMARY KEY IDENTITY(1,1),
    breed_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Insert default breeds
INSERT INTO Breeds (breed_name, description) VALUES
('Merinos', 'Fine wool sheep breed'),
('Dohnes', 'Dual-purpose wool and meat breed');

-- Zones lookup
CREATE TABLE Zones (
    zone_id INT PRIMARY KEY IDENTITY(1,1),
    zone_name NVARCHAR(50) NOT NULL UNIQUE,
    region NVARCHAR(100),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Insert default zones
INSERT INTO Zones (zone_name, region) VALUES
('Deni', 'Deniliquin area'),
('Elmore', 'Elmore area'),
('Goolgowi', 'Goolgowi area');

-- Teams lookup
CREATE TABLE Teams (
    team_id INT PRIMARY KEY IDENTITY(1,1),
    team_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Insert default teams
INSERT INTO Teams (team_name, description) VALUES
('Self Replacing', 'Breeding flock for replacements'),
('Terminal', 'Meat production flock');

-- Status types lookup
CREATE TABLE StatusTypes (
    status_id INT PRIMARY KEY IDENTITY(1,1),
    status_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Insert default status types
INSERT INTO StatusTypes (status_name, description) VALUES
('ewe', 'Adult female sheep that has lambed'),
('maidens', 'Young female sheep, not yet lambed'),
('ewe lamb', 'Female lamb, potential breeding stock');

-- Breeding stages lookup
CREATE TABLE BreedingStages (
    stage_id INT PRIMARY KEY IDENTITY(1,1),
    stage_name NVARCHAR(50) NOT NULL UNIQUE,
    stage_order INT NOT NULL,
    description NVARCHAR(255),
    typical_start_month INT, -- 1-12 for month of year
    typical_end_month INT,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Insert breeding stages
INSERT INTO BreedingStages (stage_name, stage_order, description, typical_start_month, typical_end_month) VALUES
('Joining', 1, 'Rams introduced to ewes for mating', 11, 12),
('Scanning', 2, 'Ultrasound pregnancy checks', 2, 3),
('Lambing', 3, 'Ewes giving birth', 3, 5),
('Marking', 4, 'Processing lambs (tagging, castrating, docking)', 6, 7),
('Weaning', 5, 'Separating lambs from mothers', 8, 9);

-- =====================================================
-- 2. CORE ENTITY TABLES
-- =====================================================

-- Main mob tracking table
CREATE TABLE Mobs (
    mob_id INT PRIMARY KEY IDENTITY(1,1),
    mob_name NVARCHAR(100),
    breed_id INT NOT NULL,
    status_id INT NOT NULL,
    zone_id INT NOT NULL,
    team_id INT NOT NULL,
    current_stage_id INT NOT NULL,
    current_location NVARCHAR(255),
    
    -- Tracking fields
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    -- Soft delete
    deleted_at DATETIME2 NULL,
    
    -- Foreign keys
    CONSTRAINT FK_Mobs_Breed FOREIGN KEY (breed_id) REFERENCES Breeds(breed_id),
    CONSTRAINT FK_Mobs_Status FOREIGN KEY (status_id) REFERENCES StatusTypes(status_id),
    CONSTRAINT FK_Mobs_Zone FOREIGN KEY (zone_id) REFERENCES Zones(zone_id),
    CONSTRAINT FK_Mobs_Team FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    CONSTRAINT FK_Mobs_Stage FOREIGN KEY (current_stage_id) REFERENCES BreedingStages(stage_id)
);

-- Index for common filtering
CREATE INDEX IX_Mobs_Filters ON Mobs(breed_id, zone_id, team_id, status_id, current_stage_id) WHERE is_active = 1;
CREATE INDEX IX_Mobs_Active ON Mobs(is_active, deleted_at);

-- =====================================================
-- 3. BREEDING CYCLE DATA TABLES
-- =====================================================

-- STAGE 1: Joining data
CREATE TABLE JoiningData (
    joining_id INT PRIMARY KEY IDENTITY(1,1),
    mob_id INT NOT NULL,
    
    -- Planned dates
    expected_start_date DATE,
    expected_end_date DATE,
    
    -- Actual dates
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Counts
    ewes_joined INT, -- Number of ewes put with rams
    rams_in INT, -- Number of rams used
    
    -- Notes
    notes NVARCHAR(MAX),
    
    -- Tracking
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    CONSTRAINT FK_Joining_Mob FOREIGN KEY (mob_id) REFERENCES Mobs(mob_id),
    CONSTRAINT UQ_Joining_Mob UNIQUE (mob_id) -- One joining record per mob
);

-- STAGE 2: Scanning data
CREATE TABLE ScanningData (
    scanning_id INT PRIMARY KEY IDENTITY(1,1),
    mob_id INT NOT NULL,
    
    -- Dates
    expected_date DATE,
    actual_date DATE,
    
    -- Counts from ultrasound
    total_ewes_scanned INT,
    in_lamb INT, -- Pregnant ewes
    dry INT, -- Not pregnant
    twins INT, -- Carrying twins
    singles INT, -- Carrying singles
    
    -- Calculated fields (stored for performance)
    scanning_percent DECIMAL(5,2), -- ((twins × 2) + singles) ÷ in_lamb × 100
    
    -- Notes
    scanner_name NVARCHAR(100),
    notes NVARCHAR(MAX),
    
    -- Tracking
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    CONSTRAINT FK_Scanning_Mob FOREIGN KEY (mob_id) REFERENCES Mobs(mob_id),
    CONSTRAINT UQ_Scanning_Mob UNIQUE (mob_id)
);

-- STAGE 3: Lambing data
CREATE TABLE LambingData (
    lambing_id INT PRIMARY KEY IDENTITY(1,1),
    mob_id INT NOT NULL,
    
    -- Dates
    expected_start_date DATE,
    expected_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Counts
    total_ewes INT,
    wet_ewes INT, -- Ewes that successfully lambed
    dry_ewes INT, -- Ewes that didn't lamb
    lambs_born_alive INT,
    lambs_born_dead INT,
    
    -- Calculated fields
    lamb_survival_percent DECIMAL(5,2), -- (wet_ewes ÷ total_ewes) × 100
    
    -- Notes
    notes NVARCHAR(MAX),
    
    -- Tracking
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    CONSTRAINT FK_Lambing_Mob FOREIGN KEY (mob_id) REFERENCES Mobs(mob_id),
    CONSTRAINT UQ_Lambing_Mob UNIQUE (mob_id)
);

-- STAGE 4: Marking data
CREATE TABLE MarkingData (
    marking_id INT PRIMARY KEY IDENTITY(1,1),
    mob_id INT NOT NULL,
    
    -- Dates
    expected_date DATE,
    actual_date DATE,
    
    -- Lamb counts by type
    wethers INT, -- Male lambs (castrated)
    ewe_lambs INT, -- Female lambs
    rams INT, -- Uncastrated males (rare, for breeding)
    
    -- Calculated totals
    lambs_marked_total INT, -- wethers + ewe_lambs + rams
    
    -- Calculated percentages (stored for performance)
    percent_marked_to_joined DECIMAL(5,2), -- lambs_marked ÷ ewes_joined
    percent_marked_to_scanned DECIMAL(5,2), -- lambs_marked ÷ in_lamb
    
    -- Notes
    notes NVARCHAR(MAX),
    
    -- Tracking
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    CONSTRAINT FK_Marking_Mob FOREIGN KEY (mob_id) REFERENCES Mobs(mob_id),
    CONSTRAINT UQ_Marking_Mob UNIQUE (mob_id)
);

-- STAGE 5: Weaning data
CREATE TABLE WeaningData (
    weaning_id INT PRIMARY KEY IDENTITY(1,1),
    mob_id INT NOT NULL,
    
    -- Dates
    expected_date DATE,
    actual_date DATE,
    
    -- Counts
    lambs_weaned INT,
    ewe_lambs_weaned INT,
    wether_lambs_weaned INT,
    
    -- Average weights (optional but useful)
    avg_weaning_weight_kg DECIMAL(5,2),
    
    -- Calculated percentages (stored for performance)
    percent_weaned_to_joined DECIMAL(5,2), -- lambs_weaned ÷ ewes_joined
    percent_weaned_to_marked DECIMAL(5,2), -- lambs_weaned ÷ lambs_marked
    
    -- Notes
    notes NVARCHAR(MAX),
    
    -- Tracking
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by NVARCHAR(100),
    updated_by NVARCHAR(100),
    
    CONSTRAINT FK_Weaning_Mob FOREIGN KEY (mob_id) REFERENCES Mobs(mob_id),
    CONSTRAINT UQ_Weaning_Mob UNIQUE (mob_id)
);

-- =====================================================
-- 4. AUDIT & SYNC TABLES
-- =====================================================

-- Audit log for all changes (critical for offline sync)
CREATE TABLE AuditLog (
    audit_id BIGINT PRIMARY KEY IDENTITY(1,1),
    table_name NVARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action_type NVARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values NVARCHAR(MAX), -- JSON
    new_values NVARCHAR(MAX), -- JSON
    changed_by NVARCHAR(100),
    changed_at DATETIME2 DEFAULT GETDATE(),
    client_timestamp DATETIME2, -- For offline operations
    sync_status NVARCHAR(20) DEFAULT 'synced', -- pending, synced, conflict
    device_id NVARCHAR(100)
);

CREATE INDEX IX_AuditLog_Sync ON AuditLog(sync_status, changed_at);
CREATE INDEX IX_AuditLog_Table ON AuditLog(table_name, record_id);

-- Offline sync queue
CREATE TABLE SyncQueue (
    sync_id BIGINT PRIMARY KEY IDENTITY(1,1),
    device_id NVARCHAR(100) NOT NULL,
    operation_type NVARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    table_name NVARCHAR(50) NOT NULL,
    record_id INT,
    payload NVARCHAR(MAX), -- JSON
    client_timestamp DATETIME2 NOT NULL,
    server_timestamp DATETIME2 DEFAULT GETDATE(),
    sync_status NVARCHAR(20) DEFAULT 'pending', -- pending, synced, conflict, failed
    conflict_details NVARCHAR(MAX),
    retry_count INT DEFAULT 0,
    last_error NVARCHAR(MAX)
);

CREATE INDEX IX_SyncQueue_Status ON SyncQueue(sync_status, client_timestamp);
CREATE INDEX IX_SyncQueue_Device ON SyncQueue(device_id, sync_status);

-- =====================================================
-- 5. COMPUTED VIEWS FOR KPIs
-- =====================================================

-- Comprehensive mob view with all KPIs
CREATE VIEW vw_MobKPIs AS
SELECT 
    m.mob_id,
    m.mob_name,
    b.breed_name,
    st.status_name,
    z.zone_name,
    t.team_name,
    bs.stage_name as current_stage,
    m.current_location,
    
    -- Joining data
    j.ewes_joined,
    j.rams_in,
    j.actual_start_date as joining_date,
    
    -- Scanning data
    s.actual_date as scanning_date,
    s.in_lamb,
    s.dry,
    s.twins,
    s.singles,
    s.scanning_percent,
    
    -- Lambing data
    l.wet_ewes,
    l.lambs_born_alive,
    l.lamb_survival_percent,
    
    -- Marking data
    mk.actual_date as marking_date,
    mk.wethers,
    mk.ewe_lambs,
    mk.lambs_marked_total,
    mk.percent_marked_to_joined,
    mk.percent_marked_to_scanned,
    
    -- Weaning data
    w.actual_date as weaning_date,
    w.lambs_weaned,
    w.percent_weaned_to_joined,
    w.percent_weaned_to_marked,
    w.avg_weaning_weight_kg,
    
    -- Metadata
    m.is_active,
    m.updated_at as last_updated
    
FROM Mobs m
    LEFT JOIN Breeds b ON m.breed_id = b.breed_id
    LEFT JOIN StatusTypes st ON m.status_id = st.status_id
    LEFT JOIN Zones z ON m.zone_id = z.zone_id
    LEFT JOIN Teams t ON m.team_id = t.team_id
    LEFT JOIN BreedingStages bs ON m.current_stage_id = bs.stage_id
    LEFT JOIN JoiningData j ON m.mob_id = j.mob_id
    LEFT JOIN ScanningData s ON m.mob_id = s.mob_id
    LEFT JOIN LambingData l ON m.mob_id = l.mob_id
    LEFT JOIN MarkingData mk ON m.mob_id = mk.mob_id
    LEFT JOIN WeaningData w ON m.mob_id = w.mob_id
WHERE m.deleted_at IS NULL;

-- Summary statistics view
CREATE VIEW vw_FarmSummary AS
SELECT 
    COUNT(DISTINCT mob_id) as total_mobs,
    SUM(ewes_joined) as total_ewes,
    AVG(scanning_percent) as avg_scanning_percent,
    AVG(percent_marked_to_joined) as avg_marking_percent,
    AVG(percent_weaned_to_joined) as avg_weaning_percent
FROM vw_MobKPIs
WHERE is_active = 1;

-- =====================================================
-- 6. STORED PROCEDURES FOR CALCULATIONS
-- =====================================================

-- Calculate scanning percentage
CREATE PROCEDURE sp_CalculateScanningPercent
    @scanning_id INT
AS
BEGIN
    UPDATE ScanningData
    SET scanning_percent = 
        CASE 
            WHEN in_lamb > 0 THEN 
                ((twins * 2.0) + singles) / in_lamb * 100.0
            ELSE 0
        END,
        updated_at = GETDATE()
    WHERE scanning_id = @scanning_id;
END;
GO

-- Calculate marking percentages
CREATE PROCEDURE sp_CalculateMarkingPercents
    @marking_id INT
AS
BEGIN
    UPDATE mk
    SET 
        mk.lambs_marked_total = mk.wethers + mk.ewe_lambs + ISNULL(mk.rams, 0),
        mk.percent_marked_to_joined = 
            CASE 
                WHEN j.ewes_joined > 0 THEN 
                    (mk.wethers + mk.ewe_lambs + ISNULL(mk.rams, 0)) * 1.0 / j.ewes_joined * 100.0
                ELSE 0
            END,
        mk.percent_marked_to_scanned = 
            CASE 
                WHEN s.in_lamb > 0 THEN 
                    (mk.wethers + mk.ewe_lambs + ISNULL(mk.rams, 0)) * 1.0 / s.in_lamb * 100.0
                ELSE 0
            END,
        mk.updated_at = GETDATE()
    FROM MarkingData mk
        INNER JOIN Mobs m ON mk.mob_id = m.mob_id
        LEFT JOIN JoiningData j ON mk.mob_id = j.mob_id
        LEFT JOIN ScanningData s ON mk.mob_id = s.mob_id
    WHERE mk.marking_id = @marking_id;
END;
GO

-- Calculate weaning percentages
CREATE PROCEDURE sp_CalculateWeaningPercents
    @weaning_id INT
AS
BEGIN
    UPDATE w
    SET 
        w.percent_weaned_to_joined = 
            CASE 
                WHEN j.ewes_joined > 0 THEN 
                    w.lambs_weaned * 1.0 / j.ewes_joined * 100.0
                ELSE 0
            END,
        w.percent_weaned_to_marked = 
            CASE 
                WHEN mk.lambs_marked_total > 0 THEN 
                    w.lambs_weaned * 1.0 / mk.lambs_marked_total * 100.0
                ELSE 0
            END,
        w.updated_at = GETDATE()
    FROM WeaningData w
        INNER JOIN Mobs m ON w.mob_id = m.mob_id
        LEFT JOIN JoiningData j ON w.mob_id = j.mob_id
        LEFT JOIN MarkingData mk ON w.mob_id = mk.mob_id
    WHERE w.weaning_id = @weaning_id;
END;
GO

-- Calculate lamb survival percentage
CREATE PROCEDURE sp_CalculateLambSurvival
    @lambing_id INT
AS
BEGIN
    UPDATE LambingData
    SET 
        lamb_survival_percent = 
            CASE 
                WHEN total_ewes > 0 THEN 
                    wet_ewes * 1.0 / total_ewes * 100.0
                ELSE 0
            END,
        updated_at = GETDATE()
    WHERE lambing_id = @lambing_id;
END;
GO

-- =====================================================
-- 7. TRIGGERS FOR AUTO-CALCULATIONS
-- =====================================================

-- Trigger to auto-calculate scanning percentage on insert/update
CREATE TRIGGER trg_ScanningData_Calculate
ON ScanningData
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @scanning_id INT;
    SELECT @scanning_id = scanning_id FROM inserted;
    EXEC sp_CalculateScanningPercent @scanning_id;
END;
GO

-- Trigger to auto-calculate marking percentages
CREATE TRIGGER trg_MarkingData_Calculate
ON MarkingData
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @marking_id INT;
    SELECT @marking_id = marking_id FROM inserted;
    EXEC sp_CalculateMarkingPercents @marking_id;
END;
GO

-- Trigger to auto-calculate weaning percentages
CREATE TRIGGER trg_WeaningData_Calculate
ON WeaningData
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @weaning_id INT;
    SELECT @weaning_id = weaning_id FROM inserted;
    EXEC sp_CalculateWeaningPercents @weaning_id;
END;
GO

-- Trigger to auto-calculate lamb survival
CREATE TRIGGER trg_LambingData_Calculate
ON LambingData
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @lambing_id INT;
    SELECT @lambing_id = lambing_id FROM inserted;
    EXEC sp_CalculateLambSurvival @lambing_id;
END;
GO

-- Trigger to update mob stage
CREATE TRIGGER trg_UpdateMobStage
ON Mobs
AFTER UPDATE
AS
BEGIN
    UPDATE Mobs
    SET updated_at = GETDATE()
    WHERE mob_id IN (SELECT mob_id FROM inserted);
END;
GO

-- =====================================================
-- 8. SAMPLE DATA INSERT
-- =====================================================

-- Example mob insertion
/*
-- Insert a new mob
INSERT INTO Mobs (mob_name, breed_id, status_id, zone_id, team_id, current_stage_id, current_location)
VALUES ('Mob 1 - Merino Ewes', 1, 1, 1, 1, 2, 'moriac paddock');

-- Get the mob_id
DECLARE @mob_id INT = SCOPE_IDENTITY();

-- Insert joining data
INSERT INTO JoiningData (mob_id, actual_start_date, actual_end_date, ewes_joined, rams_in)
VALUES (@mob_id, '2024-11-01', '2024-12-15', 545, 11);

-- Insert scanning data
INSERT INTO ScanningData (mob_id, actual_date, total_ewes_scanned, in_lamb, dry, twins, singles)
VALUES (@mob_id, '2025-02-06', 490, 465, 25, 200, 265);
-- Scanning percent auto-calculated by trigger

-- Insert marking data
INSERT INTO MarkingData (mob_id, actual_date, wethers, ewe_lambs)
VALUES (@mob_id, '2025-06-10', 280, 235);
-- Percentages auto-calculated by trigger
*/

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional performance indexes
CREATE INDEX IX_JoiningData_Mob ON JoiningData(mob_id);
CREATE INDEX IX_ScanningData_Mob ON ScanningData(mob_id);
CREATE INDEX IX_LambingData_Mob ON LambingData(mob_id);
CREATE INDEX IX_MarkingData_Mob ON MarkingData(mob_id);
CREATE INDEX IX_WeaningData_Mob ON WeaningData(mob_id);

-- Indexes for date filtering
CREATE INDEX IX_ScanningData_Date ON ScanningData(actual_date) WHERE actual_date IS NOT NULL;
CREATE INDEX IX_MarkingData_Date ON MarkingData(actual_date) WHERE actual_date IS NOT NULL;
CREATE INDEX IX_WeaningData_Date ON WeaningData(actual_date) WHERE actual_date IS NOT NULL;

-- =====================================================
-- 10. MAINTENANCE & BACKUP
-- =====================================================

-- Procedure to soft-delete old mobs
CREATE PROCEDURE sp_ArchiveMob
    @mob_id INT,
    @archived_by NVARCHAR(100)
AS
BEGIN
    UPDATE Mobs
    SET 
        is_active = 0,
        deleted_at = GETDATE(),
        updated_by = @archived_by
    WHERE mob_id = @mob_id;
END;
GO

-- Clean up old audit logs (keep last 2 years)
CREATE PROCEDURE sp_CleanupAuditLog
AS
BEGIN
    DELETE FROM AuditLog
    WHERE changed_at < DATEADD(YEAR, -2, GETDATE())
    AND sync_status = 'synced';
END;
GO

-- =====================================================
-- END OF SCHEMA
-- =====================================================

/*
DEPLOYMENT NOTES:
1. Run this script on Azure SQL Database
2. Set appropriate permissions for app user
3. Enable change tracking for offline sync:
   ALTER DATABASE [SheepSheet] SET CHANGE_TRACKING = ON
   (CHANGE_RETENTION = 14 DAYS, AUTO_CLEANUP = ON)
4. Configure backup policy (Azure handles automatically)
5. Set up monitoring and alerts in Azure Portal
6. Consider enabling Query Store for performance monitoring
7. Set up connection resiliency in application code
*/
