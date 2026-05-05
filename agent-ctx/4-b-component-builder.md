# Task 4-b: ProgressCircle & SubjectCard Components

## Agent: component-builder
## Status: Completed

## Work Done

Created two React components for the OmniSchool educational platform:

### 1. ProgressCircle (`/src/components/omnischool/ProgressCircle.tsx`)
- SVG circular progress ring with framer-motion animated fill
- Props: progress (0-100), size (80), strokeWidth (6), color (red)
- Smooth strokeDashoffset animation on mount
- Percentage text in center with scale+fade entrance
- RTL-safe number display with `ltr-content` class
- Background track in muted color, progress arc in custom color

### 2. SubjectCard (`/src/components/omnischool/SubjectCard.tsx`)
- Glass-morphism card using `glass card-omni glow-hover` CSS classes
- Color accent bar on right side (RTL) based on subject color
- SubjectIcon component maps 19 icon names to lucide-react components
- Category color mapping for 14 Arabic subject categories
- Status badges: مكتملة (green), قيد التقدم (gold), لم تبدأ (gray)
- Shared badge (مشترك) in gold when isShared
- Semester badge (السداسي 1/2)
- Embedded ProgressCircle (56px, 5px stroke)
- framer-motion entrance animation + hover/tap interactions
- Fully responsive design

## Key Decisions
- Defined `SubjectIcon` as a separate component outside `SubjectCard` render to satisfy ESLint `react-hooks/static-components` rule
- Used category-based color fallback when subject.color is not provided
- Clamped progress values to 0-100 range in ProgressCircle

## Lint Status
- ESLint passes with no errors
