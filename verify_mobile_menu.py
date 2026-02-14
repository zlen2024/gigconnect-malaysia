import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Set viewport to iPhone SE size to ensure mobile menu is visible
        page = browser.new_page(viewport={"width": 375, "height": 667})
        page.goto("http://localhost:8080")

        # Wait for the mobile toggle button
        toggle_button = page.locator('button[aria-label="Toggle menu"]')
        toggle_button.wait_for()

        # Check initial state
        expanded_initial = toggle_button.get_attribute("aria-expanded")
        controls = toggle_button.get_attribute("aria-controls")
        print(f"Initial aria-expanded: {expanded_initial}")
        print(f"aria-controls: {controls}")

        # Click to open
        toggle_button.click()

        # Wait for menu to appear
        menu = page.locator("#mobile-menu")
        menu.wait_for()

        # Check open state
        expanded_open = toggle_button.get_attribute("aria-expanded")
        print(f"Open aria-expanded: {expanded_open}")

        # Check menu attributes
        role = menu.get_attribute("role")
        label = menu.get_attribute("aria-label")
        print(f"Menu role: {role}")
        print(f"Menu aria-label: {label}")

        # Take screenshot
        page.screenshot(path="verification.png")
        print("Screenshot saved to verification.png")

        browser.close()

if __name__ == "__main__":
    run()
