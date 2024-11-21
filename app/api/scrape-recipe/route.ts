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
  // pdf: string; // Add PDF URL or base64 string
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let browser = null;

  try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recipe: any = await page.evaluate(() => {
      const getTextContent = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? element.textContent?.trim() : '';
      };

      // const getListItems = (selector: string) => {
      //   return Array.from(document.querySelectorAll(selector))
      //     .map((el) => el.textContent?.trim())
      //     .filter(Boolean) as string[];
      // };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getLogo: any = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elementLogo: any = document.querySelector('.tasty-recipes-image img');
        return elementLogo ? elementLogo?.src : '';
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const pdfBase64 = pdfBuffer.toString();

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
