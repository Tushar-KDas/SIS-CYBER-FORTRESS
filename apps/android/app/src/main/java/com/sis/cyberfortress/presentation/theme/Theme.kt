package com.sis.cyberfortress.presentation.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = CyberAccentCyan,
    onPrimary = Color.Black,
    primaryContainer = CyberDarkCard,
    onPrimaryContainer = CyberAccentCyan,
    secondary = CyberAccentBlue,
    onSecondary = Color.White,
    background = CyberObsidian,
    onBackground = TextWhite,
    surface = CyberDarkCard,
    onSurface = TextWhite,
    surfaceVariant = CyberSurface,
    onSurfaceVariant = Slate400,
    outline = CyberCardBorder,
    error = CyberCrimson,
    onError = Color.White
)

@Composable
fun CyberFortressTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Always use our custom enterprise cyberpunk dark theme matching showcase
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography(),
        content = content
    )
}
