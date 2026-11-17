(() => {
    const root = document.documentElement;
    const frame = document.querySelector(".app-frame");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
    const themeToggle = document.querySelector(".theme-toggle");
    const searchInput = document.querySelector("#directory-search");
    const searchEmpty = document.querySelector("#search-empty");

    const setTheme = (theme) => {
        root.dataset.theme = theme;
        if (themeToggle) {
            const darkMode = theme === "dark";
            const label = darkMode ? "Light mode" : "Dark mode";
            themeToggle.setAttribute("aria-label", `Switch to ${label.toLowerCase()}`);
            themeToggle.setAttribute("title", `Switch to ${label.toLowerCase()}`);
            themeToggle.querySelector(".theme-label").textContent = label;
            themeToggle.querySelector(".theme-icon").textContent = darkMode ? "☀" : "◐";
        }
    };

    if (themeToggle) {
        setTheme(root.dataset.theme === "dark" ? "dark" : "light");
        themeToggle.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
            try {
                localStorage.setItem("peopledesk-theme", nextTheme);
            } catch (error) {
                // Theme still changes for this page when browser storage is unavailable.
            }
        });
    }

    const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
    const closeMobileSidebar = () => {
        if (!frame || !sidebarToggle) return;
        frame.classList.remove("sidebar-open");
        sidebarToggle.setAttribute("aria-expanded", "false");
    };

    if (frame && sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            if (isMobile()) {
                const isOpen = frame.classList.toggle("sidebar-open");
                sidebarToggle.setAttribute("aria-expanded", String(isOpen));
            } else {
                const isCollapsed = frame.classList.toggle("sidebar-collapsed");
                sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
            }
        });

        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener("click", closeMobileSidebar);
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMobileSidebar();
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && searchInput) {
                event.preventDefault();
                searchInput.focus();
            }
        });

        window.matchMedia("(min-width: 761px)").addEventListener("change", () => {
            frame.classList.remove("sidebar-open");
            sidebarToggle.setAttribute("aria-expanded", String(!frame.classList.contains("sidebar-collapsed")));
        });
    }

    if (searchInput && searchEmpty) {
        const rows = Array.from(document.querySelectorAll("[data-person-row]"));
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLocaleLowerCase();
            let visibleCount = 0;
            rows.forEach((row) => {
                const matches = row.textContent.toLocaleLowerCase().includes(query);
                row.hidden = !matches;
                if (matches) visibleCount += 1;
            });
            searchEmpty.hidden = visibleCount > 0;
        });
    }
})();
