import { expect, test } from "@playwright/test";

test("homepage search navigates to the search page with the submitted query", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible();

  const searchInput = page.getByRole("searchbox", {
    name: "Zoek een locatie, festival of activiteit",
  });
  await searchInput.fill("museum");
  await page.getByRole("button", { name: "Zoek nu" }).click();

  await expect(page).toHaveURL(/\/nl\/zoeken\?query=museum$/);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "Zoeken" })).toHaveValue("museum");
});
