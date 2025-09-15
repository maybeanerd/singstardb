import type { TableColumn } from '@nuxt/ui'
import type { Song } from '~~/server/api/songData'
import UButton from '@nuxt/ui/runtime/components/Button.vue'
import { getGroupedRowModel } from '@tanstack/vue-table'
import type { GroupingOptions } from '@tanstack/vue-table'


type Column = {
    getIsSorted: () => 'asc' | 'desc' | false, toggleSorting: (desc: boolean) => void,
}

type Row = { getIsGrouped: () => boolean, getValue: (key: string) => unknown }

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

function joinIfArray(value: unknown) {
    return Array.isArray(value) ? value.join(', ') : value
}

function createGroupableCell(row: Row, label: string) {
    return row.getIsGrouped() ? joinIfArray(row.getValue(label)) : row.getValue('label')
}

function groupableCellConstructor(title: string) {
    return ({ row }: { row: Row }) => {
        return createGroupableCell(row, title)
    }
}


export function useCSVData() {
    const { data } = useFetch('/api/songData')




    const columns: TableColumn<Song>[] = [
        {
            accessorKey: 'title',
            header: sortableHeaderConstructor('Title'),
            cell: groupableCellConstructor('title'),
            aggregationFn: 'unique'
        },
        {
            accessorKey: 'artists',
            header: sortableHeaderConstructor('Artists'),
            cell: ({ row }) => joinIfArray(row.getValue('artists')),
            aggregationFn: 'unique'
        },
        {
            accessorKey: 'console',
            cell: groupableCellConstructor('console'),
            header: 'Platform',
            aggregationFn: 'unique'
        },
        {
            accessorKey: 'language',
            header: 'Region',
            cell: groupableCellConstructor('language'),
            aggregationFn: 'unique'

        },
        {
            accessorKey: 'disc', cell: groupableCellConstructor('disc'),
            header: 'Disc',
            aggregationFn: 'unique'
        },

    ]

    const sorting = ref([
        {
            id: 'disc',
            desc: false
        }
    ])

    const groupingOptions = ref<GroupingOptions>({
        groupedColumnMode: 'reorder',
        getGroupedRowModel: getGroupedRowModel()
    })

    const grouping = ['title', 'artists']

    return {
        data: computed(() => (data?.value?.songData ?? [])),
        columns,
        sorting,
        groupingOptions,
        grouping
    }
}