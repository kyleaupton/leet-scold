import schedule from 'node-schedule'
import { wasNotACompletePieceOfShitToday } from './leetcode.js'
import { generateHelpfulReminder } from './chatgpt.js'
import { initializeDiscord } from './discord.js'
import { logger } from './logger.js'
import { db, type IUser } from './db.js'
import { setupProcessCleanup } from './process.js'

//
// Main
//
const main = async (): Promise<void> => {
  setupProcessCleanup()
  const client = await initializeDiscord()

  // Run everyday at 9:00 PM UTC / 4:00 PM EST
  const rule = new schedule.RecurrenceRule()
  rule.hour = 21
  rule.minute = 0
  rule.tz = 'Etc/UTC'

  schedule.scheduleJob(rule, async () => {
    logger.info('Running daily checkup')
    await Promise.all(db.data.users.map(processUser))
  })

  const processUser = async (user: IUser): Promise<void> => {
    logger.info(`Processing leetcode user ${user.leetcodeId}`)
    const submitted = await wasNotACompletePieceOfShitToday(user.leetcodeId)

    if (!submitted && process.env.DISCORD_BOT_CHANNEL) {
      logger.info(`Oh boy, guess who was a piece of shit today? Yep it was ${user.leetcodeId}.`)
      const message = await generateHelpfulReminder()
      const channel = client.channels.cache.get(process.env.DISCORD_BOT_CHANNEL)

      if (channel?.isTextBased()) {
        logger.info(`Sending ${user.leetcodeId} a gentle reminder`)
        await channel.send({
          content: `<@${user.discordId}> ${message}`,
          allowedMentions: { users: [user.discordId] }
        })
      }
    }
  }
}

await main()
