import path from 'path'
import url from 'url'

export const projectPath = (): string => {
  return path.dirname(path.dirname(url.fileURLToPath(import.meta.url)))
}

export const envPath = (): string => {
  return path.join(projectPath(), 'data', '.env')
}
