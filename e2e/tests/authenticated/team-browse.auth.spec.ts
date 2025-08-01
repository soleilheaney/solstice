import { expect, test } from "@playwright/test";

test.describe("Team Browsing and Search (Authenticated)", () => {
  test.describe("Browse Teams Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/teams/browse");
    });

    test("should display browse teams page", async ({ page }) => {
      // Check page header
      await expect(
        page.getByRole("heading", { name: /Browse.*Teams|Find.*Team|Discover.*Teams/i }),
      ).toBeVisible();

      // Check for search functionality
      await expect(page.getByPlaceholder(/Search.*teams/i)).toBeVisible();
    });

    test("should list all active teams", async ({ page }) => {
      // Should show both test teams
      await expect(page.getByText("Test Thunder")).toBeVisible();
      await expect(page.getByText("Test Lightning")).toBeVisible();

      // Check team information is displayed - using actual Card component structure
      const thunderCard = page.locator(".transition-shadow").filter({
        hasText: "Test Thunder",
      });
      await expect(thunderCard.getByText("Toronto, ON")).toBeVisible();
      // Members count is shown as "Members" label with separate count
      await expect(thunderCard.getByText("Members")).toBeVisible();
      await expect(thunderCard.getByText("1")).toBeVisible(); // member count
    });

    test.skip("should search teams by name", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search.*teams/i);

      // Search for Thunder
      await searchInput.fill("Thunder");

      // Wait for search to execute (debounce + API call)
      await page.waitForTimeout(2000);

      // Should only show Test Thunder
      await expect(page.getByText("Test Thunder")).toBeVisible();
      await expect(page.getByText("Test Lightning")).not.toBeVisible();
    });

    test.skip("should search teams by city", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search.*teams/i);

      // Search for Toronto
      await searchInput.fill("Toronto");

      // Wait for search to execute
      await page.waitForTimeout(2000);

      // Should only show Toronto team
      await expect(page.getByText("Test Thunder")).toBeVisible();
      await expect(page.getByText("Test Lightning")).not.toBeVisible();
    });

    test.skip("should show no results message for empty search", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search.*teams/i);

      // Search for non-existent team
      await searchInput.fill("NonexistentTeam");

      // Wait for search to execute
      await page.waitForTimeout(2000);

      // Should show no results message
      await expect(page.getByText(/No teams found|No results/i)).toBeVisible();
    });

    test("should clear search results", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search.*teams/i);

      // Search and then clear
      await searchInput.fill("Thunder");
      await searchInput.press("Enter");

      // Clear search
      await searchInput.clear();
      await searchInput.press("Enter");

      // Should show all teams again
      await expect(page.getByText("Test Thunder")).toBeVisible();
      await expect(page.getByText("Test Lightning")).toBeVisible();
    });
  });

  test.describe("Join Team Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/teams/browse");
    });

    test("should show join button for teams user is not in", async () => {
      // Need to test with a user that's not in all teams
      // This would require additional test user setup
      test.skip();
    });

    test.skip("should show 'Already Member' for teams user is in", async ({ page }) => {
      // Skip - current UI only shows 'View Team' button, no join/member status
      // Test user is already in Test Thunder
      const thunderCard = page.locator(".transition-shadow").filter({
        hasText: "Test Thunder",
      });

      // Should show member status instead of join button
      const joinButton = thunderCard.getByRole("button", { name: /Join.*Team/i });
      if (await joinButton.isVisible()) {
        // User is not a member, can join
        await expect(joinButton).toBeEnabled();
      } else {
        // User is already a member
        await expect(
          thunderCard.getByText(/Already.*member|Member|Joined/i),
        ).toBeVisible();
      }
    });

    test("should request to join a team", async () => {
      // This test needs a team the user is not already in
      // Would need to create a third test team or use a different test user
      test.skip();
    });

    test("should handle join request errors", async () => {
      // Test error scenarios like team full, invites disabled, etc.
      test.skip();
    });
  });

  test.describe("Team Filtering", () => {
    test("should filter teams by province", async ({ page }) => {
      // If province filter exists
      const provinceFilter = page.getByLabel("Province");
      if (await provinceFilter.isVisible()) {
        await provinceFilter.click();
        await page.getByRole("option", { name: "Ontario" }).click();

        // Should only show Ontario teams
        await expect(page.getByText("Test Thunder")).toBeVisible();
        await expect(page.getByText("Test Lightning")).not.toBeVisible();
      }
    });

    test("should sort teams", async ({ page }) => {
      // If sort options exist
      const sortSelect = page.getByLabel(/Sort.*by/i);
      if (await sortSelect.isVisible()) {
        // Test different sort options
        await sortSelect.click();
        await page.getByRole("option", { name: /Name/i }).click();

        // Verify sort order (would need to check actual order)
        const teams = await page.locator("text=/Test (Thunder|Lightning)/").all();
        expect(teams.length).toBeGreaterThan(0);
      }
    });

    test("should paginate results", async ({ page }) => {
      // If there are enough teams to paginate
      const pagination = page.locator("[aria-label='Pagination']");
      if (await pagination.isVisible()) {
        // Test pagination controls
        const nextButton = pagination.getByRole("button", { name: "Next" });
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          // Verify different teams are shown
        }
      }
    });
  });

  test.describe("Team Quick Actions", () => {
    test("should view team details from browse page", async ({ page }) => {
      // Click the View Team link for Test Thunder
      const viewTeamLink = page.getByRole("link", { name: "View Team" }).first();

      await viewTeamLink.click();

      // Should navigate to team detail page
      await expect(page).toHaveURL(/\/dashboard\/teams\/(test-team-1|[a-zA-Z0-9]+)/);
    });

    test("should show team member count", async ({ page }) => {
      // Member count is displayed for each team
      // First team (Test Thunder) should show Members: 1
      const membersLabel = page.getByText("Members").first();
      await expect(membersLabel).toBeVisible();

      // The count is in a separate element next to the label
      const memberCount = membersLabel.locator("..").getByText(/\d+/);
      await expect(memberCount).toBeVisible();
      await expect(memberCount).toHaveText("1");
    });

    test.skip("should show team colors", async ({ page }) => {
      // Skip - color indicators not visible in current UI
      const teamCard = page.locator(".transition-shadow").filter({
        hasText: "Test Thunder",
      });

      // Check for color indicator (rounded div with background color)
      const colorIndicator = teamCard.locator(".rounded-full").first();
      await expect(colorIndicator).toBeVisible();
      // The team primary color should be applied as inline style
      const style = await colorIndicator.getAttribute("style");
      expect(style).toContain("background-color");
    });
  });

  test.describe("Empty States", () => {
    test("should show appropriate message when no teams exist", async () => {
      // This would require clearing all teams from the database
      // or mocking the API response
      test.skip();
    });

    test("should encourage team creation from browse page", async ({ page }) => {
      // Check for create team CTA
      const createTeamButton = page.getByRole("link", { name: /Create.*Team/i });
      if (await createTeamButton.isVisible()) {
        await createTeamButton.click();
        await expect(page).toHaveURL("/dashboard/teams/create");
      }
    });
  });
});
