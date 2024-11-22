import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

interface ScrapedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
  cuisine: string;
  category: string;
  image: string;
  pdf?: string; // Add PDF URL or base64 string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: any) {
  const res = await req.json();
  const { url } = res;

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch the HTML content of the webpage
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch the webpage.');
    }
    const html = await response.text();

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Scraping logic using Cheerio
    const getTextContent = (selector: string) => $(selector).text().trim() || '';

    const getLogo = () => $('.tasty-recipes-image img').attr('src') || '';

    const getIngredients = () => 
      $('.tasty-recipes-ingredients ul li')
        .map((_, el) => $(el).text().trim())
        .get();

    const getInstructions = () => 
      $('.tasty-recipes-instructions ol li')
        .map((_, el) => $(el).text().trim())
        .get();

    const recipe: ScrapedRecipe = {
      title: getTextContent('h1') || $('title').text(),
      ingredients: getIngredients(),
      instructions: getInstructions(),
      servings: getTextContent('.servings'),
      prepTime: getTextContent('.prep-time'),
      cookTime: getTextContent('.cook-time'),
      cuisine: getTextContent('.cuisine'),
      category: getTextContent('.category'),
      image: getLogo(),
    };

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error scraping recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
