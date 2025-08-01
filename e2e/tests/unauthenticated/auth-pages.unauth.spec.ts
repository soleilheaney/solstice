import { expect, test } from "@playwright/test";

test.describe("Authentication Pages (Unauthenticated)", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're not authenticated by clearing cookies
    await page.context().clearCookies();
  });

  test("should display login page correctly", async ({ page }) => {
    await page.goto("/auth/login");

    // Check page heading
    await expect(
      page.getByRole("heading", { name: "Welcome back to Acme Inc." }),
    ).toBeVisible();

    // Check form elements using labels and roles
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();

    // Check OAuth buttons
    await expect(page.getByRole("button", { name: "Login with Google" })).toBeVisible();

    // Check signup link
    await expect(
      page.getByRole("main").getByRole("link", { name: "Sign up" }),
    ).toBeVisible();
  });

  test("should display signup page correctly", async ({ page }) => {
    await page.goto("/auth/signup");

    // Check page heading
    await expect(
      page.getByRole("heading", { name: "Sign up for Acme Inc." }),
    ).toBeVisible();

    // Check form elements using labels
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign up", exact: true }),
    ).toBeVisible();

    // Check OAuth button
    await expect(page.getByRole("button", { name: "Sign up with Google" })).toBeVisible();

    // Check login link at the bottom of the form
    await expect(
      page.getByRole("main").getByRole("link", { name: "Login" }),
    ).toBeVisible();
  });

  test("should navigate between login and signup pages", async ({ page }) => {
    // Start at login page
    await page.goto("/auth/login");

    // Click sign up link
    await page.getByRole("main").getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL("/auth/signup");
    await expect(
      page.getByRole("heading", { name: "Sign up for Acme Inc." }),
    ).toBeVisible();

    // Click login link
    await page.getByRole("main").getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL("/auth/login");
    await expect(
      page.getByRole("heading", { name: "Welcome back to Acme Inc." }),
    ).toBeVisible();
  });

  test("should redirect to login when accessing protected routes", async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(
      page.getByRole("heading", { name: "Welcome back to Acme Inc." }),
    ).toBeVisible();
  });

  test("should redirect to login when accessing profile", async ({ page }) => {
    await page.goto("/dashboard/profile");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should redirect to login when accessing teams", async ({ page }) => {
    await page.goto("/dashboard/teams");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
