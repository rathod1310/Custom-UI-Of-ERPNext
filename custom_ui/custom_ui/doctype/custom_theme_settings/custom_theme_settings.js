frappe.ui.form.on("Custom Theme Settings", {
    setup(frm) {
        frm.custom_ui_palettes = {
            "Soft Blue Professional": {
                primary_color: "#2563EB",
                secondary_color: "#DBEAFE",
                background_color: "#F8FAFC",
                sidebar_color: "#FFFFFF",
                navbar_color: "#FFFFFF",
                card_color: "#FFFFFF",
                text_color: "#1E293B",
                muted_text_color: "#64748B",
                border_color: "#E2E8F0",
                hover_color: "#EFF6FF",
                button_text_color: "#FFFFFF",
            },
            "Emerald Corporate": {
                primary_color: "#059669",
                secondary_color: "#D1FAE5",
                background_color: "#F8FAFC",
                sidebar_color: "#FFFFFF",
                navbar_color: "#FFFFFF",
                card_color: "#FFFFFF",
                text_color: "#1F2937",
                muted_text_color: "#6B7280",
                border_color: "#E5E7EB",
                hover_color: "#ECFDF5",
                button_text_color: "#FFFFFF",
            },
            "Warm Beige Minimal": {
                primary_color: "#B45309",
                secondary_color: "#FEF3C7",
                background_color: "#FFFBF5",
                sidebar_color: "#FFFFFF",
                navbar_color: "#FFFFFF",
                card_color: "#FFFFFF",
                text_color: "#2F2924",
                muted_text_color: "#7A6F66",
                border_color: "#E7DCCF",
                hover_color: "#FFF7ED",
                button_text_color: "#FFFFFF",
            },
            "Lavender Soft": {
                primary_color: "#7C3AED",
                secondary_color: "#EDE9FE",
                background_color: "#FAF9FF",
                sidebar_color: "#FFFFFF",
                navbar_color: "#FFFFFF",
                card_color: "#FFFFFF",
                text_color: "#27272A",
                muted_text_color: "#71717A",
                border_color: "#E4E4E7",
                hover_color: "#F5F3FF",
                button_text_color: "#FFFFFF",
            },
            "Slate Clean": {
                primary_color: "#475569",
                secondary_color: "#E2E8F0",
                background_color: "#F8FAFC",
                sidebar_color: "#FFFFFF",
                navbar_color: "#FFFFFF",
                card_color: "#FFFFFF",
                text_color: "#0F172A",
                muted_text_color: "#64748B",
                border_color: "#CBD5E1",
                hover_color: "#F1F5F9",
                button_text_color: "#FFFFFF",
            },
        };
    },

    refresh(frm) {
        frm.toggle_display("palette", frm.doc.theme_mode === "Palette");
    },

    theme_mode(frm) {
        frm.toggle_display("palette", frm.doc.theme_mode === "Palette");
        if (frm.doc.theme_mode === "Palette") {
            apply_palette(frm);
        }
    },

    palette(frm) {
        if (frm.doc.theme_mode === "Palette") {
            apply_palette(frm);
        }
    },

    after_save() {
        if (window.custom_ui_apply_theme) {
            window.custom_ui_apply_theme();
        }
    },
});

function apply_palette(frm) {
    const palette = frm.custom_ui_palettes[frm.doc.palette];
    if (!palette) return;

    Object.keys(palette).forEach((fieldname) => {
        frm.set_value(fieldname, palette[fieldname]);
    });
}
