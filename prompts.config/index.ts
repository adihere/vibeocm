import { SYSTEM_PROMPT } from "./system-prompt"
import { CHANGE_PLAN_PROMPT } from "./change-plan-prompt"
import { COMMUNICATION_PLAN_PROMPT } from "./communication-plan-prompt"
import { STAKEHOLDER_STRATEGY_PROMPT } from "./stakeholder-strategy-prompt"
import { COMMUNICATION_TEMPLATES_PROMPT } from "./communication-templates-prompt"
import { FEEDBACK_SURVEY_PROMPT } from "./feedback-survey-prompt"

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

export {
  SYSTEM_PROMPT,
  CHANGE_PLAN_PROMPT,
  COMMUNICATION_PLAN_PROMPT,
  STAKEHOLDER_STRATEGY_PROMPT,
  COMMUNICATION_TEMPLATES_PROMPT,
  FEEDBACK_SURVEY_PROMPT,
}

