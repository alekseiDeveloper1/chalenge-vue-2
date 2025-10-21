import { TreeStore } from './api';

describe('TreeStore', () => {
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

    const itemsWithPaths = [
        { id: 1, parent: null, label: 'Айтем 1', path: [1] },
        { id: '91064cee', parent: 1, label: 'Айтем 2', path: [1, '91064cee'] },
        { id: 3, parent: 1, label: 'Айтем 3', path: [1, 3] },
        { id: 4, parent: '91064cee', label: 'Айтем 4', path: [1, '91064cee', 4] },
        { id: 5, parent: '91064cee', label: 'Айтем 5', path: [1, '91064cee', 5] },
        { id: 6, parent: '91064cee', label: 'Айтем 6', path: [1, '91064cee', 6] },
        { id: 7, parent: 4, label: 'Айтем 7', path: [1, '91064cee', 4, 7] },
        { id: 8, parent: 4, label: 'Айтем 8', path: [1, '91064cee', 4, 8] },
    ];

    let ts: TreeStore;

    beforeEach(() => {
        ts = new TreeStore(items);
    });

    test('getAll() должен вернуть все элементы', () => {
        expect(ts.getAll()).toEqual(itemsWithPaths);
    });

    test('getItem(id) должен вернуть элемент по его id', () => {
        expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, label: 'Айтем 7', path: [1, '91064cee', 4, 7] });
        expect(ts.getItem('91064cee')).toEqual({ id: '91064cee', parent: 1, label: 'Айтем 2', path: [1, '91064cee'] });
        expect(ts.getItem(999)).toBeUndefined();
    });

    test('getChildren(id) должен вернуть непосредственных детей', () => {
        expect(ts.getChildren('91064cee')).toEqual([
            { id: 4, parent: '91064cee', label: 'Айтем 4', path: [1, '91064cee', 4] },
            { id: 5, parent: '91064cee', label: 'Айтем 5', path: [1, '91064cee', 5] },
            { id: 6, parent: '91064cee', label: 'Айтем 6', path: [1, '91064cee', 6] },
        ]);
        expect(ts.getChildren(7)).toEqual([]);
    });

    test('getAllChildren(id) должен вернуть всех детей, включая вложенных', () => {
        const allChildren = ts.getAllChildren('91064cee');
        const expectedChildren = [
            { id: 4, parent: '91064cee', label: 'Айтем 4', path: [1, '91064cee', 4] },
            { id: 5, parent: '91064cee', label: 'Айтем 5', path: [1, '91064cee', 5] },
            { id: 6, parent: '91064cee', label: 'Айтем 6', path: [1, '91064cee', 6] },
            { id: 7, parent: 4, label: 'Айтем 7', path: [1, '91064cee', 4, 7] },
            { id: 8, parent: 4, label: 'Айтем 8', path: [1, '91064cee', 4, 8] },
        ];
        expect(allChildren.length).toBe(expectedChildren.length);
        expect(allChildren).toEqual(expect.arrayContaining(expectedChildren));
    });

    test('getAllParents(id) должен вернуть всех родителей', () => {
        const allParents = ts.getAllParents(7);
        expect(allParents).toEqual([
            { id: 1, parent: null, label: 'Айтем 1', path: [1] },
            { id: '91064cee', parent: 1, label: 'Айтем 2', path: [1, '91064cee'] },
            { id: 4, parent: '91064cee', label: 'Айтем 4', path: [1, '91064cee', 4] },
        ]);
        expect(ts.getAllParents(1)).toEqual([]);
    });

    test('addItem(item) должен добавить новый элемент', () => {
        const newItem = { id: 9, parent: 4, label: 'Айтем 9' };
        ts.addItem(newItem);
        expect(ts.getItem(9)).toEqual(newItem);
        expect(ts.getAll()).toContainEqual(newItem);
    });

    test('addItem(item) не должен добавлять элемент с существующим id', () => {
        const newItem = { id: 7, parent: 4, label: 'Дубликат айтем 7' };
        const initialCount = ts.getAll().length;
        ts.addItem(newItem);
        expect(ts.getAll().length).toBe(initialCount);
        expect(ts.getItem(7)).not.toEqual(newItem);
    });

    test('removeItem(id) должен удалить элемент и всех его детей', () => {
        ts.removeItem('91064cee');
        const remainingIds = [1, 3];
        const remainingItems = ts.getAll();
        expect(remainingItems.length).toBe(remainingIds.length);
        remainingIds.forEach(id => expect(ts.getItem(id)).toBeDefined());
        expect(ts.getItem('91064cee')).toBeUndefined();
        expect(ts.getItem(4)).toBeUndefined();
        expect(ts.getItem(7)).toBeUndefined();
    });

    test('updateItem(updatedItem) должен обновить существующий элемент', () => {
        const updatedItemData = { id: 7, parent: 4, label: 'Обновленный Айтем 7' };
        ts.updateItem(updatedItemData);
        const item = ts.getItem(7);
        expect(item).toEqual({ id: 7, parent: 4, label: 'Обновленный Айтем 7', path: [1, '91064cee', 4, 7] });
    });

    test('updateItem(updatedItem) не должен обновлять несуществующий элемент', () => {
        const initialItems = ts.getAll().map(item => ({ ...item }));
        ts.updateItem({ id: 999, parent: null, label: 'Несуществующий айтем' });
        expect(ts.getAll()).toEqual(initialItems);
    });
});
