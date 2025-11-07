# Unit Economics Model - Companion Booking Platform

**Date:** November 7, 2025  
**Version:** 2.0 - Progressive Pricing Strategy

---

## Executive Summary

This document provides a detailed unit economics analysis for the multi-tenant companion booking platform, focusing on a **progressive pricing strategy** that starts with a low booking fee ($10) and gradually increases as adoption and normalization grow.

### Key Metrics - Progressive Pricing Model

| Phase             | Timeline     | Booking Fee | Target Volume  | Monthly Profit | Margin |
| ----------------- | ------------ | ----------- | -------------- | -------------- | ------ |
| **Launch**        | Months 1-6   | **$10**     | 250 bookings   | $2,267         | 91%    |
| **Adoption**      | Months 7-12  | **$15**     | 500 bookings   | $7,014         | 94%    |
| **Normalization** | Months 13-24 | **$20**     | 1,000 bookings | $18,744        | 94%    |
| **Maturity**      | Year 2+      | **$25**     | 2,000 bookings | $47,574        | 95%    |

### Critical Insights

✅ **Start at $10/booking** - Low friction, high adoption, still 91% margin  
✅ **Break-even: 10 bookings/month** at $10 fee (only 5 at $20 fee)  
✅ **Cost per booking: $0.68-$2.23** depending on scale  
✅ **Profitable from day 1** with modest volume (50 bookings = $384 profit)  
✅ **Scale economics** - margins improve from 91% to 95% as you grow

### Business Model

- **Client pays:** $10-25 booking fee to platform (progressively increasing)
- **Session payment:** Settled directly between client and companion ($250-2000+)
- **Platform processes:** Only the small booking fee, not full session payment
- **Result:** Minimal payment processing costs (2.9% of $10-25), exceptional margins

---

## 1. Cost Structure

### Business Model Note

**The platform charges a booking fee directly to the client (john), NOT a percentage of the session fee.**

- Client pays booking fee to platform (e.g., $25-50)
- Client settles session payment with companion directly (cash, transfer, etc.)
- Platform does NOT process session payments
- This eliminates payment processing fees on large transaction amounts

### 1.1 Fixed Monthly Costs (Infrastructure)

```
┌─────────────────────────────────────────────────────┐
│ FIXED INFRASTRUCTURE COSTS (Monthly)                │
├─────────────────────────────────────────────────────┤
│ DigitalOcean App Platform (Production)   $12.00    │
│ PostgreSQL Database (1GB, Sydney)        $15.00    │
│ Domain Names (4 domains @ $1/mo)          $4.00    │
│ SSL Certificates                          $0.00    │ (Let's Encrypt)
│ CDN / Bandwidth (estimated)               $5.00    │
│ Monitoring & Logs                         $0.00    │ (DO included)
├─────────────────────────────────────────────────────┤
│ TOTAL INFRASTRUCTURE                     $36.00    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ OPTIONAL/SCALE-UP COSTS (Monthly)                   │
├─────────────────────────────────────────────────────┤
│ Email Service (SendGrid/Postmark)        $15.00    │ (1,000 emails/mo)
│ Analytics (PostHog/Plausible)            $20.00    │
│ Payment Gateway (Stripe/Square)          $10.00    │ (base fee)
│ Backup & Storage                          $5.00    │
├─────────────────────────────────────────────────────┤
│ TOTAL OPTIONAL SERVICES                  $50.00    │
└─────────────────────────────────────────────────────┘

TOTAL FIXED MONTHLY COSTS: $36 - $86 depending on features
```

### 1.2 Variable Costs per Booking

```
┌─────────────────────────────────────────────────────┐
│ VARIABLE COSTS PER BOOKING                          │
├─────────────────────────────────────────────────────┤
│ Payment Processing (2.9% + $0.30)        $1.03     │ (on $25 booking fee)
│ OR (on $50 booking fee)                  $1.75     │
│ Email Notifications (2-3 emails)         $0.03     │
│ Database Operations                      $0.001    │
│ API Calls / Compute                      $0.01     │
│ SMS Notifications (optional)             $0.10     │
├─────────────────────────────────────────────────────┤
│ TOTAL VARIABLE COST (@ $25 fee)          $1.17     │
│ TOTAL VARIABLE COST (@ $50 fee)          $1.89     │
└─────────────────────────────────────────────────────┘

Note: Dramatically lower costs since we only process the booking fee,
not the full session payment ($500-2000)
```

### 1.3 Cost per Booking at Scale

**Cost analysis across different booking fee amounts:**

| Monthly Bookings | Fixed Cost/Booking | Variable Cost     | **Total Cost** | @ $10 fee      | @ $20 fee | @ $50 fee |
| ---------------- | ------------------ | ----------------- | -------------- | -------------- | --------- | --------- |
| 10               | $8.60              | $0.59/$1.17/$1.89 | $9.19-$10.49   | Payment: $0.59 | $0.88     | $1.75     |
| 50               | $1.72              | $0.59/$1.17/$1.89 | $2.31-$3.61    |                |           |           |
| 100              | $0.86              | $0.59/$1.17/$1.89 | $1.45-$2.75    |                |           |           |
| 250              | $0.34              | $0.59/$1.17/$1.89 | $0.93-$2.23    |                |           |           |
| 500              | $0.17              | $0.59/$1.17/$1.89 | $0.76-$2.06    |                |           |           |
| 1,000            | $0.09              | $0.59/$1.17/$1.89 | $0.68-$1.98    |                |           |           |

**Key Insight:**

- At $10 fee & 250+ bookings: Cost = **$0.93 per booking**
- At $20 fee & 250+ bookings: Cost = **$1.51 per booking**
- At $50 fee & 250+ bookings: Cost = **$2.23 per booking**
- Costs are minimal even at very low booking fees!

---

## 2. Revenue Model

### 2.1 Phased Pricing Strategy

**Start low to build adoption, gradually increase as the platform becomes normalized and valuable.**

```
RECOMMENDED: Progressive Pricing Strategy
┌─────────────────────────────────────────────────────┐
│ PHASE 1: MARKET ENTRY (Months 1-6)                 │
├─────────────────────────────────────────────────────┤
│ Booking Fee                   $10 per booking       │
│ Goal: Build trust, prove value, low friction       │
│ Target: 250-500 bookings/month                     │
│                                                      │
│ Economics @ 250 bookings/month:                    │
│  • Revenue: $2,500/month                           │
│  • Costs: $233 ($86 fixed + 250 × $0.59)          │
│  • Profit: $2,267/month (91% margin)               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PHASE 2: ADOPTION (Months 7-12)                    │
├─────────────────────────────────────────────────────┤
│ Booking Fee                   $15 per booking       │
│ Goal: Normalize platform use, increase value       │
│ Target: 500-1,000 bookings/month                   │
│                                                      │
│ Economics @ 500 bookings/month:                    │
│  • Revenue: $7,500/month                           │
│  • Costs: $486 ($86 fixed + 500 × $0.80)          │
│  • Profit: $7,014/month (94% margin)               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PHASE 3: NORMALIZATION (Months 13-24)              │
├─────────────────────────────────────────────────────┤
│ Booking Fee                   $20 per booking       │
│ Goal: Establish premium positioning                │
│ Target: 1,000+ bookings/month                      │
│                                                      │
│ Economics @ 1,000 bookings/month:                  │
│  • Revenue: $20,000/month                          │
│  • Costs: $1,256 ($86 fixed + 1,000 × $1.17)      │
│  • Profit: $18,744/month (94% margin)              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PHASE 4: MATURITY (Year 2+)                        │
├─────────────────────────────────────────────────────┤
│ Booking Fee                   $25-30 per booking    │
│ Goal: Maximize revenue, premium platform           │
│ Target: 2,000+ bookings/month                      │
│                                                      │
│ Economics @ 2,000 bookings/month @ $25:            │
│  • Revenue: $50,000/month                          │
│  • Costs: $2,426 ($86 fixed + 2,000 × $1.17)      │
│  • Profit: $47,574/month (95% margin)              │
└─────────────────────────────────────────────────────┘

What client gets for booking fee:
 • Verified booking confirmation
 • Secure calendar scheduling
 • Email/SMS notifications
 • Booking management dashboard
 • Platform support
 • Privacy & discretion
```

### 2.2 Revenue & Profit Analysis by Price Point

**At 250 bookings/month (typical scale):**

| Booking Fee | Platform Revenue | Cost per Booking | Profit per Booking | Monthly Profit | Margin |
| ----------- | ---------------- | ---------------- | ------------------ | -------------- | ------ |
| $10         | $2,500           | $0.93            | $9.07              | $2,267         | 91%    |
| $15         | $3,750           | $1.17            | $13.83             | $3,458         | 92%    |
| $20         | $5,000           | $1.51            | $18.49             | $4,623         | 92%    |
| $25         | $6,250           | $1.59            | $23.41             | $5,853         | 94%    |
| $30         | $7,500           | $1.67            | $28.33             | $7,083         | 94%    |

**At 1,000 bookings/month (growth scale):**

| Booking Fee | Platform Revenue | Cost per Booking | Profit per Booking | Monthly Profit | Margin |
| ----------- | ---------------- | ---------------- | ------------------ | -------------- | ------ |
| $10         | $10,000          | $0.68            | $9.32              | $9,320         | 93%    |
| $15         | $15,000          | $0.89            | $14.11             | $14,110        | 94%    |
| $20         | $20,000          | $1.26            | $18.74             | $18,740        | 94%    |
| $25         | $25,000          | $1.34            | $23.66             | $23,660        | 95%    |
| $30         | $30,000          | $1.42            | $28.58             | $28,580        | 95%    |

**Key Insight:** Even at $10/booking with 250 bookings/month, you're making $2,267/month profit at 91% margins. The low entry price doesn't hurt profitability!

---

## 3. Break-Even Analysis

### 3.1 Break-Even by Pricing Phase

**Phase 1: $10 booking fee**

```
Fixed Costs = $86/month
Variable Cost = $0.59 per booking
Revenue per Booking = $10

Break-Even = $86 / ($10 - $0.59)
Break-Even = $86 / $9.41
Break-Even = 9.1 bookings/month
```

**Result:** Need just **10 bookings/month** to break even

**Phase 2: $15 booking fee**

```
Break-Even = $86 / ($15 - $0.80)
Break-Even = $86 / $14.20
Break-Even = 6.1 bookings/month
```

**Result:** Need just **7 bookings/month** to break even

**Phase 3: $20 booking fee**

```
Break-Even = $86 / ($20 - $1.17)
Break-Even = $86 / $18.83
Break-Even = 4.6 bookings/month
```

**Result:** Need just **5 bookings/month** to break even

**Phase 4: $25-30 booking fee**

```
Break-Even = $86 / ($25 - $1.17)
Break-Even = $86 / $23.83
Break-Even = 3.6 bookings/month
```

**Result:** Need just **4 bookings/month** to break even

### 3.2 Profitability Scenarios - Progressive Pricing Model

**Year 1 Progression (starting at $10/booking):**

| Month | Phase  | Fee | Bookings | Revenue | Costs | Profit  | Margin |
| ----- | ------ | --- | -------- | ------- | ----- | ------- | ------ |
| 1-3   | Launch | $10 | 50       | $500    | $116  | $384    | 77%    |
| 4-6   | Growth | $10 | 250      | $2,500  | $233  | $2,267  | 91%    |
| 7-9   | Scale  | $15 | 500      | $7,500  | $486  | $7,014  | 94%    |
| 10-12 | Expand | $15 | 750      | $11,250 | $686  | $10,564 | 94%    |

**Year 1 Total:** $21,750 revenue, $19,229 profit (88% margin)

**Year 2 Progression (increasing to $20-25):**

| Quarter | Phase     | Fee | Bookings/mo | Revenue | Costs  | Profit  | Margin |
| ------- | --------- | --- | ----------- | ------- | ------ | ------- | ------ |
| Q1      | Normalize | $20 | 1,000       | $20,000 | $1,256 | $18,744 | 94%    |
| Q2      | Optimize  | $20 | 1,500       | $30,000 | $1,841 | $28,159 | 94%    |
| Q3      | Premium   | $25 | 1,800       | $45,000 | $2,247 | $42,753 | 95%    |
| Q4      | Mature    | $25 | 2,000       | $50,000 | $2,426 | $47,574 | 95%    |

**Year 2 Average:** $36,250/month revenue, $34,308/month profit (95% margin)

---

### 3.3 Pricing Increase Strategy

**Why Start Low ($10)?**

1. **Minimize friction** during market entry
2. **Build trust** with both companions and clients
3. **Prove value** before asking for more
4. **Network effects** - more bookings = more data = better platform
5. **Still profitable** - 91% margin even at $10

**Trigger Points for Price Increases:**

```
Increase to $15 when:
├─ 250+ bookings/month sustained for 2 months
├─ 5+ active companions on platform
├─ <5% booking cancellation rate
└─ Positive companion & client feedback

Increase to $20 when:
├─ 500+ bookings/month sustained
├─ 10+ active companions
├─ Platform features mature (reviews, ratings, etc.)
└─ Strong brand recognition in market

Increase to $25+ when:
├─ 1,000+ bookings/month
├─ Premium features added (concierge, VIP, etc.)
├─ Strong market position
└─ Demonstrated ROI for companions
```

**Grandfathering Strategy:**

- Early companions could get lower rates (e.g., keep $10 fee while new joins pay $15)
- Creates loyalty and rewards early adopters
- Eventually sunset after 12 months

Break-Even = $86 / ($75 - $2.47) = 1.19 bookings/month
≈ 2 bookings to break even

```

### 3.3 Profitability Scenarios

**Assuming $50 booking fee:**

| Scenario    | Tenants | Bookings/Tenant/Mo | Total Bookings | Monthly Revenue | Monthly Costs | **Profit** | Margin |
| ----------- | ------- | ------------------ | -------------- | --------------- | ------------- | ---------- | ------ |
| **Minimal** | 1       | 5                  | 5              | $250            | $95           | $155       | 62%    |
| **Small**   | 3       | 10                 | 30             | $1,500          | $143          | $1,357     | 90%    |
| **Medium**  | 5       | 20                 | 100            | $5,000          | $275          | $4,725     | 95%    |
| **Growth**  | 10      | 25                 | 250            | $12,500         | $558          | $11,942    | 96%    |
| **Scale**   | 20      | 30                 | 600            | $30,000         | $1,320        | $28,680    | 96%    |
| **Mature**  | 50      | 40                 | 2,000          | $100,000        | $3,866        | $96,134    | 96%    |

**Key Insight:** 90-96% profit margins! The new model is incredibly efficient.

---

## 4. Detailed Cost per Booking Analysis

### 4.1 Cost Breakdown at Different Scales

**At 10 Bookings/Month (1-2 tenants) - $50 booking fee:**

```

Fixed Infrastructure: $86/month
├─ Per booking: $8.60
Variable per Booking: $1.89
├─ Payment processing: $1.75 (on $50 fee)
├─ Email: $0.03
├─ API/Compute: $0.01
└─ Database: $0.10

TOTAL COST PER BOOKING: $10.49
Platform Revenue: $50.00
PROFIT PER BOOKING: $39.51
Margin: 79%

```

**At 100 Bookings/Month (5-10 tenants) - $50 booking fee:**

```

Fixed Infrastructure: $120/month
├─ Per booking: $1.20
Variable per Booking: $1.89
├─ Payment processing: $1.75
├─ Email: $0.03
├─ API/Compute: $0.01
└─ Database: $0.10

TOTAL COST PER BOOKING: $3.09
Platform Revenue: $50.00
PROFIT PER BOOKING: $46.91
Margin: 94%

```

**At 1,000 Bookings/Month (25-50 tenants) - $50 booking fee:**

```

Fixed Infrastructure: $200/month
├─ Per booking: $0.20
Variable per Booking: $1.89
├─ Payment processing: $1.75
├─ Email: $0.03
├─ API/Compute: $0.01
└─ Database: $0.10

TOTAL COST PER BOOKING: $2.09
Platform Revenue: $50.00
PROFIT PER BOOKING: $47.91
Margin: 96%

```

### 4.2 Key Insights

1. **Dramatically Lower Costs Than Percentage Model**
   - Old model (processing full payment): $15-60 per booking
   - New model (booking fee only): $2-10 per booking
   - **87-97% cost reduction** at scale

2. **Exceptional Gross Margins**
   - 79% margins even at tiny scale (10 bookings)
   - 94-96% margins at scale
   - Among the best unit economics possible for SaaS

3. **Minimal Scaling Costs**
   - Infrastructure costs grow sub-linearly
   - Database and API costs negligible
   - Payment processing trivial (only on $25-75 fees)

4. **Nearly Pure Profit**
   - At scale, you keep ~$48 of every $50 booking fee
   - Break-even is just 2 bookings per month
   - Each additional booking is 96% pure profit

---

## 5. Pricing Strategy Recommendations

### 5.1 Optimal Pricing Model

```

RECOMMENDED: Direct Booking Fee Model
┌─────────────────────────────────────────────────────┐
│ CLIENT PAYS BOOKING FEE │
├─────────────────────────────────────────────────────┤
│ Booking Fee $50 per booking │
│ │
│ What client gets: │
│ • Verified booking confirmation │
│ • Secure scheduling system │
│ • Email notifications │
│ • Booking management │
│ • Customer support │
│ │
│ Session payment: Settled directly with companion │
└─────────────────────────────────────────────────────┘

COMPANION SUBSCRIPTION OPTIONS
┌─────────────────────────────────────────────────────┐
│ OPTION A: SUBSCRIPTION MODEL │
├─────────────────────────────────────────────────────┤
│ Monthly Subscription $199/month │
│ Companion keeps 100% of booking fees │
│ Includes: │
│ • Unlimited bookings │
│ • Custom subdomain │
│ • All platform features │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ OPTION B: REVENUE SHARE MODEL (Recommended) │
├─────────────────────────────────────────────────────┤
│ Platform keeps 60% of booking fee │
│ Companion receives 40% of booking fee │
│ No monthly subscription $0/month │
│ │
│ Example on $50 booking fee: │
│ • Platform: $30 │
│ • Companion: $20 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ OPTION C: HYBRID MODEL │
├─────────────────────────────────────────────────────┤
│ Monthly Subscription $99/month │
│ Platform keeps 30% of booking fee │
│ Companion receives 70% of booking fee │
│ │
│ Example on $50 booking fee: │
│ • Platform: $15 + $99/mo subscription │
│ • Companion: $35 │
└─────────────────────────────────────────────────────┘

```

### 5.2 Revenue Projections by Model

**Option A: Subscription Model ($199/month)**

- Companion with 20 bookings/month:
  - Platform revenue: $199/month
  - Companion receives: 20 × $50 = $1,000 in booking fees
  - Platform profit: $199 - $86 (fixed) - (20 × $1.89) = $75
  - **Profit margin: 38%** (lower but predictable)

**Option B: Revenue Share Model (60/40 split)**

- 20 bookings/month @ $50 each:
  - Total booking fees: $1,000
  - Platform revenue: $600 (60%)
  - Companion revenue: $400 (40%)
  - Platform costs: $86 + (20 × $1.89) = $124
  - Platform profit: $600 - $124 = $476
  - **Profit margin: 79%** (recommended)

**Option C: Hybrid Model ($99/mo + 30% of booking fees)**

- 20 bookings/month @ $50 each:
  - Subscription: $99
  - Booking fees: 20 × $50 × 30% = $300
  - Total platform revenue: $399
  - Platform costs: $124
  - Platform profit: $275
  - **Profit margin: 69%** (balanced approach)

---

## 6. Sensitivity Analysis

### 6.1 Impact of Booking Value

| Avg Booking | 5% Fee Revenue | Cost   | Profit | Margin |
| ----------- | -------------- | ------ | ------ | ------ |
| $300        | $15            | $9.14  | $5.86  | 39%    |
| $500        | $25            | $15.14 | $9.86  | 39%    |
| $750        | $37.50         | $22.14 | $15.36 | 41%    |
| $1,000      | $50            | $29.14 | $20.86 | 42%    |
| $1,500      | $75            | $43.64 | $31.36 | 42%    |
| $2,000      | $100           | $58.14 | $41.86 | 42%    |

**Insight:** Margins improve slightly with higher booking values, but remain strong across all ranges.

### 6.2 Impact of Payment Processing Fees

| Processor | Fee Structure | Cost on $1,000 | Annual Savings (1,000 bookings) |
| --------- | ------------- | -------------- | ------------------------------- |
| Stripe    | 2.9% + $0.30  | $29.30         | Baseline                        |
| Square    | 2.6% + $0.10  | $26.10         | $3,200                          |
| PayPal    | 2.9% + $0.30  | $29.30         | $0                              |
| Custom    | 1.5% + $0.15  | $15.15         | $14,150                         |

**Insight:** Negotiating lower payment processing rates has significant impact at scale.

### 6.3 Impact of Scale

```

Platform Growth Projection (Monthly)

Year 1:
Quarter 1: 5 tenants, 100 bookings → $8,000 revenue, $6,410 profit
Quarter 2: 10 tenants, 250 bookings → $20,000 revenue, $16,139 profit
Quarter 3: 15 tenants, 450 bookings → $36,000 revenue, $29,690 profit
Quarter 4: 20 tenants, 600 bookings → $48,000 revenue, $38,840 profit

Year 1 Total: $134,000 revenue, $91,079 profit (68% margin)

Year 2:
Quarter 1: 30 tenants, 1,000 bookings → $80,000 revenue, $64,644 profit
Quarter 2: 40 tenants, 1,500 bookings → $120,000 revenue, $97,144 profit
Quarter 3: 45 tenants, 1,800 bookings → $144,000 revenue, $116,644 profit
Quarter 4: 50 tenants, 2,000 bookings → $160,000 revenue, $129,644 profit

Year 2 Total: $504,000 revenue, $408,076 profit (81% margin)

```

---

## 7. Key Performance Indicators (KPIs)

### 7.1 Unit Economics KPIs

```

Primary Metrics:
├─ Cost per Booking (target: <$20)
├─ Revenue per Booking (target: >$50)
├─ Gross Margin per Booking (target: >70%)
├─ Customer Acquisition Cost (CAC)
├─ Lifetime Value (LTV)
└─ LTV/CAC Ratio (target: >3:1)

Operational Metrics:
├─ Average Booking Value
├─ Bookings per Tenant per Month
├─ Tenant Churn Rate
├─ Monthly Recurring Revenue (MRR)
├─ Annual Recurring Revenue (ARR)
└─ Revenue per Tenant

```

### 7.2 Success Metrics by Stage

**Validation Stage (Months 1-3):**

- Break-even: ✅ 2 bookings/month
- Target: 3-5 tenants, 50-100 bookings/month
- Revenue target: $4,000-8,000/month
- Focus: Product-market fit

**Growth Stage (Months 4-12):**

- Target: 10-20 tenants, 250-600 bookings/month
- Revenue target: $20,000-48,000/month
- Focus: Tenant acquisition, feature development

**Scale Stage (Year 2+):**

- Target: 50+ tenants, 2,000+ bookings/month
- Revenue target: $160,000+/month
- Focus: Operational excellence, market expansion

---

## 8. Risk Factors & Mitigation

### 8.1 Cost Risks

| Risk                                    | Impact        | Mitigation                                |
| --------------------------------------- | ------------- | ----------------------------------------- |
| Payment processing fees increase        | -5-10% margin | Multi-processor support, negotiate rates  |
| Infrastructure costs scale unexpectedly | +$50-200/mo   | Optimize queries, implement caching       |
| Email costs spike                       | +$20-50/mo    | Use transactional email efficiently       |
| Database costs increase                 | +$30-100/mo   | Implement data archiving, optimize schema |

### 8.2 Revenue Risks

| Risk                               | Impact             | Mitigation                                   |
| ---------------------------------- | ------------------ | -------------------------------------------- |
| Low tenant adoption                | Delayed break-even | Strong onboarding, tenant success team       |
| Booking volume lower than expected | -30-50% revenue    | Flexible pricing, tenant marketing support   |
| Price resistance                   | Slower growth      | Value-based pricing, clear ROI demonstration |
| Tenant churn                       | -10-20% MRR        | Excellent support, feature development       |

---

## 9. Recommendations

### 9.1 Immediate Actions

1. **Implement Hybrid Pricing Model**
   - $99/month base + 5% transaction fee
   - Ensures revenue even with low booking volume
   - Covers fixed costs with first tenant

2. **Optimize Payment Processing**
   - Research processor with lowest fees
   - Consider Stripe Connect for multi-tenant
   - Negotiate enterprise rates at scale

3. **Monitor Unit Economics Closely**
   - Track cost per booking weekly
   - Alert if costs exceed $20/booking
   - Optimize database queries and API calls

4. **Focus on Tenant Success**
   - Each active tenant is highly profitable
   - Low CAC, high LTV model
   - Invest in onboarding and support

### 9.2 Scaling Strategy

```

Phase 1: Prove Unit Economics (0-10 tenants)
├─ Validate $15-20 cost per booking
├─ Confirm 70%+ gross margins
├─ Establish baseline metrics
└─ Achieve $10,000/month revenue

Phase 2: Scale Infrastructure (10-50 tenants)
├─ Optimize for lower cost per booking
├─ Implement caching and CDN
├─ Automate tenant onboarding
└─ Achieve $100,000/month revenue

Phase 3: Market Expansion (50+ tenants)
├─ Launch agency tier
├─ Add enterprise features
├─ Explore international markets
└─ Achieve $500,000/month revenue

```

---

## 10. Conclusion

### Key Takeaways

1. **Extremely Favorable Unit Economics**
   - Break-even at just 2 bookings/month
   - 70-81% gross margins across all scales
   - Minimal marginal costs for growth

2. **Payment Processing is the Lever**
   - 90%+ of variable costs
   - Negotiating rates is highest-impact optimization
   - Each 0.5% reduction = $5 per $1,000 booking

3. **Platform is Highly Scalable**
   - Fixed costs grow sub-linearly
   - Infrastructure costs <5% of revenue at scale
   - Software costs negligible per booking

4. **Strong Path to Profitability**
   - Profitable from first month with 5+ bookings
   - $100K+ monthly profit achievable with 50 tenants
   - Margins improve with scale

### Financial Projections Summary

| Metric           | Month 1 | Month 6 | Month 12 | Month 24 |
| ---------------- | ------- | ------- | -------- | -------- |
| Tenants          | 3       | 10      | 20       | 50       |
| Monthly Bookings | 30      | 250     | 600      | 2,000    |
| Monthly Revenue  | $2,400  | $20,000 | $48,000  | $160,000 |
| Monthly Costs    | $530    | $3,861  | $9,160   | $30,356  |
| Monthly Profit   | $1,870  | $16,139 | $38,840  | $129,644 |
| Profit Margin    | 78%     | 81%     | 81%      | 81%      |

**The platform has exceptional unit economics with a clear path to profitability and scale.**

---

**Last Updated:** November 7, 2025
**Model Version:** 1.0
**Assumptions:** Based on current DigitalOcean infrastructure, Stripe payment processing, and 8% platform fee

---

## 10. Conclusion

### Key Takeaways

1. **Exceptional Unit Economics**
   - Cost per booking: **$2-10** (vs $15-60 with percentage model)
   - Break-even at just **2 bookings/month**
   - **90-96% gross margins** across all scales
   - Among the best unit economics possible for SaaS

2. **The Booking Fee Model is Superior**
   - Processing only $25-50 fees (not $500-2000 payments) slashes costs by 87-97%
   - Payment processing becomes trivial ($1.75 vs $15-60)
   - Margins improve from 70-80% to 90-96%
   - Simpler compliance and risk management

3. **Platform is Extremely Scalable**
   - Fixed costs <5% of revenue at 100+ bookings
   - Infrastructure costs negligible per booking
   - Software/API costs essentially zero
   - Each marginal booking is 96% pure profit

4. **Path to Profitability is Immediate**
   - Profitable from day 1 with just 2 bookings
   - $4,700+ monthly profit at 100 bookings
   - $96,000+ monthly profit at 2,000 bookings
   - Margins consistently 90%+

5. **Revenue Share Model Recommended**
   - 60/40 split (platform/companion) on booking fees
   - No monthly subscription risk
   - Aligns incentives (more bookings = more revenue for both)
   - Fair value exchange (platform provides leads, companion provides service)

### Financial Projections Summary (60/40 Revenue Share Model)

**Assuming $50 booking fee, Platform keeps 60% ($30), Companion gets 40% ($20):**

| Metric | Month 1 | Month 6 | Month 12 | Month 24 |
|--------|---------|---------|----------|----------|
| Tenants | 3 | 10 | 20 | 50 |
| Monthly Bookings | 30 | 250 | 600 | 2,000 |
| Total Booking Fees | $1,500 | $12,500 | $30,000 | $100,000 |
| Platform Revenue (60%) | $900 | $7,500 | $18,000 | $60,000 |
| Monthly Costs | $143 | $558 | $1,320 | $3,866 |
| Monthly Profit | $757 | $6,942 | $16,680 | $56,134 |
| Profit Margin | 84% | 93% | 93% | 94% |

### Companion Economics (40% of booking fees)

| Monthly Bookings | Companion Receives | Annual Booking Revenue |
|------------------|-------------------|------------------------|
| 10 | $200 | $2,400 |
| 20 | $400 | $4,800 |
| 30 | $600 | $7,200 |
| 40 | $800 | $9,600 |

Plus they collect the full session fees directly (e.g., $500-2000 per session)

**The booking fee model delivers exceptional economics for both the platform and companions.**

---

**Last Updated:** November 7, 2025
**Model Version:** 2.0 (Updated for booking fee model)
**Business Model:** Platform charges clients $50 booking fee; session payment settled directly between client and companion
```

---

## 11. Strategic Rationale for Low Initial Pricing

### Why Start at $10 Instead of $25-50?

**Market Entry Advantages:**

1. **Minimal Resistance** - $10 is "impulse buy" territory for most clients
2. **Companion Buy-In** - Easy to explain value prop (only $10 per booking!)
3. **Competitive Moat** - Hard for competitors to undercut
4. **Volume Driver** - Lower price = more bookings = better data/network effects
5. **Still Highly Profitable** - 91% margins even at $10

**Psychological Pricing:**

- $10 feels like "nominal" or "service fee"
- $25-50 starts feeling like "commission" or "significant cost"
- Easier to justify to clients initially

**Growth Trajectory:**
`
Month 1-6: Build the habit at $10
Clients get used to booking through platform
Companions see value in lead generation
Platform becomes normalized
250+ bookings/month = $2,267 profit (sustainable)

Month 7-12: Increase to $15 (50% increase)
Announce "due to added features" (reviews, better UX, etc.)
Existing users already hooked
500 bookings/month = $7,014 profit
Minimal churn risk

Month 13+: Scale to $20-25
Platform is established standard
Premium positioning
1,000+ bookings = $18,744+ profit
Market can support higher pricing
`

### Comparison: $10 Start vs $50 Start

| Metric                  | Start at $10 | Start at $50    |
| ----------------------- | ------------ | --------------- |
| Break-even bookings     | 10/month     | 2/month         |
| Likely Month 1 volume   | 50-100       | 10-20           |
| Month 1 profit          | $384-918     | $863-1,722      |
| Month 6 volume          | 250+         | 50-100          |
| Month 6 profit          | $2,267+      | $2,306-4,611    |
| **Year 1 adoption**     | **High**     | **Slow**        |
| **Year 1 total profit** | **~$90,000** | **~$40,000**    |
| **Risk level**          | **Low**      | **Medium-High** |

**Conclusion:** Starting low and increasing wins on total profit because volume >> price in early stages.

### Price Elasticity Considerations

At $10/booking on a $500 session = **2% overhead**
At $50/booking on a $500 session = **10% overhead**

For clients:

- 2% = "barely noticeable"
- 10% = "starts to feel expensive"

**The $10 strategy maximizes volume while maintaining exceptional profitability.**

---
