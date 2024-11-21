import puppeteer from 'puppeteer';

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
  pdf: string; // Add PDF URL or base64 string
}

export async function POST(req) {
  const res = await req.json();
  const { url } = res;

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const recipe: Omit<ScrapedRecipe, 'pdf'> = await page.evaluate(() => {
      const getTextContent = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? element.textContent?.trim() : '';
      };

      const getListItems = (selector: string) => {
        return Array.from(document.querySelectorAll(selector))
          .map((el) => el.textContent?.trim())
          .filter(Boolean) as string[];
      };

      const getLogo = () => {
        const logoElement = document.querySelector('.tasty-recipes-image img');
        return logoElement ? logoElement.src : '';
      };

      const getIngredients = () => {
        const ingredients = document.querySelectorAll('.tasty-recipes-ingredients ul li');
        return Array.from(ingredients)
          .map((ingredient) => ingredient.textContent?.trim())
          .filter(Boolean) as string[];
      };

      const getInstructions = () => {
        const instructions = document.querySelectorAll('.tasty-recipes-instructions ol li');
        return Array.from(instructions)
          .map((instruction: any) => instruction.textContent.trim())
          .filter(Boolean) as string[];
      };

      return {
        title: getTextContent('h1') || document.title,
        ingredients: getIngredients(),
        instructions: getInstructions(),
        servings: getTextContent('.servings'),
        prepTime: getTextContent('.prep-time'),
        cookTime: getTextContent('.cook-time'),
        category: getTextContent('.category'),
        cuisine: getTextContent('.cuisine'),
        image: getLogo(),
      };
    });

    // Generate the PDF as a base64 string
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
    });
    const pdfBase64 = pdfBuffer.toString('base64');

    // Add the PDF as a base64 string to the response
    const recipeWithPdf: ScrapedRecipe = {
      ...recipe,
      pdf: `data:application/pdf;base64,${pdfBase64}`,
    };

    return Response.json(recipeWithPdf);
  } catch (error) {
    console.error('Error scraping recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
