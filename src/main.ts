import express, { Request, Response } from 'express'
import { readNusaworkSheets } from './readNusawork'
import { readNusaprospectSheets } from './readNusaprospect'
import { readMarketingSheets } from './readMarketing'
import { readSuggestionSheets } from './readSuggestion'

const app = express()
const PORT = 3000

app.get('/nusawork', async (req: Request, res: Response) => {
  const spreadsheetId: string = process.env.NUSAWORK_DOC_ID!
  const range: string = 'List Feedback!A2:F4'
  const feedbackData: string[] = await readNusaworkSheets(spreadsheetId, range)
  res.type('text').send(feedbackData.join('\n'));
})

app.get('/nusaprospect', async (req: Request, res: Response) => {
  const spreadsheetId: string = process.env.NUSAPROSPECT_DOC_ID!
  const range: string = 'List Feedback!A2:F4'
  const feedbackData: string[] = await readNusaprospectSheets(spreadsheetId, range)
  res.type('text').send(feedbackData.join('\n'));
})

app.get('/marketing', async (req: Request, res: Response) => {
  const spreadsheetId: string = process.env.MARKETING_DOC_ID!
  const range: string = 'Form Responses!A2:F4'
  const feedbackData: string[] = await readMarketingSheets(spreadsheetId, range)
  res.type('text').send(feedbackData.join('\n'));
})

app.get('/suggestion', async (req: Request, res: Response) => {
  const spreadsheetId: string = process.env.SUGGESTION_DOC_ID!
  const range: string = 'Sheet1!A2:C4'
  const feedbackData: string[] = await readSuggestionSheets(spreadsheetId, range)
  res.type('text').send(feedbackData.join('\n'));
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})