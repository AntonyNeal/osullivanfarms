# SheepSheet Data Flow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER (Leigh on Google Pixel)                     │
│                    Works offline 40% of the time                         │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND: React + TypeScript                          │
│                  (Azure Static Web App - Production)                     │
│                  https://witty-coast-049457e0f...                        │
├─────────────────────────────────────────────────────────────────────────┤
│  Components:                                                             │
│  • MobDashboard.tsx  ─────► Shows all mobs, KPIs, scoreboard           │
│  • MobDetail.tsx     ─────► Individual mob breeding data                │
│  • Farm Advisor      ─────► AI chat assistant                           │
│                                                                           │
│  Local State Management:                                                 │
│  • useState() for current view                                           │
│  • IndexedDB/LocalStorage for offline data (future)                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTP/HTTPS Requests
                                 │ (Fetch API)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   API LAYER: Node.js + Express                           │
│           (Azure Static Web App API - Serverless Functions)              │
│                    /api/* endpoints                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                              │
│  GET    /api/mobs                 ─────► List all mobs                  │
│  GET    /api/mobs/:id             ─────► Get mob details                │
│  POST   /api/mobs                 ─────► Create new mob                 │
│  PUT    /api/mobs/:id             ─────► Update mob data                │
│  DELETE /api/mobs/:id             ─────► Delete mob                     │
│                                                                           │
│  GET    /api/farm/statistics      ─────► Get farm-wide KPIs            │
│  GET    /api/mobs/:id/history     ─────► Get mob change history        │
│  POST   /api/breeding-events      ─────► Record breeding event          │
│                                                                           │
│  Middleware:                                                             │
│  • CORS handling                                                         │
│  • Authentication (future)                                               │
│  • Error handling & logging                                              │
│  • Request validation                                                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ PostgreSQL Protocol
                                 │ (SSL/TLS encrypted)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              DATABASE: PostgreSQL 14 Flexible Server                     │
│                    (Azure Database for PostgreSQL)                       │
│                  osullivanfarms-db.postgres.database.azure.com          │
│                         Australia East Region                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Tables:                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ mobs                                                             │   │
│  │ ├─ mob_id (PK)                                                   │   │
│  │ ├─ mob_name, breed_name, zone_name                              │   │
│  │ ├─ current_stage, current_location                              │   │
│  │ ├─ ewes_joined, rams_in                                         │   │
│  │ ├─ in_lamb, dry, twins, singles, triplets                       │   │
│  │ ├─ scanning_percent (auto-calculated)                           │   │
│  │ ├─ marking_percent, weaning_percent                             │   │
│  │ └─ is_active, created_at, last_updated                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              │ Foreign Key                               │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ mob_history                                                      │   │
│  │ ├─ history_id (PK)                                               │   │
│  │ ├─ mob_id (FK) ──────────┐                                       │   │
│  │ ├─ change_type           │                                       │   │
│  │ ├─ field_changed         │   Tracks:                             │   │
│  │ ├─ old_value             │   • Stage changes                     │   │
│  │ ├─ new_value             │   • Data updates                      │   │
│  │ ├─ changed_by            │   • Who made changes                  │   │
│  │ └─ changed_at            │   • When changes occurred             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ breeding_events                                                  │   │
│  │ ├─ event_id (PK)                                                 │   │
│  │ ├─ mob_id (FK)                                                   │   │
│  │ ├─ event_type (joining, scanning, lambing, etc.)                │   │
│  │ ├─ event_date, event_time                                        │   │
│  │ ├─ event_data (JSONB - flexible structure)                      │   │
│  │ └─ recorded_by, notes                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ paddocks                                                         │   │
│  │ ├─ paddock_id (PK)                                               │   │
│  │ ├─ paddock_name, zone_name                                       │   │
│  │ ├─ size_hectares, carrying_capacity                             │   │
│  │ ├─ current_mob_id (FK to mobs)                                  │   │
│  │ └─ latitude, longitude (GPS for mapping)                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ farm_settings                                                    │   │
│  │ ├─ setting_id (PK)                                               │   │
│  │ ├─ setting_key (e.g., 'target_scanning_percent')                │   │
│  │ ├─ setting_value (e.g., '150')                                  │   │
│  │ └─ setting_type (string, number, boolean, json)                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Views (Pre-computed queries):                                           │
│  • mob_kpi_summary  ─────► Joins mob data with calculations             │
│  • farm_statistics  ─────► Aggregates farm-wide metrics                 │
│                                                                           │
│  Triggers & Functions:                                                   │
│  • Auto-calculate scanning_percent when twins/singles updated            │
│  • Auto-update last_updated timestamp                                    │
│  • Validate business rules (ewes > 0, dates logical, etc.)              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Scenarios

### 1. **User Views Dashboard** (Read Flow)

```
┌──────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User    │──GET───→│ Frontend │──GET───→│   API   │──SQL───→│ Database │
│ (Leigh)  │         │  React   │         │ Express │         │PostgreSQL│
└──────────┘         └──────────┘         └─────────┘         └──────────┘
     ▲                                          │                     │
     │                                          │                     │
     │                                          ▼                     │
     │                                   SELECT * FROM                │
     │                                   mob_kpi_summary              │
     │                                   WHERE is_active = TRUE       │
     │                                          │                     │
     │                                          │◄────────────────────┘
     │                                          │
     │                                   [Transform JSON]
     │                                          │
     │                 ┌────────────────────────┘
     │                 │
     │                 ▼
     │           {
     │             "mobs": [
     │               {
     │                 "mob_id": 1,
     │                 "mob_name": "Mob 1 - Merino Ewes",
     │                 "breed_name": "Merinos",
     │                 "scanning_percent": 158.0,
     │                 ...
     │               }
     │             ],
     │             "summary": {
     │               "total_mobs": 26,
     │               "total_ewes": 12480,
     │               "avg_scanning_percent": 152.3
     │             }
     │           }
     │                 │
     └─────────────────┘
           [Render UI: Scoreboard, List View, KPI Cards]
```

**Steps:**

1. User opens SheepSheet dashboard
2. Frontend makes `GET /api/mobs` request
3. API queries database: `SELECT * FROM mob_kpi_summary`
4. Database returns mob data with pre-calculated KPIs
5. API transforms to JSON and sends to frontend
6. Frontend renders MobDashboard with cards and statistics

---

### 2. **User Updates Scanning Data** (Write Flow)

```
┌──────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User    │         │ Frontend │         │   API   │         │ Database │
│ (Leigh)  │         │  React   │         │ Express │         │PostgreSQL│
└──────────┘         └──────────┘         └─────────┘         └──────────┘
     │                     │                     │                     │
     │ Clicks "Scanning"   │                     │                     │
     │ tab on Mob Detail   │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │ Enters data:        │                     │                     │
     │ • In lamb: 465      │                     │                     │
     │ • Dry: 25           │                     │                     │
     │ • Twins: 200        │                     │                     │
     │ • Singles: 265      │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │ Clicks "Save"       │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │ PUT /api/mobs/1     │                     │
     │                     │ {                   │                     │
     │                     │   "in_lamb": 465,   │                     │
     │                     │   "dry": 25,        │                     │
     │                     │   "twins": 200,     │                     │
     │                     │   "singles": 265,   │                     │
     │                     │   "scanning_date":  │                     │
     │                     │   "2025-02-06"      │                     │
     │                     │ }                   │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │ BEGIN TRANSACTION   │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │ UPDATE mobs SET     │
     │                     │                     │   in_lamb = 465,    │
     │                     │                     │   dry = 25,         │
     │                     │                     │   twins = 200,      │
     │                     │                     │   singles = 265     │
     │                     │                     │ WHERE mob_id = 1    │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │    [TRIGGER FIRES]  │
     │                     │                     │    Calculates:      │
     │                     │                     │    scanning_percent │
     │                     │                     │    = ((200*2 + 265) │
     │                     │                     │       / 465) * 100  │
     │                     │                     │    = 141.94%        │
     │                     │                     │                     │
     │                     │                     │ INSERT INTO         │
     │                     │                     │ mob_history         │
     │                     │                     │ (mob_id,            │
     │                     │                     │  change_type,       │
     │                     │                     │  field_changed,     │
     │                     │                     │  new_value)         │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │ INSERT INTO         │
     │                     │                     │ breeding_events     │
     │                     │                     │ (mob_id,            │
     │                     │                     │  event_type,        │
     │                     │                     │  event_date,        │
     │                     │                     │  event_data)        │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │ COMMIT              │
     │                     │                     │◄────────────────────┤
     │                     │                     │                     │
     │                     │ {                   │                     │
     │                     │   "success": true,  │                     │
     │                     │   "mob": {          │                     │
     │                     │     "scanning_%":   │                     │
     │                     │     141.94,         │                     │
     │                     │     ...             │                     │
     │                     │   }                 │                     │
     │                     │ }                   │                     │
     │                     │◄────────────────────┤                     │
     │                     │                     │                     │
     │ [UI Updates]        │                     │                     │
     │ Shows new           │                     │                     │
     │ scanning %          │                     │                     │
     │◄────────────────────┤                     │                     │
     │                     │                     │                     │
```

**Steps:**

1. User navigates to Mob Detail → Scanning tab
2. User enters scanning data (in lamb, dry, twins, singles)
3. Frontend validates input and sends `PUT /api/mobs/1` with data
4. API validates request and starts database transaction
5. Database updates `mobs` table
6. **Trigger automatically calculates `scanning_percent`**
7. Database inserts audit record into `mob_history`
8. Database records event in `breeding_events`
9. Transaction commits
10. API returns updated mob data
11. Frontend updates UI with new calculated percentage

---

### 3. **Farm Advisor AI Query** (Future Implementation)

```
┌──────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User    │         │ Frontend │         │   API   │         │ Database │
└──────────┘         └──────────┘         └─────────┘         └──────────┘
     │                     │                     │                     │
     │ Types: "What's my   │                     │                     │
     │ best performing     │                     │                     │
     │ mob?"               │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │ POST /api/advisor   │                     │
     │                     │ {                   │                     │
     │                     │   "query": "best    │                     │
     │                     │   performing mob"   │                     │
     │                     │ }                   │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │ SELECT * FROM mobs  │
     │                     │                     │ ORDER BY            │
     │                     │                     │ scanning_percent    │
     │                     │                     │ DESC LIMIT 1        │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │ [Query Results]     │
     │                     │                     │◄────────────────────┤
     │                     │                     │                     │
     │                     │                     │ [Call AI Service]   │
     │                     │                     │ Generate response   │
     │                     │                     │ with context        │
     │                     │                     │                     │
     │                     │ {                   │                     │
     │                     │   "response":       │                     │
     │                     │   "Your best        │                     │
     │                     │   performing mob    │                     │
     │                     │   is Mob 1 with     │                     │
     │                     │   158% scanning.    │                     │
     │                     │   That's excellent!"│                     │
     │                     │ }                   │                     │
     │                     │◄────────────────────┤                     │
     │                     │                     │                     │
     │ [Display Answer]    │                     │                     │
     │◄────────────────────┤                     │                     │
     │                     │                     │                     │
```

---

## Key Features Explained

### 1. **Automatic Calculations**

When you update breeding data, the database automatically calculates percentages:

```sql
-- Scanning % = ((twins × 2) + (triplets × 3) + singles) ÷ in_lamb × 100
-- Example: ((200 × 2) + (0 × 3) + 265) ÷ 465 × 100 = 141.94%

CREATE TRIGGER trg_update_scanning_percent
BEFORE INSERT OR UPDATE ON mobs
FOR EACH ROW
EXECUTE FUNCTION update_scanning_percent();
```

**Why this matters:**

- Leigh doesn't need to manually calculate percentages
- Always consistent calculations
- Reduces human error
- Updates happen instantly

### 2. **Change History Tracking**

Every time mob data changes, it's recorded:

```sql
INSERT INTO mob_history (
  mob_id,
  change_type,
  field_changed,
  old_value,
  new_value,
  changed_at
)
```

**Why this matters:**

- See what changed and when
- Track mob progress over time
- Audit trail for compliance
- Undo capability (future)

### 3. **Breeding Events Log**

Specific events are recorded separately:

```sql
INSERT INTO breeding_events (
  mob_id,
  event_type,
  event_date,
  event_data -- JSONB allows flexible structure
)
```

**Example event_data:**

```json
{
  "scanning": {
    "in_lamb": 465,
    "dry": 25,
    "twins": 200,
    "singles": 265,
    "vet": "Dr. Smith",
    "weather": "clear"
  }
}
```

**Why this matters:**

- Rich contextual data
- Flexible structure for different event types
- Timeline of breeding season
- Historical trend analysis

### 4. **Pre-computed Views**

Database views make queries fast:

```sql
CREATE VIEW mob_kpi_summary AS
SELECT
  m.*,
  CASE
    WHEN scanning_percent >= 150 THEN 'Excellent'
    WHEN scanning_percent >= 130 THEN 'Good'
    ELSE 'Below Target'
  END as scanning_performance
FROM mobs m
WHERE is_active = TRUE;
```

**Why this matters:**

- Dashboard loads fast
- No complex calculations in API code
- Database does the heavy lifting
- Works with Leigh's 60% connectivity

---

## Offline Capability (Future Enhancement)

```
┌──────────────────────────────────────────────────────────────┐
│                         User Device                          │
│                    (Offline - No Internet)                   │
├──────────────────────────────────────────────────────────────┤
│  IndexedDB (Local Browser Storage)                           │
│  ├─ Cached mob data                                          │
│  ├─ Pending changes queue                                    │
│  └─ Last sync timestamp                                      │
│                                                               │
│  When online:                                                 │
│  1. Sync pending changes to server                           │
│  2. Fetch latest data                                        │
│  3. Update IndexedDB cache                                   │
│  4. Clear pending changes queue                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Security & Data Protection

```
Frontend ───[HTTPS/TLS]───► API ───[SSL/TLS]───► Database
                                                    │
                                                    ▼
                                            [Encrypted at rest]
                                            [Automatic backups]
                                            [Point-in-time recovery]
```

**Security layers:**

1. **Transport:** All communication encrypted (HTTPS/TLS)
2. **Authentication:** Azure AD integration (future)
3. **Database:** SSL-only connections, encrypted storage
4. **Backups:** Automatic daily backups, 7-day retention
5. **Network:** Azure Virtual Network isolation

---

## Performance Optimizations

### Database Indexes

```sql
-- Fast mob lookups
CREATE INDEX idx_mobs_active ON mobs(is_active);
CREATE INDEX idx_mobs_stage ON mobs(current_stage);
CREATE INDEX idx_mobs_zone ON mobs(zone_name);

-- Fast history queries
CREATE INDEX idx_mob_history_date ON mob_history(changed_at DESC);
```

**Why this matters:**

- Queries return in milliseconds
- Dashboard loads quickly even with 100+ mobs
- Works well on mobile with limited resources

### Connection Pooling

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeout: 30000,
  connectionTimeout: 2000,
});
```

**Why this matters:**

- Reuses database connections
- Reduces overhead
- Handles concurrent users efficiently

---

## Data Flow Summary

**READ Operations (Dashboard viewing):**

```
User → Frontend → API → Database View → API → Frontend → User
                         (mob_kpi_summary)
```

**WRITE Operations (Data entry):**

```
User → Frontend → API → Database Table → Triggers → History/Events
                                       → Calculations
                                       → Validations
         ↓
       Confirmation
```

**Offline Mode (Future):**

```
User → Frontend → IndexedDB
                     ↓
            [When online: Sync]
                     ↓
                    API → Database
```

---

## Next Steps

1. ✅ Schema designed and documented
2. ⏳ Deploy schema to Azure PostgreSQL
3. ⏳ Create API endpoints
4. ⏳ Connect frontend to API
5. ⏳ Test with sample data
6. ⏳ Add offline support (PWA)
7. ⏳ Implement Farm Advisor AI

**Ready to proceed with implementation?**
