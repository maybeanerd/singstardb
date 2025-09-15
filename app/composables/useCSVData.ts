

export function useCSVData() {
    const { data } = useFetch('/api/songData')
    return {
        data: computed(() => (data?.value?.songData ?? []).slice(0, 10))
    }
}