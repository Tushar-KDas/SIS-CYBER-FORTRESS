package com.sis.cyberfortress.core.crypto

import android.util.Base64
import com.sis.cyberfortress.core.network.VaultItemDto
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

data class EncryptedVaultBlob(
    val encryptedPayload: String, // Base64 ciphertext
    val nonce: String,            // Base64 12-byte IV
    val authTag: String,          // Base64 16-byte GCM tag
    val salt: String,             // Base64 32-byte PBKDF2 salt
    val version: Int = 1
)

object ZeroKnowledgeVault {

    private const val PBKDF2_ITERATIONS = 100_000
    private const val KEY_LENGTH_BITS = 256
    private const val GCM_NONCE_LENGTH_BYTES = 12
    private const val GCM_TAG_LENGTH_BITS = 128
    private const val SALT_LENGTH_BYTES = 32

    private val secureRandom = SecureRandom()

    /**
     * Encrypt sensitive data client-side before sending to the backend server.
     * The masterPassphrase NEVER leaves the user's device memory.
     */
    fun encrypt(plaintext: String, masterPassphrase: CharArray): EncryptedVaultBlob {
        // 1. Generate 32-byte cryptographic salt
        val saltBytes = ByteArray(SALT_LENGTH_BYTES)
        secureRandom.nextBytes(saltBytes)

        // 2. Derive 256-bit symmetric encryption key via PBKDF2
        val keySpec = PBEKeySpec(masterPassphrase, saltBytes, PBKDF2_ITERATIONS, KEY_LENGTH_BITS)
        val keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        val derivedKeyBytes = keyFactory.generateSecret(keySpec).encoded
        val secretKey = SecretKeySpec(derivedKeyBytes, "AES")

        // 3. Generate 12-byte GCM Nonce / IV
        val nonce = ByteArray(GCM_NONCE_LENGTH_BYTES)
        secureRandom.nextBytes(nonce)

        // 4. Encrypt with AES-256-GCM
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val gcmSpec = GCMParameterSpec(GCM_TAG_LENGTH_BITS, nonce)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec)

        val ciphertextWithTag = cipher.doFinal(plaintext.toByteArray(Charsets.UTF_8))

        // Split ciphertext and GCM authentication tag (last 16 bytes)
        val tagLengthBytes = GCM_TAG_LENGTH_BITS / 8
        val ciphertextLength = ciphertextWithTag.size - tagLengthBytes
        val ciphertext = ByteArray(ciphertextLength)
        val authTag = ByteArray(tagLengthBytes)

        System.arraycopy(ciphertextWithTag, 0, ciphertext, 0, ciphertextLength)
        System.arraycopy(ciphertextWithTag, ciphertextLength, authTag, 0, tagLengthBytes)

        return EncryptedVaultBlob(
            encryptedPayload = Base64.encodeToString(ciphertext, Base64.NO_WRAP),
            nonce = Base64.encodeToString(nonce, Base64.NO_WRAP),
            authTag = Base64.encodeToString(authTag, Base64.NO_WRAP),
            salt = Base64.encodeToString(saltBytes, Base64.NO_WRAP)
        )
    }

    /**
     * Decrypt encrypted ciphertext client-side using the masterPassphrase.
     */
    fun decrypt(item: VaultItemDto, masterPassphrase: CharArray): String {
        val ciphertextBytes = Base64.decode(item.ciphertext, Base64.NO_WRAP)
        val nonceBytes = Base64.decode(item.iv, Base64.NO_WRAP)
        val saltBytes = Base64.decode(item.salt, Base64.NO_WRAP)
        val authTagBytes = Base64.decode(item.authTag, Base64.NO_WRAP)

        // Combine ciphertext and tag for GCM cipher verification
        val combined = ByteArray(ciphertextBytes.size + authTagBytes.size)
        System.arraycopy(ciphertextBytes, 0, combined, 0, ciphertextBytes.size)
        System.arraycopy(authTagBytes, 0, combined, ciphertextBytes.size, authTagBytes.size)

        val keySpec = PBEKeySpec(masterPassphrase, saltBytes, PBKDF2_ITERATIONS, KEY_LENGTH_BITS)
        val keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        val derivedKeyBytes = keyFactory.generateSecret(keySpec).encoded
        val secretKey = SecretKeySpec(derivedKeyBytes, "AES")

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val gcmSpec = GCMParameterSpec(GCM_TAG_LENGTH_BITS, nonceBytes)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec)

        val decryptedBytes = cipher.doFinal(combined)
        return String(decryptedBytes, Charsets.UTF_8)
    }
}
