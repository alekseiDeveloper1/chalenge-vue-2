type ID = string | number;

export interface Item {
    id: ID;
    parent: ID | null;
    path?: string[];
    [key: string]: any;
}

// Helper to perform a deep copy
function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export class TreeStore {
    private items: Item[];
    private itemsMap: Map<ID, Item>;

    constructor(items: Item[]) {
        // Deep copy to prevent modification of the original array
        const initialItems = deepCopy(items);
        this.itemsMap = new Map();
        initialItems.forEach(item => this.itemsMap.set(item.id, item));

        this.items = initialItems.map(item => ({
            ...item,
            path: this.buildPath(item.id)
        }));

        // Re-build the map with the items that now include the path
        this.itemsMap.clear();
        this.items.forEach(item => this.itemsMap.set(item.id, item));
    }

    private buildPath(id: ID): string[] {
        const path: string[] = [];
        let currentId: ID | null = id;
        while (currentId !== null) {
            const item = this.itemsMap.get(currentId);
            if (item) {
                path.unshift(String(item.id));
                currentId = item.parent;
            } else {
                // This case should not happen in a consistent tree
                break;
            }
        }
        return path;
    }

    private rebuildPathsForChildren(parentId: ID) {
        const children = this.items.filter(item => item.parent === parentId);
        for (const child of children) {
            const newPath = this.buildPath(child.id);
            child.path = newPath;
            this.rebuildPathsForChildren(child.id);
        }
    }

    getAll(): Item[] {
        return deepCopy(this.items);
    }

    getItem(id: ID): Item | undefined {
        const item = this.itemsMap.get(id);
        return item ? deepCopy(item) : undefined;
    }

    getChildren(id: ID): Item[] {
        const children = this.items.filter(item => item.parent === id);
        return deepCopy(children);
    }

    getAllChildren(id: ID): Item[] {
        const result: Item[] = [];
        const queue: ID[] = [id];
        const visited = new Set<ID>();

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            if (visited.has(currentId)) {
                continue;
            }
            visited.add(currentId);

            const children = this.items.filter(item => item.parent === currentId);
            for (const child of children) {
                result.push(child);
                queue.push(child.id);
            }
        }
        return deepCopy(result);
    }

    getAllParents(id: ID): Item[] {
        const result: Item[] = [];
        let currentItem = this.getItem(id);

        while (currentItem && currentItem.parent !== null) {
            const parent = this.getItem(currentItem.parent);
            if (parent) {
                result.unshift(parent);
                currentItem = parent;
            } else {
                break;
            }
        }
        return result; // Already deep copies from getItem
    }

    addItem(item: Item): void {
        if (this.itemsMap.has(item.id)) {
            return; // Or throw an error
        }
        const newItem = deepCopy(item);
        this.itemsMap.set(newItem.id, newItem); // temporary add to map for path building
        newItem.path = this.buildPath(newItem.id);
        this.items.push(newItem);
    }

    removeItem(id: ID): void {
        const children = this.getAllChildren(id).map(child => child.id);
        const idsToRemove = new Set<ID>([id, ...children]);

        this.items = this.items.filter(item => !idsToRemove.has(item.id));
        idsToRemove.forEach(removableId => this.itemsMap.delete(removableId));
    }

    updateItem(updatedItem: Partial<Item> & { id: ID }): void {
        const existingItem = this.itemsMap.get(updatedItem.id);
        if (!existingItem) {
            return;
        }

        const oldParent = existingItem.parent;
        const newParent = updatedItem.parent;

        // Update the item in the map and the list
        Object.assign(existingItem, updatedItem);

        // if the parent has changed, we need to rebuild the path for the item and all its descendants.
        if (newParent !== undefined && oldParent !== newParent) {
             existingItem.path = this.buildPath(existingItem.id);
             this.rebuildPathsForChildren(existingItem.id);
        }
    }
}
