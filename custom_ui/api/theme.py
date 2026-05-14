import frappe
import json

@frappe.whitelist(allow_guest=True)
def get_theme():
    try:
        doc = frappe.get_single("Custom Theme Settings")
        theme_data = doc.as_dict()
        
        # Remove internal frappe fields
        clean = {}
        fields = [
            "theme_name", "theme_preset", "app_logo",
            "primary_color", "secondary_color", "navbar_color",
            "sidebar_color", "background_color", "text_color",
            "card_color", "button_color", "border_radius",
            "glass_effect", "neon_effect", "enable_animation",
            "rounded_ui", "font_family", "font_size",
            "sidebar_width", "gradient_start", "gradient_end",
            "background_image", "theme_mode"
        ]
        for f in fields:
            if f in theme_data:
                clean[f] = theme_data[f]
        
        return clean
    except Exception:
        # Return safe defaults if doctype not found
        return {
            "primary_color": "#4f46e5",
            "secondary_color": "#6366f1",
            "navbar_color": "#ffffff",
            "sidebar_color": "#ffffff",
            "background_color": "#f5f6fa",
            "text_color": "#111827",
            "card_color": "#ffffff",
            "button_color": "#4f46e5",
            "border_radius": 14
        }

@frappe.whitelist()
def save_theme(theme_data):
    """Save theme and bust cache"""
    try:
        data = json.loads(theme_data) if isinstance(theme_data, str) else theme_data
        doc = frappe.get_single("Custom Theme Settings")
        for key, value in data.items():
            if hasattr(doc, key):
                setattr(doc, key, value)
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        
        # Clear site cache so changes reflect immediately
        frappe.clear_cache()
        return {"success": True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Theme Save Error")
        return {"success": False, "error": str(e)}