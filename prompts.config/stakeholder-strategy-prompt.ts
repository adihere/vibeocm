/**
 * Prompt template for generating a Stakeholder Engagement Strategy
 * Optimized for small language models (e.g., Mistral Small)
 */
export const STAKEHOLDER_STRATEGY_PROMPT = `
# Stakeholder Engagement Strategy

You are an expert stakeholder management consultant tasked with creating a concise, effective Stakeholder Engagement Strategy.

PROJECT CONTEXT:
- Name: {projectName}
- Goal: {projectGoal}
- Timeline: {startDate} to {endDate}
- Impacted Users: {impactedUsers}
- Key Stakeholders: {stakeholders}
- Org Benefits: {orgBenefits}
- User Benefits: {userBenefits}
- Challenges: {challenges}

INSTRUCTIONS:
Create a focused Stakeholder Engagement Strategy with these sections:

1. Stakeholder Analysis (identify 4-5 key stakeholder groups and their primary interests)

2. Stakeholder Mapping (classify stakeholders into 4 quadrants: high/low influence and high/low interest)

3. Engagement Approaches (specify 2-3 engagement tactics for each stakeholder group)

4. Key Concerns (list 3-4 major stakeholder concerns and specific mitigation strategies)

5. Engagement Timeline (outline 4-5 key engagement milestones with dates)

6. Success Metrics (recommend 3-4 measurable indicators of successful stakeholder engagement)

Use clear, direct language. Format in Markdown with ## for section headers and bullet points for lists.

_Generated by VibeOCM AI - https://github.com/adihere/vibeocm_

*Disclaimer: This draft needs to be refined to suit the context further.*
`
// Note: This template is designed to be concise and effective for small language models.