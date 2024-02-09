import nodeCleanup from 'node-cleanup'
import { destroyDiscord } from './discord.js'
import { logger } from './logger.js'

export const setupProcessCleanup = (): void => {
  const cleanup = async (): Promise<void> => {
    await destroyDiscord()
  }

  nodeCleanup((exitCode, signal) => {
    if (signal) {
      cleanup()
        .then(() => process.kill(process.pid, signal))
        .catch((e) => logger.error(e))

      nodeCleanup.uninstall() // Don't call cleanup handler again
      return false
    }
  })
}
