import schedule from 'node-schedule'
import { wasNotACompletePieceOfShitToday } from './leeetcode.js'
import { generateHelpfulReminder } from './chatgpt.js'
import { initializeDiscord } from './discord.js'
import { logger } from './logger.js'
import { db, type IUser } from './db.js'

//
// Main
//
const main = async (): Promise<void> => {
  // Initialize Discord client
  const client = await initializeDiscord()

  // Run everyday at 8:00 PM UTC - 4 hours before daily question changes
  const rule = new schedule.RecurrenceRule()
  rule.hour = 8
  rule.tz = 'Etc/UTC'

  schedule.scheduleJob(rule, async () => {
    logger.info('Running daily checkup')
    await Promise.all(db.data.users.map(processUser))
  })

  const processUser = async (user: IUser): Promise<void> => {
    const submitted = await wasNotACompletePieceOfShitToday(user.leetcodeId)

    if (!submitted && process.env.DISCORD_BOT_CHANNEL) {
      // Send message to user
      // Genereate super helpful reminder and shove it down their throat
      const message = await generateHelpfulReminder()
      const channel = client.channels.cache.get(process.env.DISCORD_BOT_CHANNEL)

      if (channel && channel.isTextBased()) {
        await channel.send({
          content: `<@${user.discordId}> ${message}`,
          allowedMentions: { users: [user.discordId] }
        })
      }
    }
  }
}

await main()
