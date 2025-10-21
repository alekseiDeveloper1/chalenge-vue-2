type ID = string | number | null;

interface Item {
    id: ID;
    parent: ID;
    path?: string[];
    [key: string]: any;
}

export class TreeStore {
    private items: Item[];
    private itemsMap: Map<ID, Item>;

    private getPath(id: ID, items: Item[]): string[] {
        const path: string[] = [];
        let currentId = id;
        while (currentId !== null) {
            const item = items.find(i => i.id === currentId);
            if (item) {
                path.unshift(String(item.id));
                currentId = item.parent;
            } else {
                break;
            }
        }
        return path;
    }

    constructor(items: Item[]) {
        const tempMap = new Map<ID, Item>();
        items.forEach(item => tempMap.set(item.id, item));

        this.items = items.map(item => ({
            ...item,
            path: this.getPath(item.id, items)
        }));

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
