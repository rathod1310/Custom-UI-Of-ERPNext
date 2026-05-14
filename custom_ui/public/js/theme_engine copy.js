frappe.ready(function () {

    frappe.call({
        method: "custom_ui.api.theme.get_theme",
        callback: function(r) {

            if (!r.message) return;

            let t = r.message;

            let glass = t.glass_effect ? `
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            ` : '';

            let neon = t.neon_effect ? `
                box-shadow:
                    0 0 10px ${t.primary_color},
                    0 0 20px ${t.primary_color};
            ` : '';

            let animation = t.enable_animation ? `
                transition: all 0.3s ease;
            ` : '';

            let rounded = t.rounded_ui ? `
                border-radius:${t.border_radius}px !important;
            ` : '';

            let css = `

                :root {

                    --primary: ${t.primary_color};
                    --secondary: ${t.secondary_color};

                    --navbar-bg: ${t.navbar_color};
                    --sidebar-bg: ${t.sidebar_color};

                    --bg-color: ${t.background_color};

                    --text-color: ${t.text_color};

                    --card-bg: ${t.card_color};

                    --button-bg: ${t.button_color};

                    --gradient:
                        linear-gradient(
                            135deg,
                            ${t.gradient_start},
                            ${t.gradient_end}
                        );
                }

                body {

                    background:
                        url('${t.background_image || ""}')
                        no-repeat center center fixed,
                        var(--bg-color) !important;

                    background-size: cover !important;

                    color: var(--text-color) !important;

                    ${animation}
                }

                .navbar {

                    background: var(--navbar-bg) !important;

                    ${glass}

                    ${neon}

                    ${rounded}
                }

                .layout-side-section {

                    background: var(--sidebar-bg) !important;

                    ${glass}

                    ${rounded}
                }

                .standard-sidebar-item:hover {

                    background: var(--gradient) !important;

                    color: white !important;
                }

                .page-container,
                .layout-main-section {

                    background: transparent !important;
                }

                .card,
                .widget,
                .form-section {

                    background: var(--card-bg) !important;

                    border: 1px solid rgba(255,255,255,0.06);

                    ${glass}

                    ${neon}

                    ${rounded}

                    ${animation}
                }

                .card:hover {

                    transform: translateY(-3px);
                }

                .btn-primary {

                    background: var(--gradient) !important;

                    border: none !important;

                    color: white !important;

                    ${rounded}

                    ${neon}

                    ${animation}
                }

                .btn-primary:hover {

                    transform: scale(1.03);
                }

                .form-control {

                    background: rgba(255,255,255,0.06) !important;

                    color: var(--text-color) !important;

                    border: 1px solid rgba(255,255,255,0.08);

                    ${rounded}
                }

                .datatable {

                    background: var(--card-bg) !important;

                    ${rounded}
                }

                .datatable .dt-row:hover {

                    background: rgba(255,255,255,0.04) !important;
                }

                .workspace-card,
                .desk-shortcut-widget-box {

                    background: var(--gradient) !important;

                    color: white !important;

                    ${rounded}

                    ${neon}
                }

                .modal-content {

                    background: var(--card-bg) !important;

                    ${glass}

                    ${rounded}

                    ${neon}
                }

                .dropdown-menu {

                    background: var(--card-bg) !important;

                    ${rounded}

                    ${glass}
                }

                .list-row:hover {

                    background: rgba(255,255,255,0.05) !important;
                }

                .page-head {

                    background: transparent !important;

                    border: none !important;
                }

                .app-logo {

                    max-height: 38px !important;
                }
            `;

            let style = document.createElement("style");

            style.innerHTML = css;

            document.head.appendChild(style);

            /* LOGO */

            if (t.app_logo) {

                let logos = document.querySelectorAll(".app-logo");

                logos.forEach(function(l) {

                    l.src = t.app_logo;
                });
            }

            /* DARK MODE */

            if (t.theme_mode === "Dark") {

                document.body.classList.add("dark-mode");
            }
        }
    });
});