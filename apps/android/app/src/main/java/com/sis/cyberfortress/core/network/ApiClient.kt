package com.sis.cyberfortress.core.network

import com.sis.cyberfortress.core.storage.TokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private var retrofit: Retrofit? = null
    private var service: CyberFortressApiService? = null
    private var currentBaseUrl: String = TokenManager.DEFAULT_BASE_URL

    fun init(baseUrl: String) {
        currentBaseUrl = baseUrl
        val authInterceptor = Interceptor { chain ->
            val originalRequest = chain.request()
            val token = TokenManager.getAccessToken()

            val builder = originalRequest.newBuilder()
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("User-Agent", "SIS-Cyber-Fortress-Android/1.0.0 (Kotlin; Android)")

            if (!token.isNullOrBlank()) {
                builder.header("Authorization", "Bearer $token")
            }

            chain.proceed(builder.build())
        }

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .build()

        retrofit = Retrofit.Builder()
            .baseUrl(currentBaseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        service = retrofit?.create(CyberFortressApiService::class.java)
    }

    fun getService(): CyberFortressApiService {
        if (service == null) {
            init(TokenManager.getBaseUrl())
        }
        return service!!
    }

    fun updateBaseUrl(newUrl: String) {
        TokenManager.setBaseUrl(newUrl)
        init(TokenManager.getBaseUrl())
    }
}
