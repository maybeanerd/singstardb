import type { TableColumn } from '@nuxt/ui'
import type { Song } from '~~/server/api/songData'
import UButton from '@nuxt/ui/runtime/components/Button.vue'


type Column = {
    getIsSorted: () => 'asc' | 'desc' | false, toggleSorting: (desc: boolean) => void
}


export function useCSVData() {
    const { data } = useFetch('/api/songData')


    function createSortHeader(
        column: Column,
        label: string) {
        const isSorted = column.getIsSorted()

        return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label,
            icon: isSorted
                ? isSorted === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
    }

    function sortableHeaderConstructor(title: string) {
        return ({ column }: { column: Column }) => {
            return createSortHeader(column, title)
        }
    }

    const columns: TableColumn<Song>[] = [
        {
            accessorKey: 'console',
            cell: ({ row }) => row.getValue('console'),
            header: sortableHeaderConstructor('Platform')

        },
        {
            accessorKey: 'disc',
            header: sortableHeaderConstructor('Disc'),
        },
        {
            accessorKey: 'language',
            header: sortableHeaderConstructor('Region'),
            cell: ({ row }) => row.getValue('language')

        },
        {
            accessorKey: 'title',
            header: sortableHeaderConstructor('Title'),
        },
        {
            accessorKey: 'artist',
            header: sortableHeaderConstructor('Artist'),
        }
    ]

    const sorting = ref([
        {
            id: 'disc',
            desc: false
        }
    ])



    return {
        data: computed(() => (data?.value?.songData ?? []).slice(0, 10)),
        columns,
        sorting
    }
}