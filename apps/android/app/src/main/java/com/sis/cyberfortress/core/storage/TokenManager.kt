package com.sis.cyberfortress.core.storage

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.sis.cyberfortress.core.network.UserDto

object TokenManager {
    private const val PREF_NAME = "sis_cyber_fortress_secure_prefs"
    private const val KEY_ACCESS_TOKEN = "access_token"
    private const val KEY_BASE_URL = "base_url"
    private const val KEY_USER_DATA = "user_data"
    private const val KEY_DEVICE_ID = "enrolled_device_id"
    private const val KEY_REMEMBER_ME = "remember_me"
    private const val KEY_FCM_TOKEN = "fcm_token"

    // Default to Android Emulator loopback alias to host port 4000
    const val DEFAULT_BASE_URL = "http://10.0.2.2:4000/api/v1/"

    private lateinit var prefs: SharedPreferences
    private val gson = Gson()

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun saveAuth(token: String, user: UserDto) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, token)
            .putString(KEY_USER_DATA, gson.toJson(user))
            .apply()
    }

    fun getAccessToken(): String? {
        return prefs.getString(KEY_ACCESS_TOKEN, null)
    }

    fun getUser(): UserDto? {
        val userJson = prefs.getString(KEY_USER_DATA, null) ?: return null
        return try {
            gson.fromJson(userJson, UserDto::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun getBaseUrl(): String {
        return prefs.getString(KEY_BASE_URL, DEFAULT_BASE_URL) ?: DEFAULT_BASE_URL
    }

    fun setBaseUrl(url: String) {
        var cleanUrl = url.trim()
        if (!cleanUrl.endsWith("/")) {
            cleanUrl += "/"
        }
        prefs.edit().putString(KEY_BASE_URL, cleanUrl).apply()
    }

    fun setEnrolledDeviceId(deviceId: String) {
        prefs.edit().putString(KEY_DEVICE_ID, deviceId).apply()
    }

    fun getEnrolledDeviceId(): String? {
        return prefs.getString(KEY_DEVICE_ID, null)
    }

    fun setRememberMe(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_REMEMBER_ME, enabled).apply()
    }

    fun isRememberMe(): Boolean {
        return prefs.getBoolean(KEY_REMEMBER_ME, false)
    }

    fun saveFcmToken(token: String) {
        prefs.edit().putString(KEY_FCM_TOKEN, token).apply()
    }

    fun getFcmToken(): String? {
        return prefs.getString(KEY_FCM_TOKEN, null)
    }

    fun clear() {
        val currentBaseUrl = getBaseUrl()
        val currentDeviceId = getEnrolledDeviceId()
        prefs.edit().clear().apply()
        // Retain infrastructure endpoint and device binding across session logouts
        setBaseUrl(currentBaseUrl)
        if (currentDeviceId != null) {
            setEnrolledDeviceId(currentDeviceId)
        }
    }
}
