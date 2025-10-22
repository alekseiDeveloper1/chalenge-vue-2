
<template>
  <div class="ag-theme-alpine" :style="{ height: '500px', width: '100%' }">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      :autoGroupColumnDef="autoGroupColumnDef"
      :getDataPath="getDataPath"
      :gridOptions="gridOptions"
      :treeData="true"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef, GridOptions, ValueGetterParams, ICellRendererParams, GetDataPath } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { TreeStore, type Item } from './api/api';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
onBeforeMount(() => {
  ModuleRegistry.registerModules([AllCommunityModule]);
});

const items: Item[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
];

const ts = new TreeStore(items);
const rowData = ref<Item[]>(ts.getAll());

const columnDefs = ref<ColDef[]>([
    {
        headerName: '№ п/п',
        valueGetter: (params: ValueGetterParams) => (params?.node?.rowIndex ?? -1)  + 1,
        width: 80,
        resizable: false,
    },
    {
        headerName: 'Категория',
        valueGetter: (params: ValueGetterParams) => params.data.id,
        width: 120,
    },
    {
        field: 'label',
        headerName: 'Наименование',
        cellRenderer: 'agGroupCellRenderer',
    },
    {
        field: 'id',
        headerName: 'ID',
        hide: true,
    },
    {
        field: 'parent',
        headerName: 'Parent ID',
        hide: true,
    },
]);

const getDataPath: GetDataPath = (data: Item) => data.path ?? [];
const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  cellRenderer: (params: ICellRendererParams) => {
      const hasChildren = ts.getChildren(params.data.id).length > 0;
      return hasChildren ? 'Группа' : 'Элемент';
  },
  width: 320,
  pinned: "left",
  sort: "asc",
};
const gridOptions = ref<GridOptions>({
    treeData: true,
    animateRows: true,
    getDataPath: (data: Item) => data.path as string[],
    autoGroupColumnDef: {
        headerName: 'Наименование',
        minWidth: 300,
        cellRenderer: 'agGroupCellRenderer',
    },
    groupDefaultExpanded: -1,
});
</script>

<style>
  .ag-theme-alpine > div {
    height: 600px;
  }
  #app {
    width:100%
  }
</style>
