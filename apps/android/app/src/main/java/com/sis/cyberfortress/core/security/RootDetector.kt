package com.sis.cyberfortress.core.security

import android.content.Context
import android.os.Build
import java.io.File

data class DeviceIntegrityResult(
    val isRooted: Boolean,
    val hasSuBinary: Boolean,
    val hasTestKeys: Boolean,
    val hasDangerousProps: Boolean,
    val details: List<String>,
    val riskScore: Int // 0 (Clean) to 100 (Compromised)
)

object RootDetector {

    private val SU_PATHS = arrayOf(
        "/system/app/Superuser.apk",
        "/sbin/su",
        "/system/bin/su",
        "/system/xbin/su",
        "/data/local/xbin/su",
        "/data/local/bin/su",
        "/system/sd/xbin/su",
        "/system/bin/failsafe/su",
        "/data/local/su",
        "/su/bin/su"
    )

    fun checkIntegrity(context: Context): DeviceIntegrityResult {
        val findings = mutableListOf<String>()
        var score = 0

        // 1. Check for 'test-keys' build tag (sign of custom untrusted ROM)
        val buildTags = Build.TAGS
        val hasTestKeys = buildTags != null && buildTags.contains("test-keys")
        if (hasTestKeys) {
            findings.add("Custom firmware detected: OS build signed with release test-keys")
            score += 35
        }

        // 2. Check for su binary existence on filesystem
        var hasSuBinary = false
        for (path in SU_PATHS) {
            try {
                if (File(path).exists()) {
                    hasSuBinary = true
                    findings.add("Root binary found: $path")
                    score += 50
                    break
                }
            } catch (_: Exception) {
                // Ignore file permission errors
            }
        }

        // 3. Check for dangerous ro.debuggable / ro.secure system properties
        var hasDangerousProps = false
        try {
            val process = Runtime.getRuntime().exec("getprop ro.debuggable")
            val reader = process.inputStream.bufferedReader()
            val prop = reader.readLine()
            if (prop != null && prop.trim() == "1") {
                hasDangerousProps = true
                findings.add("System property ro.debuggable is enabled (Vulnerable to ADB tampering)")
                score += 20
            }
        } catch (_: Exception) {
            // Read failure
        }

        val isRooted = hasSuBinary || (hasTestKeys && hasDangerousProps) || score >= 60

        return DeviceIntegrityResult(
            isRooted = isRooted,
            hasSuBinary = hasSuBinary,
            hasTestKeys = hasTestKeys,
            hasDangerousProps = hasDangerousProps,
            details = findings,
            riskScore = score.coerceAtMost(100)
        )
    }
}
