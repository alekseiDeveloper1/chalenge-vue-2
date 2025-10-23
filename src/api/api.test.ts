import { TreeStore, type Item } from './api';

describe('TreeStore', () => {
    const items: Item[] = [
        { id: 1, parent: null, label: 'Item 1' },
        { id: '91064cee', parent: 1, label: 'Item 2' },
        { id: 3, parent: 1, label: 'Item 3' },
        { id: 4, parent: '91064cee', label: 'Item 4' },
        { id: 5, parent: '91064cee', label: 'Item 5' },
        { id: 6, parent: '91064cee', label: 'Item 6' },
        { id: 7, parent: 4, label: 'Item 7' },
        { id: 8, parent: 4, label: 'Item 8' },
    ];

    let store: TreeStore;

    beforeEach(() => {
        store = new TreeStore(items);
    });

    test('getAll() should return all items with correct paths', () => {
        const allItems = store.getAll();
        expect(allItems).toHaveLength(items.length);
        expect(allItems[0].path).toEqual(['1']);
        expect(allItems[1].path).toEqual(['1', '91064cee']);
        expect(allItems[3].path).toEqual(['1', '91064cee', '4']);
        expect(allItems[6].path).toEqual(['1', '91064cee', '4', '7']);
    });

    test('getItem() should return a specific item by ID', () => {
        const item = store.getItem(7);
        expect(item).toEqual({ id: 7, parent: 4, label: 'Item 7', path: ['1', '91064cee', '4', '7'] });
    });

    test('getChildren() should return direct children of a given item', () => {
        const children = store.getChildren('91064cee');
        expect(children).toHaveLength(3);
        expect(children.map(c => c.id)).toEqual([4, 5, 6]);
    });

    test('getAllChildren() should return all nested children of a given item', () => {
        const allChildren = store.getAllChildren('91064cee');
        expect(allChildren).toHaveLength(5);
        expect(allChildren.map(c => c.id)).toEqual([4, 5, 6, 7, 8]);
    });

    test('getAllParents() should return all parents of a given item', () => {
        const parents = store.getAllParents(7);
        expect(parents).toHaveLength(3);
        expect(parents.map(p => p.id)).toEqual([1, '91064cee', 4]);
    });

    test('addItem() should add a new item and update paths', () => {
        const newItem: Item = { id: 9, parent: 4, label: 'Item 9' };
        store.addItem(newItem);
        const addedItem = store.getItem(9);
        expect(addedItem).toBeDefined();
        expect(addedItem?.path).toEqual(['1', '91064cee', '4', '9']);
    });

    test('removeItem() should remove an item and all its children', () => {
        store.removeItem('91064cee');
        expect(store.getItem('91064cee')).toBeUndefined();
        expect(store.getItem(4)).toBeUndefined();
        expect(store.getItem(7)).toBeUndefined();
        expect(store.getAll()).toHaveLength(2);
    });

    test('updateItem() should update an item and its children paths', () => {
        const updatedItem = { id: 4, parent: 1, label: 'Updated Item 4' };
        store.updateItem(updatedItem);

        const item4 = store.getItem(4);
        expect(item4?.parent).toBe(1);
        expect(item4?.label).toBe('Updated Item 4');
        expect(item4?.path).toEqual(['1', '4']);

        const item7 = store.getItem(7);
        expect(item7?.path).toEqual(['1', '4', '7']);
    });

    test('getAll() should return a deep copy of items', () => {
        const allItems = store.getAll();
        allItems[0].label = 'Modified';
        expect(store.getItem(1)?.label).toBe('Item 1');
    });

    test('getItem() should return a deep copy of an item', () => {
        const item = store.getItem(1);
        if (item) {
            item.label = 'Modified';
        }
        expect(store.getItem(1)?.label).toBe('Item 1');
    });
});
