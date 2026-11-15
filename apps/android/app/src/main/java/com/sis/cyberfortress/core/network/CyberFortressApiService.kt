package com.sis.cyberfortress.core.network

import retrofit2.Response
import retrofit2.http.*

interface CyberFortressApiService {

    // --- Authentication ---
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<LoginResponse>>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<ApiResponse<UserDto>>

    @GET("auth/me")
    suspend fun getProfile(): Response<ApiResponse<UserDto>>

    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponse<Map<String, Any>>>

    @POST("auth/mfa/verify")
    suspend fun verifyMfa(@Body request: MfaVerifyRequest): Response<ApiResponse<Map<String, Any>>>

    // --- SOC & Dashboard ---
    @GET("soc/overview")
    suspend fun getSocOverview(): Response<ApiResponse<SocOverviewDto>>

    @GET("soc/alerts")
    suspend fun getAlerts(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("status") status: String? = null,
        @Query("severity") severity: String? = null
    ): Response<ApiResponse<List<SecurityAlertDto>>>

    @GET("soc/incidents")
    suspend fun getIncidents(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("status") status: String? = null,
        @Query("priority") priority: String? = null
    ): Response<ApiResponse<List<IncidentDto>>>

    // --- Devices (Endpoint Guardian) ---
    @GET("devices")
    suspend fun getDevices(): Response<ApiResponse<List<DeviceDto>>>

    @POST("devices/register")
    suspend fun registerDevice(@Body request: RegisterDeviceRequest): Response<ApiResponse<DeviceDto>>

    @POST("devices/{id}/telemetry")
    suspend fun sendDeviceTelemetry(
        @Path("id") deviceId: String,
        @Body telemetry: DeviceTelemetryRequest
    ): Response<ApiResponse<Map<String, Any>>>

    // --- Vault Guardian (Zero-Knowledge) ---
    @GET("vault/items")
    suspend fun getVaultItems(): Response<ApiResponse<List<VaultItemDto>>>

    @POST("vault/items")
    suspend fun createVaultItem(@Body request: CreateVaultItemInput): Response<ApiResponse<VaultItemDto>>

    @DELETE("vault/items/{id}")
    suspend fun deleteVaultItem(@Path("id") itemId: String): Response<ApiResponse<Map<String, Any>>>

    // --- Phishing Shield ---
    @POST("phishing/scan")
    suspend fun scanUrl(@Body request: PhishingScanRequest): Response<ApiResponse<PhishingScanResponse>>

    @POST("phishing/report")
    suspend fun submitThreatReport(@Body request: ThreatReportRequest): Response<ApiResponse<Map<String, Any>>>

    // --- Network Sentinel ---
    @POST("network-sentinel/snapshots")
    suspend fun postNetworkSnapshot(@Body request: NetworkSnapshotRequest): Response<ApiResponse<Map<String, Any>>>

    // --- Modules & System ---
    @GET("modules")
    suspend fun getModules(): Response<ApiResponse<List<SecurityModuleDto>>>

    @GET("reports/summary")
    suspend fun getReportsSummary(): Response<ApiResponse<ReportSummaryDto>>

    @GET("notifications")
    suspend fun getNotifications(): Response<ApiResponse<List<NotificationDto>>>
}

data class CreateVaultItemInput(
    val title: String,
    val category: String,
    val ciphertext: String,
    val iv: String,
    val salt: String,
    val authTag: String
)
