import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://localhost:7294';
const todoTitle = `pw-todo-${new Date().toISOString().slice(0, 10)}`;

async function gotoApp(page: Page) {
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(/localhost/);
}

function todoCardByTitle(page: Page, title: string) {
  return page.locator('.card-container', {
    has: page.getByRole('heading', { name: title }),
  });
}

test.describe("todo flow", () => {
  test.describe.configure({mode:'serial'});

  test("add todo", async({page}) => {
    await gotoApp(page);

    const addTodoButton = page.getByRole('button', { name: 'Add Todo' });
    await expect(addTodoButton).toBeVisible();
    await addTodoButton.click();
    
    await page.getByRole('textbox', { name: 'Todo title' }).click();
    const titleBox = page.getByRole('textbox', { name: 'Todo title' });
    const urgentBox = page.getByRole('checkbox', { name: 'Urgent?' });
    const addButton = page.getByRole('button', { name: 'Add', exact: true });
    
    await expect(titleBox).toBeVisible();
    await titleBox.fill(todoTitle);
    await expect(titleBox).toHaveValue(todoTitle);
      
    await urgentBox.check();
    await expect(urgentBox).toBeChecked();

    await expect(addButton).toBeEnabled();
    await addButton.click();
    
    const cards = todoCardByTitle(page, todoTitle);
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
  });

  test("fail add todo", async({page}) => {
    await gotoApp(page);

    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    const message = page.locator('p');
    await expect(message).not.toHaveText('');
  });

  test("urgent todo is visible", async ({page}) => {    
    await gotoApp(page);

    const card = todoCardByTitle(page, todoTitle).first();
    await expect(card).toBeVisible();
    
    const todoStar = card.locator('svg');
      
    await expect(todoStar).toBeVisible();
  });

  test("update todo", async ({page}) => {    
    await gotoApp(page);

    const card = todoCardByTitle(page, todoTitle).first();
    await expect(card).toBeVisible();
    
    const rowCheckbox = card.getByRole('checkbox');
      
    await expect(rowCheckbox).toBeVisible();

    const checkboxStateBefore = await rowCheckbox.isChecked();

    await rowCheckbox.click();
    await expect(rowCheckbox).toBeChecked({ checked: !checkboxStateBefore }); 
  });

  test('delete todo', async ({ page }) => {
    await gotoApp(page);

    const cards = todoCardByTitle(page, todoTitle);
    await page.waitForTimeout(2000);

    const allCardsBeforeDelete = await cards;
    const cardsCountBeforeDelete = await allCardsBeforeDelete.count();

    await expect.poll(() => cardsCountBeforeDelete).toBeGreaterThan(0);

    const card = cards.first();
    const rowDelete = card.getByRole('button', { name: 'Delete' });

    await expect(rowDelete).toBeVisible();
    await rowDelete.click();
    
    const cardsAferDelete = todoCardByTitle(page, todoTitle);
    await expect(cardsAferDelete).toHaveCount(cardsCountBeforeDelete - 1);
  });
})

