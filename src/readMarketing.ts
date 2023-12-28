import { google, sheets_v4 } from 'googleapis'
import { GaxiosError } from 'gaxios'
import { JWT } from 'google-auth-library'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config()

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH
if (!CREDENTIALS_PATH) {
  throw new Error('CREDENTIALS_PATH is not defined. Please check your .env file or environment variables.')
}
const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf8'))


// Initialize the JWT auth client
const jwtClient = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

export async function readMarketingSheets(spreadsheetId: string, range: string): Promise<string[]> {
  const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: jwtClient })

  try {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
    const rows = response.data.values
    const output: string[] = []
    
    if (rows) {
      rows.forEach((row) => {
        const status: string = row[5]
        if (status === 'Accept') {
          const timestamp: string = row[0]
          let fromUser: string = row[1]
          fromUser = fromUser.split('@')[0]
          let issue: string = row[2]
          issue = issue.substring(0, 32)
    
          const unixTime: number = new Date(timestamp).getTime() / 1000
    
          const feedbackString: string = `new_feedback{app="marketing",since="${timestamp}",from="${fromUser}",issue="${issue}"} ${unixTime}`
          output.push(feedbackString)
        }
      })
    }
    return output
  } catch (err) {
    const error: GaxiosError = err as GaxiosError;
    console.error('The API returned an error: ', error.message)
    return [`Error retrieving data: ${error.message}`]
  }
}