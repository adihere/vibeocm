/**
 * Prompt template for generating a Change Management Plan
 */
export const CHANGE_PLAN_PROMPT = `
Generate a comprehensive Change Management Plan for the following project:

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

The Change Management Plan should include:
1. Executive Summary
2. Project Timeline
3. Stakeholder Analysis
4. Change Strategy with phases
5. Communication Approach
6. Training Recommendations
7. Risk Mitigation Strategies
8. Success Metrics

Please format the Change Management Plan in Markdown format.
`

