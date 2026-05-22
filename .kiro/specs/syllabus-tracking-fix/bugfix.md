# Bugfix Requirements Document

## Introduction

The JAIIB Exam Prep Portal dashboard currently identifies weak and strong areas only at the `paper_name` level (e.g., "IE & IFS", "AFB") rather than at the granular topic/subtopic level. This is because there is no structured syllabus database that maps the official IIBF syllabus hierarchy (Modules → Topics → Subtopics). Without this structure, the system cannot provide meaningful, actionable insights to users about which specific topics they need to improve on or which areas they excel in. Additionally, there is no "Recommended Practice Areas" functionality to guide users toward topics they haven't covered or are underperforming in.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `get_weak_areas()` is called for a user THEN the system identifies weak areas using `paper_name` (e.g., "IE & IFS") instead of granular syllabus topics, providing no actionable detail about which specific topics within a paper are weak

1.2 WHEN `get_strong_areas()` is called for a user THEN the system identifies strong areas using `paper_name` instead of granular syllabus topics, failing to show which specific topics the user has mastered

1.3 WHEN `get_dashboard_data()` performs topic-level analysis THEN the system relies on arbitrary `topic` strings stored with individual questions that may not align with the official IIBF syllabus structure, producing inconsistent and unreliable topic categorization

1.4 WHEN a user views the dashboard THEN the system provides no "Recommended Practice Areas" because there is no syllabus structure to identify uncovered or underperforming topics

1.5 WHEN questions are stored in the question bank THEN the `topic` field contains free-form text that is not validated against any official syllabus taxonomy, leading to inconsistent topic naming (e.g., "Banking Regulation" vs "Banking Regulations" vs "RBI Regulations")

### Expected Behavior (Correct)

2.1 WHEN `get_weak_areas()` is called for a user THEN the system SHALL identify weak areas at the topic/subtopic level by comparing user performance against the structured IE & IFS syllabus hierarchy (Modules A-D, their topics, and subtopics)

2.2 WHEN `get_strong_areas()` is called for a user THEN the system SHALL identify strong areas at the topic/subtopic level by comparing user performance against the structured syllabus hierarchy

2.3 WHEN `get_dashboard_data()` performs topic-level analysis THEN the system SHALL map question topics to the official IIBF syllabus structure, ensuring consistent categorization aligned with Modules A-D and their defined topics/subtopics

2.4 WHEN a user views the dashboard THEN the system SHALL provide "Recommended Practice Areas" by identifying syllabus topics that the user has not attempted or has low performance in, prioritized by coverage gaps

2.5 WHEN questions are stored in the question bank THEN the `topic` field SHALL reference a valid topic from the structured syllabus database, ensuring consistent and standardized topic classification

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user has no completed sessions THEN the system SHALL CONTINUE TO return empty/default values for weak areas, strong areas, and dashboard metrics

3.2 WHEN the dashboard calculates overall performance metrics (overall_score, total_sessions, average_score, total_study_time) THEN the system SHALL CONTINUE TO compute these correctly from completed sessions

3.3 WHEN the dashboard generates paper-level performance data THEN the system SHALL CONTINUE TO return per-paper average scores and session counts

3.4 WHEN the dashboard generates trend data THEN the system SHALL CONTINUE TO return the last 10 completed sessions sorted by submission date

3.5 WHEN practice sessions are created and questions are fetched THEN the system SHALL CONTINUE TO support all existing papers (AFB, AFM, IE & IFS, PPB, RBWM) without disruption

3.6 WHEN the scores table stores `topic_breakdown` data THEN the system SHALL CONTINUE TO accept and store this data in the existing Map format

---

## Bug Condition (Formal)

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type DashboardRequest
  OUTPUT: boolean
  
  // The bug triggers when the system attempts to identify weak/strong areas
  // or recommend practice areas for a user who has completed sessions,
  // because there is no syllabus structure to provide granular topic mapping
  RETURN X.has_completed_sessions = true 
         AND X.analysis_type IN ('weak_areas', 'strong_areas', 'recommended_areas')
END FUNCTION
```

```pascal
// Property: Fix Checking - Granular Topic Analysis
FOR ALL X WHERE isBugCondition(X) DO
  result ← get_dashboard_data'(X.user_id)
  ASSERT result.weak_areas contains syllabus-aligned topics (not just paper names)
  ASSERT result.strong_areas contains syllabus-aligned topics (not just paper names)
  ASSERT result.recommended_areas is not empty when coverage gaps exist
END FOR
```

```pascal
// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
  // Users with no sessions still get default empty responses
  // Overall metrics, paper performance, and trend data remain unchanged
END FOR
```
