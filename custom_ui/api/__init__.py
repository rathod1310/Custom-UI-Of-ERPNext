import frappe


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


@frappe.whitelist()
def get_active_theme():
    """Return the active Single DocType theme for the current Desk user."""
    doc = frappe.get_single("Custom Theme Settings")

    if not doc.enabled:
        return {"enabled": 0}

    if doc.apply_for == "Current User":
        theme_user = frappe.db.get_default(CURRENT_USER_DEFAULT_KEY)
        if theme_user != frappe.session.user:
            return {"enabled": 0}

    return _theme_response(doc)


def _theme_response(doc):
    data = {
        "enabled": 1,
        "name": doc.name,
        "apply_for": doc.apply_for,
        "theme_mode": doc.theme_mode,
        "palette": doc.palette,
    }

    for fieldname in COLOR_FIELDS:
        data[fieldname] = doc.get(fieldname)

    return data


__all__ = ["get_active_theme"]
