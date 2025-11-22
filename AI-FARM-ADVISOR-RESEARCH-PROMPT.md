# AI Farm Advisor Research Prompt

## System Context

You are researching information to build an **AI-powered farm advisory system** for **O'Sullivan Farms**, a sheep farming operation in Echuca, Victoria, Australia. The system will provide intelligent recommendations for:

- Sheep mob management optimization
- Breeding cycle decision support
- Paddock rotation strategies
- Health and treatment protocols
- Performance benchmarking and KPI analysis

## Data Model Overview

### Core Entities

The system tracks sheep farming operations through these primary data structures:

#### 1. **Mobs** (Sheep Groups)
- **mob_id**: Unique identifier for each sheep group
- **mob_name**: Optional descriptive name
- **breed_name**: Merino, Dohne, Border Leicester x Merino, etc.
- **status_name**: ewe (breeding females), maidens (young females), wethers (castrated males), rams
- **zone_name**: Geographic locations (Deni, Elmore, Goolgowi)
- **team_name**: Self Replacing (breeding ewes), Terminal (meat production)
- **current_stage**: Pre-Joining → Joining → Scanning → Lambing → Marking → Weaning → Complete
- **current_location**: Paddock assignment
- **ewes_joined**: Number of ewes put with rams
- **rams_in**: Number of rams used (typical ratio: 1 ram per 50 ewes)
- **is_active**: Whether mob is currently being tracked

#### 2. **Breeding Cycle Stages** (5 Critical Phases)

**Stage 1: Joining**
- **joining_date**: When rams introduced to ewes
- **expected_start_date**, **expected_end_date**: Planned joining window
- **actual_start_date**, **actual_end_date**: Actual joining period
- **ewes_joined**: Number of breeding females
- **rams_in**: Number of breeding males

**Stage 2: Scanning (Pregnancy Ultrasound)**
- **scanning_date**: When ultrasound performed (~6-8 weeks after joining)
- **in_lamb**: Number of pregnant ewes
- **dry**: Non-pregnant ewes
- **twins**: Ewes carrying twin lambs
- **singles**: Ewes carrying single lamb
- **scanning_percent**: Key KPI = ((twins × 2) + singles) ÷ in_lamb × 100
  - **Target**: 150% (industry benchmark)
  - Higher % = better productivity

**Stage 3: Lambing (Birth)**
- **lambing_date**: Start of lambing period (~5 months after joining)
- **wet_ewes**: Ewes that successfully gave birth
- **dry_ewes**: Ewes that didn't lamb despite being pregnant
- **lambs_born_alive**: Live births
- **lambs_born_dead**: Stillbirths
- **lamb_survival_percent**: (wet_ewes ÷ total_ewes) × 100

**Stage 4: Marking (Lamb Processing)**
- **marking_date**: When lambs are tagged, castrated, tail-docked (~6-8 weeks after birth)
- **wethers**: Male lambs (castrated)
- **ewe_lambs**: Female lambs
- **rams**: Uncastrated males (kept for breeding)
- **lambs_marked_total**: Total lambs processed
- **marking_percent**: Key KPI = (lambs_marked ÷ ewes_joined) × 100
  - **Target**: 130%

**Stage 5: Weaning (Separation)**
- **weaning_date**: When lambs separated from mothers (~4-6 months old)
- **lambs_weaned**: Total lambs weaned
- **ewe_lambs_weaned**, **wether_lambs_weaned**: Gender breakdown
- **avg_weaning_weight_kg**: Average weight (target: 40-50kg depending on breed)
- **weaning_percent**: Key KPI = (lambs_weaned ÷ ewes_joined) × 100
  - **Target**: 125%

#### 3. **Paddocks** (Grazing Land Management)
- **paddock_id**: Unique identifier
- **paddock_name**: e.g., "Home Paddock", "North 22", "East 40"
- **zone_name**: Geographic region
- **size_hectares**: Paddock area
- **carrying_capacity**: Estimated maximum sheep capacity
- **current_mob_id**: Which mob is currently grazing (FK to mobs)
- **latitude**, **longitude**: GPS coordinates for mapping
- **is_available**: Whether paddock is ready for grazing

#### 4. **Breeding Events** (Detailed Activity Log)
- **event_type**: joining_start, joining_end, scan, lamb_birth, marking, weaning
- **event_date**, **event_time**: When event occurred
- **event_data** (JSONB): Flexible storage for event-specific details
- **recorded_by**: User who logged the event (e.g., "Hope", "Leigh")
- **notes**: Observations and comments

#### 5. **Farm Settings** (Configuration & Targets)
- **farm_name**: "O'Sullivan Farms"
- **default_ram_ratio**: 50 (ewes per ram)
- **target_scanning_percent**: 150
- **target_marking_percent**: 130
- **target_weaning_percent**: 125

### Key Performance Indicators (KPIs)

The system calculates these critical metrics for each mob:

1. **Scanning Percent**: ((twins × 2) + singles) ÷ in_lamb × 100
   - Measures pregnancy productivity
   - Target: 150% (1.5 lambs per pregnant ewe)

2. **Marking Percent**: (lambs_marked ÷ ewes_joined) × 100
   - Measures lamb survival from birth to marking
   - Target: 130% (1.3 lambs marked per ewe)

3. **Weaning Percent**: (lambs_weaned ÷ ewes_joined) × 100
   - Measures final productivity
   - Target: 125% (1.25 lambs weaned per ewe)

4. **Lamb Survival Percent**: (wet_ewes ÷ total_ewes) × 100
   - Measures birth success rate

5. **Ram Efficiency**: ewes_joined ÷ rams_in
   - Typical target: 50:1 ratio

### Farm Characteristics

**Location & Climate:**
- Echuca, Victoria, Australia (Murray River region)
- Temperate climate with hot, dry summers
- Winter rainfall patterns
- Paddock conditions vary by season

**Breeds Managed:**
- Merinos (fine wool production)
- Dohnes (dual-purpose: wool + meat)
- Border Leicester × Merino (first cross, meat production)

**Team Structure:**
- Self Replacing: Breeding ewes for flock replacement
- Terminal: Meat production focus

**Geographic Zones:**
- Deni (Deniliquin area)
- Elmore
- Goolgowi
- Different zones may have different feed quality, water access, climate conditions

## Research Objectives

### 1. **Breeding Optimization Research**

Research and provide insights on:

- **Optimal joining windows** based on:
  - Seasonal feed availability
  - Weather patterns in Murray River region
  - Target lamb production timing (spring lambs command premium prices)
  - Ram:ewe ratios for different breed types

- **Scanning interpretation and intervention:**
  - When scanning_percent is below target (< 150%), what factors to investigate?
  - Nutritional interventions for poor scanning results
  - Ram fertility issues vs. ewe nutrition issues
  - Best practices for managing "dry" (non-pregnant) ewes

- **Twin management strategies:**
  - Nutritional requirements for ewes carrying twins
  - Separate paddocking strategies for twin vs. single bearers
  - Risk factors for twin lamb loss

### 2. **Lamb Survival & Marking Optimization**

Research:

- **Common causes of lamb loss** between scanning and marking:
  - Nutritional deficiencies in ewes
  - Predation (foxes, eagles, wild dogs)
  - Weather-related deaths (exposure, hypothermia)
  - Dystocia (birthing difficulties)
  - Mis-mothering

- **Optimal marking timing:**
  - Age of lambs for best survival outcomes
  - Weather considerations for marking operations
  - Post-marking care protocols

- **Marking percent benchmarks:**
  - Industry standards by breed
  - Regional variations (Victoria vs. other states)
  - Impact of ewe age on marking outcomes

### 3. **Paddock Rotation & Grazing Management**

Research:

- **Rotational grazing best practices:**
  - Rest periods for paddock recovery
  - Stocking density calculations (sheep per hectare by breed/stage)
  - Feed budgeting for different mob types
  - Water requirements per 100 sheep

- **Seasonal paddock allocation:**
  - Which paddocks to use during lambing (shelter, water access)
  - Pre-joining nutrition strategies (flushing)
  - Late pregnancy feeding requirements (twins vs. singles)

- **Paddock condition monitoring:**
  - Ground cover percentage targets
  - Signs of overgrazing
  - When to rotate mobs

### 4. **Health Management & Treatment Protocols**

Research:

- **Common sheep health issues** in Murray River region:
  - Internal parasites (worms) - drenching schedules
  - Flystrike prevention (especially summer)
  - Footrot management
  - Mineral deficiencies (selenium, copper, cobalt in Victorian soils)

- **Vaccination schedules:**
  - Pre-joining vaccinations for ewes
  - Lamb vaccinations at marking
  - Clostridial disease prevention (5-in-1, 6-in-1)

- **Withholding periods:**
  - ESI (Export Slaughter Interval) requirements
  - WHP (Withholding Period) for drenches, antibiotics
  - Record-keeping requirements for meat safety

### 5. **Performance Benchmarking**

Research:

- **Industry KPI benchmarks** for sheep farming:
  - Scanning percent by breed and region
  - Marking percent expectations
  - Weaning percent standards
  - Weaning weights by breed and production system

- **Profitability indicators:**
  - Cost per ewe maintained annually
  - Income per DSE (Dry Sheep Equivalent)
  - Break-even lamb survival rates

- **Comparative analysis:**
  - Self Replacing vs. Terminal system economics
  - Merino vs. crossbred profitability
  - Small vs. large mob management efficiency

### 6. **Decision Support Scenarios**

Provide research for these common decision points:

**Scenario A: Poor Scanning Results**
- Mob scanned at 120% (below 150% target)
- What are the likely causes?
- What interventions can improve marking outcomes?
- Should the mob be split (twins vs. singles vs. dry)?

**Scenario B: High Lamb Mortality**
- Scanning was 155%, but marking only achieved 110%
- What happened between scanning and marking?
- What data should be collected to diagnose the problem?
- What management changes for next season?

**Scenario C: Paddock Allocation**
- 500 ewes about to start lambing
- Multiple paddocks available: 50ha (sheltered, near water), 80ha (open, good feed), 45ha (hilly, moderate feed)
- Which paddock(s) to use and why?

**Scenario D: Ram Selection**
- Joining 550 ewes
- Options: 10 rams (55:1 ratio) or 12 rams (46:1 ratio)
- What factors determine the optimal number?
- How does breed, ewe age, and joining duration affect this?

### 7. **Seasonal Calendar & Timing**

Research and document:

- **Typical Australian sheep breeding calendar:**
  - Joining: March-May (autumn)
  - Scanning: April-June
  - Lambing: August-October (spring)
  - Marking: September-December
  - Weaning: December-February (summer)

- **Feed availability patterns:**
  - Spring flush (August-November): peak pasture growth
  - Summer (December-February): dry conditions, supplementary feeding often required
  - Autumn break (March-May): rain returns, feed quality improves
  - Winter (June-August): slower growth, cold stress

- **Critical nutrition timing:**
  - Pre-joining flushing (2-3 weeks before rams in)
  - Late pregnancy nutrition (last 6 weeks, especially for twins)
  - Lactation support (first 6 weeks post-lambing)

### 8. **Data Quality & Collection Best Practices**

Research:

- **Essential data points** to collect at each stage:
  - What measurements are critical vs. nice-to-have?
  - How to standardize observations across multiple workers (Hope & Leigh)
  - Mobile data collection in paddocks (offline capability)

- **Audit trail and traceability:**
  - NLIS (National Livestock Identification System) compliance
  - LPA (Livestock Production Assurance) record-keeping
  - Chemical use documentation

- **Photo documentation value:**
  - Body condition scoring via photos
  - Paddock condition assessment
  - Lamb marking wound healing checks

### 9. **Climate & Weather Impact**

Research:

- **Weather-related risks:**
  - Lambing in cold/wet conditions (hypothermia risk)
  - Heat stress during late pregnancy
  - Drought impact on feed and water availability
  - Frost damage to pastures

- **Climate data integration:**
  - BoM (Bureau of Meteorology) rainfall data
  - Temperature patterns for Victoria
  - Seasonal forecasts and planning

### 10. **Technology & Innovation**

Research current agricultural technology for:

- **Remote monitoring:**
  - GPS collars for mob tracking
  - Water trough sensors (fill levels)
  - Pasture biomass sensors

- **Precision agriculture:**
  - Satellite imagery for paddock assessment (NDVI)
  - Drone-based mob counting
  - Automated weigh scales at water points

- **Data analytics:**
  - Machine learning for lamb survival prediction
  - Pattern recognition in mob performance
  - Genetic trait analysis for breeding decisions

## Output Format Requirements

For each research topic, provide:

1. **Summary**: 2-3 sentence overview
2. **Key Findings**: Bullet points of actionable insights
3. **Benchmarks/Standards**: Numerical targets where applicable
4. **Regional Considerations**: Victoria/Murray River specific factors
5. **Practical Recommendations**: Steps a farmer can take immediately
6. **Data Requirements**: What additional data would improve recommendations
7. **Sources**: Australian agricultural research, state DPI resources, industry bodies (MLA, AWI)

## Priority Areas

Focus research in this order:

1. **HIGH PRIORITY**: Breeding optimization, lamb survival, KPI benchmarks
2. **MEDIUM PRIORITY**: Paddock management, health protocols, seasonal timing
3. **LOWER PRIORITY**: Technology integration, advanced analytics

## Target Audience

The AI advisor will serve:

- **Primary Users**: Hope & Leigh (farm operators) - practical, field-level advice
- **Secondary Users**: Farm managers making strategic decisions
- **Tone**: Australian agricultural context, practical not academic, metric units

## Success Criteria

The research should enable the AI advisor to:

1. **Diagnose underperformance**: "Your marking % is 115%. Based on scanning data, you lost 25% of lambs. Here are the 5 most likely causes..."

2. **Provide proactive recommendations**: "Mob 3 will be lambing in 4 weeks. Scanning showed 180% twins. Recommend moving to Home Paddock (sheltered) and increasing feed by 30%."

3. **Benchmark comparisons**: "Your scanning % of 165% is in the top 20% for Merinos in Victoria."

4. **Decision support**: "With current feed levels and 500 ewes at 6 weeks pre-lambing, you need to allocate paddocks totaling 80-100 hectares with DSE rating of 7+."

5. **Risk alerts**: "Mob 1 marking scheduled for next week. Weather forecast shows cold/wet conditions. Lamb survival risk increased by 15%. Consider delaying 5-7 days."

## Additional Context

**System Architecture:**
- Frontend: React/TypeScript mobile-first web app
- Backend: Node.js API with Azure Functions
- Database: PostgreSQL on Azure
- Offline-capable: Service workers for paddock use without cell coverage
- Multi-user: Hope and Leigh can update simultaneously

**Integration Points:**
- Weather APIs (Bureau of Meteorology)
- Market price data (for profitability calculations)
- NLIS database (eventually, for compliance)
- Historical farm performance data

## Research Starting Points

Recommended authoritative sources:

1. **Meat & Livestock Australia (MLA)**: Industry research and benchmarks
2. **Australian Wool Innovation (AWI)**: Wool breed best practices
3. **Agriculture Victoria (DEECA)**: State-specific guidelines
4. **NSW DPI**: Regional agricultural resources
5. **CSIRO**: Scientific research on Australian livestock
6. **Holmes Sackett**: Farm consulting benchmarking data
7. **Local Landcare/catchment groups**: Murray-Darling basin practices
8. **University research**: Charles Sturt, Melbourne, Sydney agricultural faculties

---

## Example Use Case

**User Query**: "Mob 2 scanned at 140% (below our 150% target). What should I do?"

**AI Advisor Response** (informed by your research):
> Your scanning result of 140% for Mob 2 is below the farm target of 150% and slightly below the Victorian Merino average of 145%.
>
> **Likely Causes:**
> - Ram fertility issues (if other mobs also underperformed with same rams)
> - Ewe body condition score below 3.0 at joining
> - Insufficient flushing period (need 2-3 weeks pre-joining on improving feed)
> - Age structure of mob (maiden ewes and old ewes scan lower)
>
> **Immediate Actions:**
> 1. **Increase nutrition now**: Target body condition score 3.5+ for late pregnancy
> 2. **Separate twins if scanned separately**: They need 30% more feed than singles
> 3. **Plan for lambing paddock**: Allocate sheltered area with good water access
> 4. **Monitor closely**: 140% scanning can still achieve 120-125% marking with good management
>
> **For Next Season:**
> - Review ram:ewe ratio (currently 10 rams for 500 ewes = 50:1, consider 45:1)
> - Implement pre-joining flushing program (rising plane of nutrition 2-3 weeks before)
> - Body condition score all ewes 6 weeks before joining, separate and improve thin ewes
>
> **Data to Collect:**
> - Body condition scores now and at lambing
> - Paddock feed assessment (ground cover %, pasture species)
> - Individual ram performance (if using different rams across mob)

---

## Questions for Further Clarification

If you need additional context about the system or data model to inform your research, please ask about:

- Specific mob sizes (typical range: 200-600 ewes per mob)
- Technology constraints (mobile connectivity in paddocks is limited)
- Labor availability (2 primary operators, occasional contractor help)
- Equipment on farm (handling yards, scales, ultrasound contractor)
- Current pain points in the manual Excel tracking system

---

**Begin your research with the High Priority topics, focusing on actionable insights that will directly improve lamb survival rates and breeding productivity for O'Sullivan Farms.**
