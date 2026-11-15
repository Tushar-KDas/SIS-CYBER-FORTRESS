package com.sis.cyberfortress.core.security

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build

data class NetworkSecurityReport(
    val isConnected: Boolean,
    val isWifi: Boolean,
    val isCellular: Boolean,
    val isVpnActive: Boolean,
    val hasCaptivePortal: Boolean,
    val securityLevel: String, // SECURE, MODERATE, HIGH_RISK
    val warnings: List<String>
)

object NetworkThreatAnalyzer {

    fun analyzeNetwork(context: Context): NetworkSecurityReport {
        val connectivityManager =
            context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager

        if (connectivityManager == null) {
            return NetworkSecurityReport(
                isConnected = false,
                isWifi = false,
                isCellular = false,
                isVpnActive = false,
                hasCaptivePortal = false,
                securityLevel = "UNKNOWN",
                warnings = listOf("Unable to access system ConnectivityManager")
            )
        }

        val activeNetwork = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork)

        if (capabilities == null) {
            return NetworkSecurityReport(
                isConnected = false,
                isWifi = false,
                isCellular = false,
                isVpnActive = false,
                hasCaptivePortal = false,
                securityLevel = "OFFLINE",
                warnings = listOf("No active network connection detected")
            )
        }

        val isWifi = capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
        val isCellular = capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
        val isVpnActive = capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)

        val hasCaptivePortal = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_CAPTIVE_PORTAL)
        } else {
            false
        }

        val warnings = mutableListOf<String>()

        if (hasCaptivePortal) {
            warnings.add("Captive Portal detected: Traffic may be intercepted or redirected by the gateway")
        }

        if (isWifi && !isVpnActive) {
            warnings.add("Unencrypted Wi-Fi or public hotspot without active corporate VPN encryption")
        }

        val securityLevel = when {
            hasCaptivePortal -> "HIGH_RISK"
            isWifi && !isVpnActive -> "MODERATE"
            else -> "SECURE"
        }

        return NetworkSecurityReport(
            isConnected = true,
            isWifi = isWifi,
            isCellular = isCellular,
            isVpnActive = isVpnActive,
            hasCaptivePortal = hasCaptivePortal,
            securityLevel = securityLevel,
            warnings = warnings
        )
    }
}
