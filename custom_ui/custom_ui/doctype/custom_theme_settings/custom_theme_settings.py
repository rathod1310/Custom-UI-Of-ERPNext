# Copyright (c) 2026, Om Rathod and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.model.document import Document


CURRENT_USER_DEFAULT_KEY = "custom_ui_theme_current_user"

COLOR_FIELDS = (
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
)

HEX_COLOR_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")

PALETTES = {
    "Soft Blue Professional": {
        "primary_color": "#2563EB",
        "secondary_color": "#DBEAFE",
        "background_color": "#F8FAFC",
        "sidebar_color": "#FFFFFF",
        "navbar_color": "#FFFFFF",
        "card_color": "#FFFFFF",
        "text_color": "#1E293B",
        "muted_text_color": "#64748B",
        "border_color": "#E2E8F0",
        "hover_color": "#EFF6FF",
        "button_text_color": "#FFFFFF",
    },
    "Emerald Corporate": {
        "primary_color": "#059669",
        "secondary_color": "#D1FAE5",
        "background_color": "#F8FAFC",
        "sidebar_color": "#FFFFFF",
        "navbar_color": "#FFFFFF",
        "card_color": "#FFFFFF",
        "text_color": "#1F2937",
        "muted_text_color": "#6B7280",
        "border_color": "#E5E7EB",
        "hover_color": "#ECFDF5",
        "button_text_color": "#FFFFFF",
    },
    "Warm Beige Minimal": {
        "primary_color": "#B45309",
        "secondary_color": "#FEF3C7",
        "background_color": "#FFFBF5",
        "sidebar_color": "#FFFFFF",
        "navbar_color": "#FFFFFF",
        "card_color": "#FFFFFF",
        "text_color": "#2F2924",
        "muted_text_color": "#7A6F66",
        "border_color": "#E7DCCF",
        "hover_color": "#FFF7ED",
        "button_text_color": "#FFFFFF",
    },
    "Lavender Soft": {
        "primary_color": "#7C3AED",
        "secondary_color": "#EDE9FE",
        "background_color": "#FAF9FF",
        "sidebar_color": "#FFFFFF",
        "navbar_color": "#FFFFFF",
        "card_color": "#FFFFFF",
        "text_color": "#27272A",
        "muted_text_color": "#71717A",
        "border_color": "#E4E4E7",
        "hover_color": "#F5F3FF",
        "button_text_color": "#FFFFFF",
    },
    "Slate Clean": {
        "primary_color": "#475569",
        "secondary_color": "#E2E8F0",
        "background_color": "#F8FAFC",
        "sidebar_color": "#FFFFFF",
        "navbar_color": "#FFFFFF",
        "card_color": "#FFFFFF",
        "text_color": "#0F172A",
        "muted_text_color": "#64748B",
        "border_color": "#CBD5E1",
        "hover_color": "#F1F5F9",
        "button_text_color": "#FFFFFF",
    },
}


class CustomThemeSettings(Document):
    def before_validate(self):
        self.enabled = 1 if self.enabled else 0
        self.apply_for = self.apply_for or "Global"
        self.theme_mode = self.theme_mode or "Palette"

        if self.theme_mode == "Palette":
            self.palette = self.palette or "Soft Blue Professional"
            self.apply_palette()

    def validate(self):
        self.validate_apply_for()
        self.validate_theme_mode()
        self.validate_colors()
        self.validate_global_access()

    def on_update(self):
        if self.apply_for == "Current User":
            frappe.db.set_default(CURRENT_USER_DEFAULT_KEY, frappe.session.user)
        else:
            frappe.db.set_default(CURRENT_USER_DEFAULT_KEY, "")

    def apply_palette(self):
        if self.palette not in PALETTES:
            frappe.throw(_("Please select a valid predefined palette."))

        for fieldname, value in PALETTES[self.palette].items():
            self.set(fieldname, value)

    def validate_apply_for(self):
        if self.apply_for not in {"Global", "Current User"}:
            frappe.throw(_("Apply For must be Global or Current User."))

    def validate_theme_mode(self):
        if self.theme_mode not in {"Palette", "Custom"}:
            frappe.throw(_("Theme Mode must be Palette or Custom."))

    def validate_colors(self):
        for fieldname in COLOR_FIELDS:
            value = (self.get(fieldname) or "").strip()
            if not HEX_COLOR_PATTERN.match(value):
                label = frappe.unscrub(fieldname)
                frappe.throw(_("{0} must be a valid hex color like #2563EB.").format(label))
            self.set(fieldname, value.upper())

    def validate_global_access(self):
        if self.apply_for != "Global":
            return

        if frappe.session.user == "Administrator" or "System Manager" in frappe.get_roles():
            return

        frappe.throw(_("Only a System Manager can apply the theme globally."))
