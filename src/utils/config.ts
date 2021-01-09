import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export type ConfigType = {
    cockpitAPIURL: string
    cockpitAPIToken: string
}

if (!process.env.COCKPIT_API_URL || !process.env.COCKPIT_API_TOKEN) {
    console.log(`💥 environment configuration missing, check .env file`)
    process.exit(1)
}

export const config: ConfigType = {
    cockpitAPIURL: process.env.COCKPIT_API_URL,
    cockpitAPIToken: process.env.COCKPIT_API_TOKEN,
}
