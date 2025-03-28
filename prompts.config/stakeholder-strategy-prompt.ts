/**
 * Prompt template for generating a Stakeholder Engagement Strategy
 */
export const STAKEHOLDER_STRATEGY_PROMPT = `
Generate a Stakeholder Engagement Strategy for the following project:

Project Name: {projectName}
Project Goal: {projectGoal}
Timeline: {startDate} to {endDate}
Number of Impacted Users: {impactedUsers}

Stakeholders:
{stakeholders}

Benefits to Organization:
{orgBenefits}

Benefits to End Users:
{userBenefits}

Challenges:
{challenges}

The Stakeholder Engagement Strategy should include:
1. Stakeholder Identification and Analysis
2. Stakeholder Mapping (influence vs. interest)
3. Engagement Approaches for each stakeholder group
4. Key concerns and mitigation strategies
5. Engagement Timeline
6. Success Metrics for stakeholder engagement

Please format the Stakeholder Engagement Strategy in Markdown format.
`

