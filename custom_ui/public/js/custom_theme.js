(function () {
    "use strict";

    const THEMED_ATTRIBUTE = "data-custom-ui-chart-themed";
    let observerStarted = false;
    let applyTimer = null;

    function getVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function getThemeColors() {
        const primary = getVariable("--custom-ui-primary");
        const secondary = getVariable("--custom-ui-secondary");
        const muted = getVariable("--custom-ui-muted");
        const border = getVariable("--custom-ui-border");
        const card = getVariable("--custom-ui-card");
        const hover = getVariable("--custom-ui-hover");

        return {
            primary,
            secondary,
            muted,
            border,
            card,
            hover,
            series: [
                primary,
                secondary,
                `color-mix(in srgb, ${primary} 72%, ${card})`,
                `color-mix(in srgb, ${primary} 52%, ${secondary})`,
                `color-mix(in srgb, ${primary} 36%, ${hover})`,
                `color-mix(in srgb, ${secondary} 72%, ${card})`,
            ],
        };
    }

    function applySvgTheme(svg, colors) {
        if (!svg || svg.getAttribute(THEMED_ATTRIBUTE) === "1") return;

        svg.querySelectorAll("text, .title, .sub-title, .legend text").forEach((el) => {
            el.style.fill = colors.muted;
            el.style.color = colors.muted;
        });

        svg.querySelectorAll(".grid-line, .tick, .axis, line").forEach((el) => {
            el.style.stroke = colors.border;
        });

        svg.querySelectorAll("path, circle, rect, polygon, polyline").forEach((el, index) => {
            const className = el.getAttribute("class") || "";
            if (/grid|axis|tick|domain/i.test(className)) return;

            const color = colors.series[index % colors.series.length];
            const tag = el.tagName.toLowerCase();

            if (tag === "polyline" || /line|dataset|stroke/i.test(className)) {
                el.style.stroke = color;
                el.style.fill = "none";
            } else {
                el.style.fill = color;
                if (tag !== "circle") {
                    el.style.stroke = "color-mix(in srgb, var(--custom-ui-card) 72%, var(--custom-ui-border))";
                }
            }
        });

        svg.setAttribute(THEMED_ATTRIBUTE, "1");
    }

    function applyChartTheme() {
        const colors = getThemeColors();
        if (!colors.primary || !colors.secondary || !colors.card) return;

        document.querySelectorAll(".chart-container, .chart-wrapper, .frappe-chart, .chart, .report-wrapper, .query-report").forEach((container) => {
            container.style.backgroundColor = colors.card;
            container.style.borderColor = colors.border;
            container.style.color = getVariable("--custom-ui-text");
        });

        document.querySelectorAll(".frappe-chart svg, .chart svg, .chart-container svg, .chart-wrapper svg, .report-wrapper svg").forEach((svg) => {
            applySvgTheme(svg, colors);
        });

        document.querySelectorAll(".graph-svg-tip").forEach((tip) => {
            tip.style.backgroundColor = colors.card;
            tip.style.borderColor = colors.border;
            tip.style.color = getVariable("--custom-ui-text");
        });
    }

    function scheduleChartTheme() {
        window.clearTimeout(applyTimer);
        applyTimer = window.setTimeout(applyChartTheme, 120);
    }

    function startObserver() {
        if (observerStarted || !document.body) return;
        observerStarted = true;

        const observer = new MutationObserver((mutations) => {
            if (mutations.some((mutation) => mutation.addedNodes.length || mutation.type === "attributes")) {
                document.querySelectorAll(`[${THEMED_ATTRIBUTE}]`).forEach((svg) => svg.removeAttribute(THEMED_ATTRIBUTE));
                scheduleChartTheme();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"],
        });
    }

    function init() {
        scheduleChartTheme();
        startObserver();
    }

    window.custom_ui_apply_chart_theme = function () {
        document.querySelectorAll(`[${THEMED_ATTRIBUTE}]`).forEach((svg) => svg.removeAttribute(THEMED_ATTRIBUTE));
        scheduleChartTheme();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    if (window.frappe && frappe.router) {
        frappe.router.on("change", scheduleChartTheme);
    }
})();
