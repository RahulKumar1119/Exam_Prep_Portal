# Syllabus Tracking Fix - Bugfix Design

## Overview

The JAIIB Exam Prep Portal dashboard identifies weak/strong areas only at the `paper_name` level (e.g., "IE & IFS") because there is no structured syllabus mapping between question topics and the official IIBF syllabus hierarchy. The fix introduces a shared syllabus module that both the practice and dashboard lambdas can use, updates the dashboard to perform granular topic-level analysis by mapping question `topic` fields to the syllabus structure, and adds a "Recommended Practice Areas" feature that identifies uncovered or underperforming syllabus topics.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — when a user with completed sessions requests weak/strong areas, the system returns paper-level names instead of granular syllabus topics
- **Property (P)**: The desired behavior — weak/strong areas are identified at the topic level aligned with the official IIBF syllabus modules, and recommended practice areas are provided
- **Preservation**: Existing overall metrics (overall_score, total_sessions, average_score, total_study_time), paper-level performance, trend data, and default empty responses for users with no sessions must remain unchanged
- **PAPER_SYLLABUS**: The dictionary in `backend/practice/lambda_function.py` that defines modules and topics for each paper (IE & IFS, PPB, AFB, RBWM)
- **topic_accuracy**: The per-topic accuracy percentage computed from question-level results in completed sessions
- **get_dashboard_data()**: The main function in `backend/dashboard/lambda_function.py` that computes all dashboard metrics in a single DynamoDB query

## Bug Details

### Bug Condition

The bug manifests when a user who has completed practice sessions views the dashboard. The `get_weak_areas()` and `get_strong_areas()` standalone functions use `paper_name` as the grouping key. The `get_dashboard_data()` function attempts topic-level analysis from question data but has no syllabus structure to validate or normalize topic strings, and falls back to paper-level when no topic data is available. There is no "Recommended Practice Areas" feature at all.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DashboardRequest
  OUTPUT: boolean
  
  RETURN input.user_has_completed_sessions = true
         AND input.analysis_type IN ('weak_areas', 'strong_areas', 'recommended_areas')
         AND (
           weak_areas_are_paper_level(input.user_id)
           OR strong_areas_are_paper_level(input.user_id)
           OR recommended_areas_not_provided(input.user_id)
         )
END FUNCTION
```

### Examples

- User completes 5 sessions in "IE & IFS" with varying topic performance → Dashboard shows "IE & IFS" as weak area instead of "Indian Economy overview" or "Money supply and monetary policy"
- User scores 90% on "Banking Regulation Act 1949" questions but 30% on "SEBI" questions → Both are lumped under "IE & IFS" paper-level, masking the specific weakness in SEBI
- User has never attempted any "Module D - Financial Products and Services" topics → No recommendation is shown because the system doesn't know what topics exist in the syllabus
- User has inconsistent topic strings ("Banking Regulation" vs "Banking Regulation Act 1949") → These are treated as separate topics instead of being normalized to the syllabus entry

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Users with no completed sessions receive default empty/zero values for all dashboard fields
- Overall performance metrics (overall_score, total_sessions, average_score, total_study_time, last_session_date) continue to be computed correctly from completed sessions
- Paper-level performance data (per-paper average scores and session counts) continues to be returned
- Trend data continues to return the last 10 completed sessions sorted by submission date
- All existing papers (AFB, AFM, IE & IFS, PPB, RBWM) continue to work in practice session generation
- The scores table `topic_breakdown` Map format remains accepted and stored

**Scope:**
All inputs that do NOT involve weak_areas, strong_areas, or recommended_areas computation should be completely unaffected by this fix. This includes:
- Overall metrics calculation
- Paper performance aggregation
- Trend data generation
- Practice session creation and submission
- User authentication and routing

## Hypothesized Root Cause

Based on the bug description, the most likely issues are:

1. **No Shared Syllabus Module**: The `PAPER_SYLLABUS` dict exists only in `backend/practice/lambda_function.py` and is not accessible to the dashboard lambda. The dashboard has no reference syllabus to map topics against.

2. **Paper-Level Grouping in Standalone Functions**: `get_weak_areas()` and `get_strong_areas()` explicitly use `session.get('paper_name', 'General')` as the grouping key, never looking at individual question topics.

3. **No Topic Normalization**: The `get_dashboard_data()` function reads `q.get('topic', 'General')` from questions but has no fuzzy matching or normalization logic to map free-form topic strings to canonical syllabus entries.

4. **Fallback to Paper-Level**: When `get_dashboard_data()` finds no topic-level data (because `user_answers` is empty or questions lack topic fields), it falls back to paper-level weak/strong areas, which is the same broken behavior.

5. **No Coverage Gap Detection**: There is no logic to compare attempted topics against the full syllabus to identify topics the user has never practiced.

## Correctness Properties

Property 1: Bug Condition - Granular Topic-Level Weak/Strong Areas

_For any_ dashboard request where the user has completed sessions containing questions with topic fields, the fixed `get_dashboard_data()` function SHALL return weak_areas and strong_areas as lists of syllabus-aligned topic names (not paper names), where each topic is mapped to its canonical syllabus entry via fuzzy matching against the `PAPER_SYLLABUS` structure.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Unchanged Metrics and Default Behavior

_For any_ dashboard request where the user has no completed sessions, OR for any computation of overall_score, total_sessions, average_score, total_study_time, paper_performance, or trend_data, the fixed function SHALL produce the same result as the original function, preserving all existing metric calculations and default empty responses.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

Property 3: Bug Condition - Recommended Practice Areas

_For any_ dashboard request where the user has completed sessions, the fixed `get_dashboard_data()` function SHALL return a `recommended_areas` list identifying syllabus topics that the user has either never attempted or has accuracy below the weak threshold, prioritized by coverage gaps (unattempted topics first, then lowest-performing topics).

**Validates: Requirements 2.4**

Property 4: Bug Condition - Topic Normalization

_For any_ question with a `topic` field, the fixed system SHALL map that topic string to the closest matching canonical syllabus entry using fuzzy/substring matching, ensuring that variations like "Banking Regulation" and "Banking Regulation Act 1949" resolve to the same syllabus topic.

**Validates: Requirements 2.3, 2.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `backend/shared/syllabus.py` (NEW)

**Purpose**: Shared syllabus module accessible to both practice and dashboard lambdas

**Specific Changes**:
1. **Extract PAPER_SYLLABUS**: Move the syllabus dictionary from `backend/practice/lambda_function.py` into a shared module that both lambdas can import
2. **Add IE & IFS detailed syllabus**: Incorporate the full Module A-D topic list from the user's input (46 topics total) as the canonical reference
3. **Add topic normalization function**: Implement `normalize_topic(topic_str, paper_name)` that uses substring/fuzzy matching to map free-form topic strings to canonical syllabus entries
4. **Add coverage analysis function**: Implement `get_coverage_gaps(attempted_topics, paper_name)` that returns syllabus topics not yet attempted

---

**File**: `backend/dashboard/lambda_function.py`

**Function**: `get_dashboard_data()`

**Specific Changes**:
1. **Import shared syllabus**: Import `PAPER_SYLLABUS`, `normalize_topic`, and `get_coverage_gaps` from the shared module
2. **Normalize topics during analysis**: When iterating over questions in completed sessions, normalize each `q.get('topic')` to its canonical syllabus entry before accumulating accuracy stats
3. **Update weak_areas logic**: Replace paper-level fallback with syllabus-topic-level analysis using normalized topic accuracy data
4. **Update strong_areas logic**: Same as weak_areas but for high-performing topics
5. **Add recommended_areas**: After computing topic accuracy, call `get_coverage_gaps()` to identify unattempted topics, then combine with low-accuracy topics to produce a prioritized recommendation list
6. **Add module context**: Include the module name (e.g., "Module A - Indian Economic Architecture") alongside each topic in weak/strong/recommended areas for better UI context
7. **Deprecate standalone functions**: Mark `get_weak_areas()` and `get_strong_areas()` as deprecated since `get_dashboard_data()` now handles this correctly

---

**File**: `backend/practice/lambda_function.py`

**Specific Changes**:
1. **Import from shared module**: Replace inline `PAPER_SYLLABUS` with import from `backend/shared/syllabus.py`
2. **Keep backward compatibility**: Ensure the practice lambda continues to work identically with the shared syllabus data

---

**File**: `backend/shared/__init__.py` (NEW)

**Purpose**: Make the shared directory a Python package

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that call `get_dashboard_data()` with mock session data containing question-level topic information and verify that weak/strong areas are returned at paper-level (demonstrating the bug). Run these tests on the UNFIXED code to observe the defective behavior.

**Test Cases**:
1. **Paper-Level Weak Areas Test**: Create sessions with varied topic performance within one paper → verify weak_areas returns paper name not topic names (will demonstrate bug on unfixed code)
2. **No Recommended Areas Test**: Create sessions that don't cover all syllabus topics → verify recommended_areas is absent or empty (will demonstrate bug on unfixed code)
3. **Topic Normalization Test**: Create sessions with inconsistent topic strings → verify they are treated as separate entries (will demonstrate bug on unfixed code)
4. **Fallback Behavior Test**: Create sessions without question-level topic data → verify system falls back to paper-level (will demonstrate bug on unfixed code)

**Expected Counterexamples**:
- `weak_areas` contains "IE & IFS" instead of specific topics like "SEBI" or "Money supply and monetary policy"
- `recommended_areas` key is missing from the response entirely
- Topics like "Banking Regulation" and "Banking Regulation Act 1949" are counted separately

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := get_dashboard_data_fixed(input.user_id)
  ASSERT result.weak_areas contains syllabus-aligned topic names (not paper names)
  ASSERT result.strong_areas contains syllabus-aligned topic names (not paper names)
  ASSERT result.recommended_areas is not empty when coverage gaps exist
  ASSERT all topics in weak_areas exist in PAPER_SYLLABUS
  ASSERT all topics in strong_areas exist in PAPER_SYLLABUS
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT get_dashboard_data_original(input) = get_dashboard_data_fixed(input)
  // Specifically:
  // - metrics (overall_score, total_sessions, average_score, total_study_time) unchanged
  // - paper_performance unchanged
  // - trend_data unchanged
  // - empty user returns same defaults
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many session configurations automatically across the input domain
- It catches edge cases with empty sessions, single questions, or missing fields
- It provides strong guarantees that metric calculations are unchanged for all inputs

**Test Plan**: Observe behavior on UNFIXED code first for overall metrics, paper performance, and trend data, then write property-based tests capturing that behavior to ensure the fix doesn't regress these.

**Test Cases**:
1. **Empty User Preservation**: Verify users with no sessions continue to get default zero/empty values after fix
2. **Overall Metrics Preservation**: Verify overall_score, total_sessions, average_score, total_study_time calculations remain identical
3. **Paper Performance Preservation**: Verify per-paper average scores and session counts remain identical
4. **Trend Data Preservation**: Verify last 10 sessions sorted by date remain identical

### Unit Tests

- Test `normalize_topic()` with exact matches, substring matches, and no-match cases
- Test `get_coverage_gaps()` with partial coverage, full coverage, and no coverage
- Test weak_areas computation with various topic accuracy distributions
- Test strong_areas computation with various topic accuracy distributions
- Test recommended_areas prioritization (unattempted first, then low-accuracy)
- Test edge cases: sessions with no questions, questions with no topic field, empty user_answers

### Property-Based Tests

- Generate random sets of completed sessions with random topic strings and verify weak_areas always contains valid syllabus topics
- Generate random topic accuracy distributions and verify the weak/strong threshold logic is consistent
- Generate random session configurations and verify overall metrics (score, time, count) are unchanged from the original computation
- Generate random syllabus subsets as "attempted" and verify coverage gaps are correctly identified

### Integration Tests

- Test full dashboard flow: create sessions via practice lambda → submit answers → verify dashboard returns granular topic data
- Test that practice lambda continues to generate questions correctly after syllabus module extraction
- Test dashboard response format is backward-compatible with frontend expectations (weak_areas still a list of strings)
