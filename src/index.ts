import schedule from 'node-schedule'
import { wasNotACompletePieceOfShitToday } from './leeetcode.js'
import { generateHelpfulReminder } from './chatgpt.js'
import { logger } from './logger.js'
import { db } from './db.js'

//
// Main
//

// Run everyday at 8:00 PM UTC - 4 hours before daily question changes
const rule = new schedule.RecurrenceRule()
rule.hour = 8
rule.tz = 'Etc/UTC'

schedule.scheduleJob(rule, async () => {
  logger.info('Running daily checkup')
  await Promise.all(db.data.usernames.map(processUser))
})

const processUser = async (username: string): Promise<void> => {
  const submitted = await wasNotACompletePieceOfShitToday(username)

  if (!submitted) {
    // Genereate witty reminder and shove it down their throat
    // const message = await generateHelpfulReminder()
    // Send to some server...? Need to figure that out
  }
}
