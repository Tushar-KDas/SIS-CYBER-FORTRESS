package com.sis.cyberfortress.core.security

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build

data class AppPrivacyAuditItem(
    val packageName: String,
    val appName: String,
    val isSystemApp: Boolean,
    val dangerousPermissions: List<String>,
    val riskScore: Int
)

data class DevicePrivacySummary(
    val totalAppsScanned: Int,
    val highRiskAppsCount: Int,
    val overprivilegedApps: List<AppPrivacyAuditItem>,
    val overallPrivacyScore: Int // 0 (Severe Risk) to 100 (Clean)
)

object PrivacyAuditor {

    private val DANGEROUS_PERMISSIONS = mapOf(
        "android.permission.RECORD_AUDIO" to 25,
        "android.permission.CAMERA" to 25,
        "android.permission.ACCESS_FINE_LOCATION" to 20,
        "android.permission.ACCESS_BACKGROUND_LOCATION" to 30,
        "android.permission.READ_SMS" to 25,
        "android.permission.READ_CONTACTS" to 15,
        "android.permission.BIND_ACCESSIBILITY_SERVICE" to 40,
        "android.permission.SYSTEM_ALERT_WINDOW" to 20
    )

    fun auditInstalledApps(context: Context): DevicePrivacySummary {
        val packageManager = context.packageManager
        val installedPackages: List<PackageInfo> = try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                packageManager.getInstalledPackages(PackageManager.PackageInfoFlags.of(PackageManager.GET_PERMISSIONS.toLong()))
            } else {
                @Suppress("DEPRECATION")
                packageManager.getInstalledPackages(PackageManager.GET_PERMISSIONS)
            }
        } catch (_: Exception) {
            emptyList()
        }

        val auditList = mutableListOf<AppPrivacyAuditItem>()
        var highRiskCount = 0

        for (pkg in installedPackages) {
            val isSystem = (pkg.applicationInfo?.flags ?: 0) and ApplicationInfo.FLAG_SYSTEM != 0
            if (isSystem) continue // Skip internal Android OS system packages

            val appName = pkg.applicationInfo?.loadLabel(packageManager)?.toString() ?: pkg.packageName
            val grantedDangerous = mutableListOf<String>()
            var appScore = 0

            pkg.requestedPermissions?.forEach { perm ->
                if (DANGEROUS_PERMISSIONS.containsKey(perm)) {
                    grantedDangerous.add(perm.replace("android.permission.", ""))
                    appScore += DANGEROUS_PERMISSIONS[perm] ?: 0
                }
            }

            if (grantedDangerous.isNotEmpty()) {
                val item = AppPrivacyAuditItem(
                    packageName = pkg.packageName,
                    appName = appName,
                    isSystemApp = false,
                    dangerousPermissions = grantedDangerous,
                    riskScore = appScore.coerceAtMost(100)
                )
                auditList.add(item)
                if (appScore >= 50) {
                    highRiskCount++
                }
            }
        }

        val totalNonSystem = auditList.size
        val overallPrivacyScore = if (totalNonSystem == 0) 100 else {
            (100 - (highRiskCount * 15)).coerceIn(10, 100)
        }

        return DevicePrivacySummary(
            totalAppsScanned = totalNonSystem,
            highRiskAppsCount = highRiskCount,
            overprivilegedApps = auditList.sortedByDescending { it.riskScore }.take(15),
            overallPrivacyScore = overallPrivacyScore
        )
    }
}
