

export function useCSVData() {
    const { data } = useFetch('/api/songData')
    return {
        data
    }
}