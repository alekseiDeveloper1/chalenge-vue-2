type ID = string | number | null;

interface Item {
    id: ID;
    parent: ID;
    [key: string]: any;
}

export class TreeStore {
    private items: Item[];
    private itemsMap: Map<ID, Item>;

    constructor(items: Item[]) {
        this.items = [...items];
        this.itemsMap = new Map();
        this.items.forEach(item => this.itemsMap.set(item.id, item));
    }

    getAll(): Item[] {
        return this.items;
    }

    getItem(id: ID): Item | undefined {
        return this.itemsMap.get(id);
    }

    getChildren(id: ID): Item[] {
        return this.items.filter(item => item.parent === id);
    }

    getAllChildren(id: ID): Item[] {
        const result: Item[] = [];
        const queue: ID[] = [id];

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (currentId !== undefined && currentId !== null) {
                const children = this.getChildren(currentId);
                children.forEach(child => {
                    result.push(child);
                    if (child.id !== null) {
                        queue.push(child.id);
                    }
                });
            }
        }

        return result;
    }

    getAllParents(id: ID): Item[] {
        const result: Item[] = [];
        let currentItem = this.getItem(id);

        while (currentItem && currentItem.parent !== null) {
            const parent = this.getItem(currentItem.parent);
            if (parent) {
                result.push(parent);
                currentItem = parent;
            } else {
                currentItem = undefined;
            }
        }

        return result.reverse();
    }

    addItem(item: Item): void {
        if (!this.itemsMap.has(item.id)) {
            this.items.push(item);
            this.itemsMap.set(item.id, item);
        }
    }

    removeItem(id: ID): void {
        const children = this.getAllChildren(id).map(child => child.id);
        const idsToRemove = new Set([id, ...children]);

        this.items = this.items.filter(item => !idsToRemove.has(item.id));
        idsToRemove.forEach(removableId => this.itemsMap.delete(removableId));
    }

    updateItem(updatedItem: Item): void {
        const existingItem = this.itemsMap.get(updatedItem.id);
        if (existingItem) {
            Object.assign(existingItem, updatedItem);
        }
    }
}

// Пример использования
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

// Проверка getAll()
console.log('getAll()', ts.getAll());

// Проверка getItem(7)
console.log('getItem(7)', ts.getItem(7));

// Проверка getChildren('91064cee')
console.log("getChildren('91064cee')", ts.getChildren('91064cee'));

// Проверка getAllChildren('91064cee')
console.log("getAllChildren('91064cee')", ts.getAllChildren('91064cee'));

// Проверка getAllParents(7)
console.log('getAllParents(7)', ts.getAllParents(7));

// Проверка addItem()
ts.addItem({ id: 9, parent: 4, label: 'Айтем 9' });
console.log('getItem(9) after addItem', ts.getItem(9));

// Проверка updateItem()
ts.updateItem({ id: 9, parent: 4, label: 'Обновленный Айтем 9' });
console.log('getItem(9) after updateItem', ts.getItem(9));

// Проверка removeItem()
ts.removeItem('91064cee');
console.log('getAll() after removeItem', ts.getAll());
console.log("getItem('91064cee') after removeItem", ts.getItem('91064cee'));
