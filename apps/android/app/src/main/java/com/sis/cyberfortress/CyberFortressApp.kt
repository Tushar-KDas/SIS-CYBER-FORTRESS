package com.sis.cyberfortress

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.storage.TokenManager

class CyberFortressApp : Application() {

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Secure Storage
        TokenManager.init(this)

        // Initialize Dynamic API Client with configured or default host
        val currentBaseUrl = TokenManager.getBaseUrl()
        ApiClient.init(currentBaseUrl)

        // Create Android High-Priority Security Notification Channel
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                SECURITY_ALERT_CHANNEL_ID,
                "SIS Security Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time threat notifications, compromised device alerts, and SOC incident dispatches."
                enableLights(true)
                enableVibration(true)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }

    companion object {
        lateinit var instance: CyberFortressApp
            private set

        const val SECURITY_ALERT_CHANNEL_ID = "sis_security_alerts"
    }
}
