import cron from 'node-cron'
import { wasNotACompletePieceOfShitToday } from './leeetcode.js'
import { generateHelpfulReminder } from './chatgpt.js'
import { logger } from './logger.js'
import { db } from './db.js'

//
// Main
//

// Run everyday at 8:00 PM UTC - 4 hours before daily question changes
cron.schedule('0 8 * * *', async () => {
  await Promise.all(db.data.usernames.map(processUser))
}, { timezone: 'GMT' })

const processUser = async (username: string): Promise<void> => {
  const submitted = await wasNotACompletePieceOfShitToday(username)

  if (!submitted) {
    // Genereate witty reminder and shove it down their throat
    // const message = await generateHelpfulReminder()
    // Send to some server...? Need to figure that out
  }
}
