# Task: phase9-new-features

## Agent: full-stack-developer

## Work Summary

Created 2 new feature components and integrated them into the OmniSchool platform:

### 1. ProgressHistoryChart (`/src/components/omnischool/ProgressHistoryChart.tsx`)
- Recharts AreaChart with two areas: Semester 1 (red #B91C1C) and Semester 2 (gold #D4A843)
- Toggle between 7-day and 30-day views
- Custom tooltip with RTL Arabic labels
- Generates simulated data when no studySessions exist (with notice)
- Derives real data from studySessions when available
- Summary stat cards for each semester
- Glass morphism card styling with card-ornament
- Animated entrance with framer-motion
- Dynamically imported in StudentDashboard (ssr: false)

### 2. SubjectResourceLibrary (`/src/components/omnischool/SubjectResourceLibrary.tsx`)
- Grid layout showing all 24 subjects organized by semester
- Each card: name, code, category badge, status indicator (color-coded dot), progress slider, "فتح المحتوى" button
- Search bar with name/code/category search
- Filter by semester (1/2/all) and category chips
- Responsive grid: 1→2→3→4 columns
- Empty state with clear filters button
- Summary stats bar (total, completed, in progress)
- Glass morphism with card-ornament, RTL Arabic

### 3. Integration Changes
- `types.ts`: Added "resources" to ViewType
- `Header.tsx`: Added Library icon import + "مكتبة الموارد" nav link
- `StudentDashboard.tsx`: Added dynamic import + ProgressHistoryChart after Streak/SemesterComparison section
- `page.tsx`: Added SubjectResourceLibrary import + "resources" view in ViewRenderer

### Verification
- `bun run lint` passes with zero errors
- Dev server running correctly, all routes return 200
