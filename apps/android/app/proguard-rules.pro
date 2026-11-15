# SIS Cyber Fortress ProGuard / R8 Rules

-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod

# Keep Gson serialization models
-keep class com.sis.cyberfortress.core.network.** { *; }
-keepclassmembers class com.sis.cyberfortress.core.network.** { *; }

# Keep Cryptographic and Security DTOs
-keep class com.sis.cyberfortress.core.crypto.** { *; }
-keep class com.sis.cyberfortress.core.security.** { *; }

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-keepclasseswithmembers interface * {
    @retrofit2.http.* <methods>;
}
