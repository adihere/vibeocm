/**
 * Prompt template for generating a Communication Plan
 */
export const COMMUNICATION_PLAN_PROMPT = `
Generate a detailed Communication Plan for the following project:

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

The Communication Plan should include:
1. Communication Objectives
2. Key Messages for different audiences
3. Audience Segmentation
4. Communication Channels
5. Communication Timeline
6. Feedback Mechanisms
7. Templates for key communications

Please format the Communication Plan in Markdown format.
`

