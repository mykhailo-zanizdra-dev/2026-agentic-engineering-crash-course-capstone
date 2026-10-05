import { expect, test } from "@playwright/test";

const SECTION_IDS = ["navbar", "hero", "features", "how-it-works", "pricing", "faq", "waitlist", "footer"];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("all eight sections render in order", async ({ page }) => {
  const ids = await page.evaluate((expected) => {
    const found = expected.map((id) => document.getElementById(id));
    const positions = found.map((el) => el?.getBoundingClientRect().top ?? NaN);
    return { present: found.map(Boolean), positions };
  }, SECTION_IDS);
  expect(ids.present).toEqual(SECTION_IDS.map(() => true));
  const sorted = [...ids.positions].sort((a, b) => a - b);
  expect(ids.positions).toEqual(sorted);
});

test("page is Ukrainian and replaces the scaffold", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await expect(page).toHaveTitle(/AgentFlow/);
  await expect(page.getByText("To get started")).toHaveCount(0);
});

test("navbar shows the brand and links reach their sections", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Основна навігація" });
  await expect(nav.getByText("AgentFlow")).toBeVisible();
  const targets: Record<string, string> = {
    Можливості: "features",
    "Як це працює": "how-it-works",
    Тарифи: "pricing",
    Питання: "faq",
    "Список очікування": "waitlist",
  };
  for (const [label, id] of Object.entries(targets)) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test("signup calls to action point at the waitlist section", async ({ page }) => {
  const hero = page.locator("#hero").getByRole("link", { name: /очікування/ });
  await expect(hero).toHaveAttribute("href", "#waitlist");
  const plans = page.getByTestId("plan");
  const planCount = await plans.count();
  expect(planCount).toBeGreaterThanOrEqual(1);
  const planLinks = await plans.getByRole("link").all();
  expect(planLinks).toHaveLength(planCount);
  for (const link of planLinks) {
    await expect(link).toHaveAttribute("href", "#waitlist");
  }
  await hero.click();
  await expect(page.locator("#waitlist")).toBeInViewport();
});

test("informational sections have the specified content", async ({ page }) => {
  expect(await page.locator("#features li").count()).toBeGreaterThanOrEqual(3);
  const steps = page.locator("#how-it-works ol > li h3");
  await expect(steps).toHaveText(["Специфікація", "Реалізація", "Перевірка"]);
  expect(await page.locator("#faq details").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator("#footer")).toContainText("AgentFlow");
});

test("pricing has no payment controls", async ({ page }) => {
  const pricing = page.locator("#pricing");
  await expect(pricing).toContainText("приклад");
  await expect(pricing.locator("button, form, input, [type=submit]")).toHaveCount(0);
  await expect(pricing.getByText(/купити|оплат|checkout/i)).toHaveCount(0);
});

test("page has no horizontal overflow", async ({ page }) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
