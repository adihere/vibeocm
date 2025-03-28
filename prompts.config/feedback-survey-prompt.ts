/**
 * Prompt template for generating Feedback Survey Templates
 */
export const FEEDBACK_SURVEY_PROMPT = `
Generate Feedback Survey Templates for the following project:

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

Please create templates for the following surveys:
1. Pre-implementation Readiness Assessment
2. Training Effectiveness Survey
3. Post-implementation Satisfaction Survey
4. 30-Day Follow-up Survey

Each survey template should include:
- Introduction text
- 5-10 relevant questions (mix of multiple choice, rating scales, and open-ended)
- Thank you message

Please format the Feedback Survey Templates in Markdown format.
`

