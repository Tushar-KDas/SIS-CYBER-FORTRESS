package com.sis.cyberfortress.presentation.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object Register : Screen("register")
    object MfaVerify : Screen("mfa_verify")
    object Dashboard : Screen("dashboard")
    object Modules : Screen("modules")
    object ModuleDetail : Screen("module_detail/{moduleKey}") {
        fun createRoute(moduleKey: String) = "module_detail/$moduleKey"
    }
    object Alerts : Screen("alerts")
    object Incidents : Screen("incidents")
    object Devices : Screen("devices")
    object Vault : Screen("vault")
    object PhishingScan : Screen("phishing_scan")
    object NetworkSentinel : Screen("network_sentinel")
    object Reports : Screen("reports")
    object Settings : Screen("settings")
}
