import { shallowMount } from '@vue/test-utils';
import App from './App.vue';
import { AgGridVue } from 'ag-grid-vue3';

describe('App.vue', () => {
  it('должен отображать сетку ag-grid', () => {
    const wrapper = shallowMount(App);
    expect(wrapper.findComponent(AgGridVue).exists()).toBe(true);
  });

  it('должен передавать правильные данные и настройки в ag-grid', () => {
    const wrapper = shallowMount(App);
    const agGrid = wrapper.findComponent(AgGridVue);

    expect(agGrid.props('rowData')).toBeDefined();
    expect(agGrid.props('rowData').length).toBeGreaterThan(0);
    expect(agGrid.props('columnDefs')).toBeDefined();
    expect(agGrid.props('columnDefs').length).toBeGreaterThan(0);
    expect(agGrid.props('treeData')).toBe(true);
    expect(agGrid.props('getDataPath')).toBeInstanceOf(Function);
  });
});
