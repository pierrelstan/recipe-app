"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type Recipe = {
  id: string;
  name: string;
  url: string;
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  image?: string;
  category?: string;
  cuisine?: string;
};

export function RecipePortfolio() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    url: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddRecipe = async () => {
    if (newRecipe.name && newRecipe.url) {
      setLoading(true);
      try {
        const response = await fetch("/api/scrape-recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: newRecipe.url }),
        });
        const data = await response.json();
        setRecipes([
          ...recipes,
          {
            ...newRecipe,
            id: Date.now().toString(),
            ...data,
          },
        ]);
        setNewRecipe({ name: "", url: "" });
      } catch (error) {
        console.error("Failed to scrape recipe:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Explore Delicious Recipes
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover and add new recipes to your collection. Browse by category or
          add your own!
        </p>
        <Button className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700">
          Explore Recipes
        </Button>
      </div>

      {/* Add Recipe Form */}
      <div className="flex justify-center space-x-4 mb-8">
        <div className="flex flex-col space-y-4 max-w-md w-full">
          <Label htmlFor="recipeName" className="font-semibold text-gray-800">
            Recipe Name
          </Label>
          <Input
            id="recipeName"
            value={newRecipe.name}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, name: e.target.value })
            }
            placeholder="Enter Recipe Name"
            className="w-full"
          />

          <Label htmlFor="recipeUrl" className="font-semibold text-gray-800">
            Recipe URL
          </Label>
          <Input
            id="recipeUrl"
            value={newRecipe.url}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, url: e.target.value })
            }
            placeholder="Enter Recipe URL"
            className="w-full"
          />

          <Button
            onClick={handleAddRecipe}
            className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700"
          >
            {loading ? "Adding..." : "Add Recipe"}
          </Button>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="relative shadow-lg rounded-lg overflow-hidden bg-white transition-transform duration-300 "
          >
            <Image
              src={recipe.image || "/default-image.jpg"} // Fallback if no image is provided
              alt={recipe.name}
              width={300}
              height={200}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {recipe.name}
              </h2>
              <p className="text-gray-600 text-sm">{recipe.category}</p>

              <div className="space-y-2">
                <p className="text-gray-800 text-sm">
                  <strong>Cook Time:</strong> {recipe.cookTime}
                </p>
                <p className="text-gray-800 text-sm">
                  <strong>Prep Time:</strong> {recipe.prepTime}
                </p>
                <p className="text-gray-800 text-sm">
                  <strong>Servings:</strong> {recipe.servings}
                </p>
              </div>

              {/* Ingredients List */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Ingredients:</h3>
                  <ul className="list-inside list-disc text-gray-800 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions List */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Instructions:</h3>
                  <ol className="list-inside list-decimal text-gray-800 space-y-1">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* View Recipe Button */}
              <Button
                onClick={() => (window.location.href = recipe.url)}
                className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                View Recipe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
