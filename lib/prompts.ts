/**
 * This file contains all the prompts used for AI generation in the application.
 * Centralizing prompts here makes it easier to modify and maintain them.
 */

/**
 * Base system prompt that defines the AI's role and capabilities
 */
export const SYSTEM_PROMPT = `You are an expert in Organizational Change Management (OCM).
Your task is to create professional, comprehensive OCM deliverables based on the provided project context.
Format your response in Markdown with clear headings, bullet points, and sections.
Be specific, practical, and actionable in your recommendations.`

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

/**
 * Prompt template for generating Communication Message Templates
 */
export const COMMUNICATION_TEMPLATES_PROMPT = `
Generate Communication Message Templates for the following project:

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

Please create templates for the following communications:
1. Initial Announcement (Executive Sponsor to All Staff)
2. Detailed Information (Project Team to Affected Departments)
3. Training Invitation (Training Team to End Users)
4. Go-Live Reminder (Project Manager to All Stakeholders)
5. Post-Implementation Survey (Change Manager to End Users)

Each template should include:
- Subject line
- Greeting
- Body with key messages
- Call to action
- Closing

Please format the Communication Templates in Markdown format.
`

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

/**
 * Map of artifact types to their corresponding prompts
 */
export const ARTIFACT_TYPE_TO_PROMPT: Record<string, string> = {
  "Organizational Change Plan": CHANGE_PLAN_PROMPT,
  "Communication Plan": COMMUNICATION_PLAN_PROMPT,
  "Communication Message Templates": COMMUNICATION_TEMPLATES_PROMPT,
  "Stakeholder Engagement Strategy": STAKEHOLDER_STRATEGY_PROMPT,
  "Feedback Survey Templates": FEEDBACK_SURVEY_PROMPT,
}

/**
 * Formats a prompt template with the provided project data
 *
 * @param promptTemplate - The template string with placeholders
 * @param projectData - The project data to insert into the template
 * @returns The formatted prompt string
 */
export function formatPromptWithProjectData(promptTemplate: string, projectData: any): string {
  const { name, goal, startDate, endDate, stakeholders, impactedUsers, orgBenefits, userBenefits, challenges } =
    projectData

  // Format stakeholders as a bulleted list
  const stakeholdersText = stakeholders.map((s) => `- ${s.role}: ${s.impact}`).join("\n")

  return promptTemplate
    .replace("{projectName}", name)
    .replace("{projectGoal}", goal)
    .replace("{startDate}", startDate)
    .replace("{endDate}", endDate)
    .replace("{impactedUsers}", impactedUsers.toString())
    .replace("{stakeholders}", stakeholdersText)
    .replace("{orgBenefits}", orgBenefits)
    .replace("{userBenefits}", userBenefits)
    .replace("{challenges}", challenges)
}

