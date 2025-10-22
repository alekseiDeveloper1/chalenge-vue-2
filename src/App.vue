
<template>
  <div class="ag-theme-alpine" :style="{ height: '500px', width: '100%' }">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      :autoGroupColumnDef="autoGroupColumnDef"
      :getDataPath="getDataPath"
      :treeData="true"
      :groupDefaultExpanded="-1"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef, GetDataPath, ValueGetterParams } from 'ag-grid-community';
import {ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { TreeStore, type Item } from './api/api';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

onBeforeMount(() => {
  ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule]);
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
        field: 'label',
        headerName: 'Наименование',
    },
]);

const getDataPath: GetDataPath = (data: Item) => data.path ?? [];

const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  minWidth: 300,
  cellRenderer: 'agGroupCellRenderer',
  valueGetter: params => {
      const hasChildren = ts.getChildren(params.data.id).length > 0;
      return hasChildren ? 'Группа' : 'Элемент';
  },
};

</script>

<style>
  .ag-theme-alpine > div {
    height: 600px;
  }
  #app {
    width:100%
  }
</style>
