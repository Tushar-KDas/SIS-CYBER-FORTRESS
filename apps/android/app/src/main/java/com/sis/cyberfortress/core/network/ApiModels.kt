package com.sis.cyberfortress.core.network

import com.google.gson.annotations.SerializedName

// Generic API Envelope returned by NestJS TransformInterceptor
data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T?,
    @SerializedName("timestamp") val timestamp: String?
)

// --- Authentication DTOs ---

data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("mfaCode") val mfaCode: String? = null
)

data class LoginResponse(
    @SerializedName("accessToken") val accessToken: String? = null,
    @SerializedName("expiresAt") val expiresAt: String? = null,
    @SerializedName("user") val user: UserDto? = null,
    @SerializedName("mfaRequired") val mfaRequired: Boolean = false,
    @SerializedName("tempToken") val tempToken: String? = null,
    @SerializedName("message") val message: String? = null
)

data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("fullName") val fullName: String
)

data class MfaVerifyRequest(
    @SerializedName("code") val code: String
)

data class UserDto(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("fullName") val fullName: String,
    @SerializedName("roles") val roles: List<String> = emptyList(),
    @SerializedName("permissions") val permissions: List<String> = emptyList(),
    @SerializedName("isMfaEnabled") val isMfaEnabled: Boolean = false,
    @SerializedName("securityScore") val securityScore: Int = 98,
    @SerializedName("status") val status: String? = "ACTIVE"
)

// --- SOC & Dashboard DTOs ---

data class SocOverviewDto(
    @SerializedName("metrics") val metrics: SocMetricsDto?,
    @SerializedName("trends") val trends: List<TrendItemDto> = emptyList(),
    @SerializedName("recentAlerts") val recentAlerts: List<SecurityAlertDto> = emptyList(),
    @SerializedName("recentIncidents") val recentIncidents: List<IncidentDto> = emptyList()
)

data class SocMetricsDto(
    @SerializedName("totalAlerts") val totalAlerts: Int = 23,
    @SerializedName("unresolvedAlerts") val unresolvedAlerts: Int = 23,
    @SerializedName("criticalAlerts") val criticalAlerts: Int = 4,
    @SerializedName("openIncidents") val openIncidents: Int = 7,
    @SerializedName("criticalIncidents") val criticalIncidents: Int = 2
)

data class TrendItemDto(
    @SerializedName("day") val day: String,
    @SerializedName("alerts") val alerts: Int,
    @SerializedName("incidents") val incidents: Int
)

data class SecurityAlertDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String? = null,
    @SerializedName("moduleKey") val moduleKey: String? = "identity-guardian",
    @SerializedName("severity") val severity: String = "INFORMATIONAL", // CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
    @SerializedName("status") val status: String = "UNRESOLVED",       // UNRESOLVED, INVESTIGATING, RESOLVED, FALSE_POSITIVE
    @SerializedName("sourceIp") val sourceIp: String? = null,
    @SerializedName("targetResource") val targetResource: String? = null,
    @SerializedName("createdAt") val createdAt: String = "Just now"
)

data class IncidentDto(
    @SerializedName("id") val id: String,
    @SerializedName("incidentNumber") val incidentNumber: String = "#INC-2025-001",
    @SerializedName("title") val title: String,
    @SerializedName("summary") val summary: String,
    @SerializedName("status") val status: String = "NEW",         // NEW, TRIAGED, INVESTIGATING, CONTAINMENT, RESOLVED, CLOSED
    @SerializedName("priority") val priority: String = "MEDIUM",   // CRITICAL, HIGH, MEDIUM, LOW
    @SerializedName("assignedToName") val assignedToName: String? = "Security Team",
    @SerializedName("createdAt") val createdAt: String = "Recently"
)

// --- Device Management (Endpoint Guardian) DTOs ---

data class DeviceDto(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("name") val name: String,
    @SerializedName("platform") val platform: String, // ANDROID, WINDOWS, IOS, MACOS, LINUX
    @SerializedName("osVersion") val osVersion: String,
    @SerializedName("ipAddress") val ipAddress: String? = null,
    @SerializedName("macAddress") val macAddress: String? = null,
    @SerializedName("status") val status: String = "ACTIVE",
    @SerializedName("securityScore") val securityScore: Int = 95,
    @SerializedName("lastSeenAt") val lastSeenAt: String = "Recently"
)

data class RegisterDeviceRequest(
    @SerializedName("name") val name: String,
    @SerializedName("platform") val platform: String = "ANDROID",
    @SerializedName("osVersion") val osVersion: String,
    @SerializedName("ipAddress") val ipAddress: String? = null,
    @SerializedName("macAddress") val macAddress: String? = null
)

data class DeviceTelemetryRequest(
    @SerializedName("batteryLevel") val batteryLevel: Int? = null,
    @SerializedName("isRooted") val isRooted: Boolean = false,
    @SerializedName("securityPatchLevel") val securityPatchLevel: String? = null,
    @SerializedName("installedAppsCount") val installedAppsCount: Int? = null,
    @SerializedName("screenLockEnabled") val screenLockEnabled: Boolean = true,
    @SerializedName("osVersion") val osVersion: String? = null
)

// --- Vault Guardian (Zero-Knowledge AES-256-GCM) DTOs ---

data class VaultItemDto(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("title") val title: String,
    @SerializedName("category") val category: String = "PASSWORD", // PASSWORD, SECURE_NOTE, CREDENTIAL, RECOVERY_KEY
    @SerializedName("ciphertext") val ciphertext: String,
    @SerializedName("iv") val iv: String,
    @SerializedName("salt") val salt: String,
    @SerializedName("authTag") val authTag: String,
    @SerializedName("createdAt") val createdAt: String = "Just now",
    @SerializedName("updatedAt") val updatedAt: String? = null,
    // Transient field for decrypted plaintext in memory only
    @Transient var decryptedSecret: String? = null
)

data class CreateVaultItemRequest(
    @SerializedName("title") val title: String,
    @SerializedName("category") val category: String,
    @SerializedName("ciphertext") val ciphertext: String,
    @SerializedName("iv") val iv: String,
    @SerializedName("salt") val salt: String,
    @SerializedName("authTag") val authTag: String
)

// --- Phishing Shield DTOs ---

data class PhishingScanRequest(
    @SerializedName("url") val url: String,
    @SerializedName("userId") val userId: String? = null
)

data class PhishingScanResponse(
    @SerializedName("id") val id: String? = null,
    @SerializedName("url") val url: String,
    @SerializedName("riskScore") val riskScore: Int = 0,
    @SerializedName("riskLevel") val riskLevel: String = "LOW", // SAFE, LOW, MEDIUM, HIGH, CRITICAL
    @SerializedName("isSafe") val isSafe: Boolean = true,
    @SerializedName("reputation") val reputation: String = "Trusted",
    @SerializedName("indicators") val indicators: List<String> = emptyList(),
    @SerializedName("checks") val checks: Map<String, Boolean>? = null,
    @SerializedName("createdAt") val createdAt: String? = null
)

data class ThreatReportRequest(
    @SerializedName("targetUrl") val targetUrl: String,
    @SerializedName("category") val category: String,
    @SerializedName("comment") val comment: String? = null,
    @SerializedName("submittedBy") val submittedBy: String? = null
)

// --- Network Sentinel DTOs ---

data class NetworkSnapshotRequest(
    @SerializedName("ssid") val ssid: String? = null,
    @SerializedName("bssid") val bssid: String? = null,
    @SerializedName("securityType") val securityType: String = "WPA3",
    @SerializedName("isVpnActive") val isVpnActive: Boolean = false,
    @SerializedName("ipAddress") val ipAddress: String? = null,
    @SerializedName("gatewayIp") val gatewayIp: String? = null
)

// --- Notifications & Reports ---

data class NotificationDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("message") val message: String,
    @SerializedName("type") val type: String = "INFO", // CRITICAL, WARNING, INFO, SUCCESS
    @SerializedName("isRead") val isRead: Boolean = false,
    @SerializedName("createdAt") val createdAt: String = "Just now"
)

data class SecurityModuleDto(
    @SerializedName("id") val id: String,
    @SerializedName("key") val key: String,
    @SerializedName("name") val name: String,
    @SerializedName("tagline") val tagline: String,
    @SerializedName("description") val description: String,
    @SerializedName("category") val category: String,
    @SerializedName("status") val status: String = "Active",
    @SerializedName("version") val version: String = "1.0.0",
    @SerializedName("capabilities") val capabilities: List<String> = emptyList()
)

data class ReportSummaryDto(
    @SerializedName("totalAlerts") val totalAlerts: Int = 245,
    @SerializedName("alertsChangePercent") val alertsChangePercent: Int = 12,
    @SerializedName("totalIncidents") val totalIncidents: Int = 12,
    @SerializedName("incidentsChangePercent") val incidentsChangePercent: Int = 8,
    @SerializedName("severityBreakdown") val severityBreakdown: Map<String, Int> = mapOf(
        "CRITICAL" to 15,
        "HIGH" to 42,
        "MEDIUM" to 78,
        "LOW" to 110
    )
)
