import fs from 'fs/promises'
import path from 'path'

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
                                console: consoleName.trim(),
                                disc: discName.trim(),
                                language: path.parse(languageFile).name.trim(),
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

async function parseSongFile(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    return lines.map(line => {
        const values = line.split('";"').map(v => v.replace('"', ''))
        return {
            title: values[0]?.trim() || 'Unknown Title',
            artists: values.slice(1).map(v => v.trim()).filter(Boolean) || ['Unknown Artist'],
        }
    })
}

export type Song = {
    console: string
    disc: string
    language: string
    title: string
    artists: Array<string>
}

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
