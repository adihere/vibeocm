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

