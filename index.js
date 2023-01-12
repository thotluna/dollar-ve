import dotenv from 'dotenv'
import { scrapeBCV } from './scrapebcv/scrapebcv.js'
import { scraperTwitter } from './twitter/index.js'

dotenv.config()
scrapeBCV()
scraperTwitter()
