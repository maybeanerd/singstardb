import fs from 'fs/promises'
import path from 'path'

// Helper to recursively get all files in discs directory (async)
async function getAllDiscFiles(baseDir: string) {
    const result: { console: string, disc: string, language: string, filePath: string }[] = []
    const consoles = await fs.readdir(baseDir)
    for (const consoleName of consoles) {
        const consolePath = path.join(baseDir, consoleName)
        if ((await fs.stat(consolePath)).isDirectory()) {
            const discs = await fs.readdir(consolePath)
            for (const discName of discs) {
                const discPath = path.join(consolePath, discName)
                if ((await fs.stat(discPath)).isDirectory()) {
                    const languages = await fs.readdir(discPath)
                    for (const languageFile of languages) {
                        const languagePath = path.join(discPath, languageFile)
                        if ((await fs.stat(languagePath)).isFile()) {
                            result.push({
                                console: consoleName,
                                disc: discName,
                                language: path.parse(languageFile).name,
                                filePath: languagePath
                            })
                        }
                    }
                }
            }
        }
    }
    return result
}

/** Parse a file to extract song/artist data (assuming CSV, adjust as needed) (async) */
async function parseSongFile(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    return lines.map(line => {
        const values = line.split('";"').map(v => v.replace('"', ''))
        return {
            title: values[0] || 'Unknown Title',
            artist: values[1] || 'Unknown Artist',
        }
    })
}

export type Song = {
    console: string
    disc: string
    language: string
    title: string
    artist: string
}

// Main function to get all songs with details (async)
async function getAllSongsWithDetails() {
    const baseDir = path.resolve(process.cwd(), 'discs')
    const files = await getAllDiscFiles(baseDir)
    const allSongs: Array<Song> = []
    for (const { console, disc, language, filePath } of files) {
        const songs = await parseSongFile(filePath)
        songs.forEach(song => {
            allSongs.push({
                console,
                disc,
                language,
                ...song
            })
        })
    }
    return allSongs
}

export default defineEventHandler(async () => {
    const songData = await getAllSongsWithDetails()

    return { songData }
})
