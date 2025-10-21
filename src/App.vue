
<template>
  <div class="ag-theme-alpine" :style="{ height: '500px', width: '100%' }">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { LicenseManager, TreeDataModule, ValidationModule } from 'ag-grid-enterprise';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { TreeStore } from './api/api';

onBeforeMount(() => {
  ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule, ValidationModule]);
  LicenseManager.setLicenseKey('');
});

const items = [
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
const rowData = ref(ts.getAll());

const columnDefs = ref([
    {
        headerName: '№ п/п',
        valueGetter: 'node.rowIndex + 1',
        width: 80,
        resizable: false,
    },
    {
        headerName: 'Категория',
        cellRenderer: params => {
            const hasChildren = ts.getChildren(params.data.id).length > 0;
            return hasChildren ? 'Группа' : 'Элемент';
        },
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

const gridOptions = ref({
    treeData: true,
    animateRows: true,
    getDataPath: data => data.path,
    autoGroupColumnDef: {
        headerName: 'Наименование',
        minWidth: 300,
        cellRenderer: 'agGroupCellRenderer',
    },
    groupDefaultExpanded: -1,
});
</script>

<style>
</style>
