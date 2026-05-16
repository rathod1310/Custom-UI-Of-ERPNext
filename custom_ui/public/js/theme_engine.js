(function () {
    "use strict";

    const METHOD = "custom_ui.api.get_active_theme";
    const THEME_ATTRIBUTE = "data-custom-ui-theme";
    const COLOR_FIELDS = [
        "primary_color",
        "secondary_color",
        "background_color",
        "sidebar_color",
        "navbar_color",
        "card_color",
        "text_color",
        "muted_text_color",
        "border_color",
        "hover_color",
        "button_text_color",
    ];
    const VARIABLE_ALIASES = {
        primary_color: "--custom-ui-primary",
        secondary_color: "--custom-ui-secondary",
        background_color: "--custom-ui-bg",
        sidebar_color: "--custom-ui-sidebar",
        navbar_color: "--custom-ui-navbar",
        card_color: "--custom-ui-card",
        text_color: "--custom-ui-text",
        muted_text_color: "--custom-ui-muted",
        border_color: "--custom-ui-border",
        hover_color: "--custom-ui-hover",
        button_text_color: "--custom-ui-button-text",
    };

    function cssVariableName(fieldname) {
        return "--custom-ui-" + fieldname.replace(/_/g, "-");
    }

    function removeThemeVariables(root) {
        COLOR_FIELDS.forEach((fieldname) => {
            root.style.removeProperty(cssVariableName(fieldname));
            root.style.removeProperty(VARIABLE_ALIASES[fieldname]);
        });
    }

    function applyTheme(theme) {
        const root = document.documentElement;

        if (!theme || !theme.enabled) {
            root.removeAttribute(THEME_ATTRIBUTE);
            removeThemeVariables(root);
            return;
        }

        COLOR_FIELDS.forEach((fieldname) => {
            if (theme[fieldname]) {
                root.style.setProperty(cssVariableName(fieldname), theme[fieldname]);
                root.style.setProperty(VARIABLE_ALIASES[fieldname], theme[fieldname]);
            }
        });

        root.setAttribute(THEME_ATTRIBUTE, "1");
    }

    function fetchAndApplyTheme() {
        if (!window.frappe || !frappe.call) {
            return;
        }

        frappe.call({
            method: METHOD,
            freeze: false,
            callback: function (response) {
                applyTheme(response.message);
            },
        });
    }

    window.custom_ui_apply_theme = fetchAndApplyTheme;

    if (window.frappe && frappe.ready) {
        frappe.ready(fetchAndApplyTheme);
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fetchAndApplyTheme);
    } else {
        fetchAndApplyTheme();
    }

    if (window.frappe && frappe.router) {
        frappe.router.on("change", function () {
            window.setTimeout(fetchAndApplyTheme, 100);
        });
    }
})();
