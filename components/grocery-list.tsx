"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type GroceryItem = {
  id: string;
  name: string;
  category: string;
  store: string;
  checked: boolean;
};

export function GroceryList() {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", category: "", store: "" });

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.store) {
      setGroceryItems([
        ...groceryItems,
        { ...newItem, id: Date.now().toString(), checked: false },
      ]);
      setNewItem({ name: "", category: "", store: "" });
    }
  };

  const handleToggleItem = (id: string) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const groupedItems = groceryItems.reduce((acc, item) => {
    const key = `${item.category}-${item.store}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Grocery List</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="item-name" className="w-20">
                Name
              </Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="Enter item name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="item-category" className="w-20">
                Category
              </Label>
              <Input
                id="item-category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                placeholder="Enter item category"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="item-store" className="w-20">
                Store
              </Label>
              <Input
                id="item-store"
                value={newItem.store}
                onChange={(e) =>
                  setNewItem({ ...newItem, store: e.target.value })
                }
                placeholder="Enter store name"
              />
            </div>
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([key, items]) => {
          const [category, store] = key.split("-");
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>
                  {category} - {store}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <Label
                        htmlFor={item.id}
                        className={item.checked ? "line-through" : ""}
                      >
                        {item.name}
                      </Label>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
        {/* </Button> */}
      </div>
    </div>
  );
}
