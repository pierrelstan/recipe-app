import { MealPlanner } from '@/components/meal-planner'
import { RecipePortfolio } from '@/components/recipe-portfolio'
import { GroceryList } from '@/components/grocery-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Planner</h1>
      <Tabs defaultValue="meal-planner">
        <TabsList>
          <TabsTrigger value="meal-planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="recipe-portfolio">Recipe Portfolio</TabsTrigger>
          <TabsTrigger value="grocery-list">Grocery List</TabsTrigger>
        </TabsList>
        <TabsContent value="meal-planner">
          <MealPlanner />
        </TabsContent>
        <TabsContent value="recipe-portfolio">
          <RecipePortfolio />
        </TabsContent>
        <TabsContent value="grocery-list">
          <GroceryList />
        </TabsContent>
      </Tabs>
    </main>
  )
}

