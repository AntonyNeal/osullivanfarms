# Farm Advisor AI Research Knowledge Base

## Overview

This document contains key research findings for the O'Sullivan Farms AI Farm Advisor system. The AI assistant has direct access to this knowledge when answering questions.

## Key Topics

### 1. Sheep Breeding Management

- **Breeding Cycle Stages**: Joining → Scanning → Pre-lambing → Lambing → Marking → Weaning
- **Critical Decision Points**: Stage transitions, mob movements, feed allocation
- **Industry Benchmarks**:
  - Scanning: 150% target (excellent performance)
  - Marking: 130% target (good performance)
  - Weaning: 125% target (successful outcome)
  - Ram ratio: 1:50 (rams to ewes)

### 2. Performance Monitoring

- **Key Metrics**:
  - Ewes joined: Base breeding population
  - Scanning percentage: Pregnancy detection rate
  - Marking percentage: Lambs surviving to marking
  - Weaning percentage: Lambs surviving to weaning
  - Mortality rates: Stage-by-stage losses

### 3. Mob Management Best Practices

- **Mob Sizing**: Optimal mob sizes for monitoring and management
- **Stage-Based Grouping**: Group ewes by breeding stage for targeted care
- **Location Management**: Strategic paddock allocation based on stage and nutrition needs
- **Feed Planning**: Match feed quality and quantity to breeding stage requirements

### 4. Data-Driven Decision Making

- **KPI Tracking**: Continuous monitoring of key performance indicators
- **Trend Analysis**: Historical comparisons for performance improvement
- **Benchmarking**: Compare against industry standards and farm history
- **Predictive Insights**: Anticipate issues based on data patterns

### 5. Australian Sheep Farming Context

- **Location**: Echuca, Victoria - temperate climate
- **Seasonal Considerations**:
  - Joining: Typically autumn (March-May)
  - Lambing: Winter/spring (August-October)
  - Weaning: Spring/summer (November-January)
- **Regional Challenges**: Drought management, pasture quality, parasite control

### 6. Technology Integration

- **Database Management**: PostgreSQL for comprehensive farm records
- **Real-time Monitoring**: Live KPI dashboards and alerts
- **AI-Assisted Advice**: Intelligent recommendations based on current farm state
- **Automated Reporting**: Performance summaries and trend analysis

### 7. Decision Support Framework

- **Assessment**: Analyze current farm state and mob performance
- **Recommendation**: Provide evidence-based suggestions
- **Validation**: Verify recommendations against benchmarks and best practices
- **Confirmation**: Require user approval for data modifications
- **Follow-up**: Track outcomes and adjust future recommendations

### 8. Farm Advisor Capabilities

- **Read Operations** (Immediate):
  - Query mob details and performance metrics
  - Generate farm-wide statistics
  - Analyze stage distributions
  - Review historical records
- **Write Operations** (Require Confirmation):
  - Update mob breeding stages
  - Change mob locations
  - Add notes and observations
- **Advisory Functions**:
  - Interpret KPIs and identify issues
  - Recommend stage transitions
  - Suggest mob management improvements
  - Provide breeding cycle guidance

### 9. Safety and Data Integrity

- **Confirmation Workflow**: All write operations require explicit user approval
- **Audit Trail**: Maintain complete history of changes
- **Validation**: Verify data consistency before modifications
- **Scope Limits**: Stay within farm management domain (no medical/legal/financial advice)

### 10. Practical Farm Advice

- **Question Understanding**: Interpret farmer questions in context
- **Contextual Responses**: Consider current farm state in all answers
- **Actionable Recommendations**: Provide clear, implementable guidance
- **Follow-up Suggestions**: Anticipate next steps and related concerns
- **Knowledge Application**: Reference research and benchmarks appropriately

## Quick Reference

### Breeding Stage Sequence

1. **Joining** - Rams introduced to ewes
2. **Scanning** - Pregnancy detection (typically 6-8 weeks post-joining)
3. **Pre-lambing** - Final preparation before birth
4. **Lambing** - Birth period (intensive monitoring)
5. **Marking** - Lamb identification and processing
6. **Weaning** - Lambs separated from ewes

### Performance Thresholds

- **Excellent**: Scanning >150%, Marking >130%, Weaning >125%
- **Good**: Scanning 140-150%, Marking 120-130%, Weaning 115-125%
- **Needs Improvement**: Below good thresholds
- **Critical**: Scanning <130%, Marking <110%, Weaning <105%

### Common Farm Questions

- "What's the performance of my mobs?"
- "When should I move mobs to the next stage?"
- "How do my results compare to benchmarks?"
- "Which mob needs attention?"
- "What's the best feeding strategy for this stage?"

## Integration Notes

- This knowledge is loaded at system startup
- AI assistant has immediate access without additional queries
- Knowledge map indexes key topics for fast retrieval
- Updates to this file require system restart to take effect
