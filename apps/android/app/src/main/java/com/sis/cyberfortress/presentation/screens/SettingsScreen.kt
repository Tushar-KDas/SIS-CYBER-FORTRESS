package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.storage.TokenManager
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun SettingsScreen(
    onLogout: () -> Unit
) {
    var user by remember { mutableStateOf(TokenManager.getUser()) }
    var currentBaseUrl by remember { mutableStateOf(TokenManager.getBaseUrl()) }
    var showEndpointDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }
    var showLogoutConfirmation by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "Settings",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Profile Card (Matching Showcase Screen 14)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(CyberAccentCyan.copy(alpha = 0.2f))
                        .border(2.dp, CyberAccentCyan, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = CyberAccentCyan,
                        modifier = Modifier.size(30.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = user?.fullName ?: "John Doe",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = user?.email ?: "john.doe@email.com",
                        fontSize = 13.sp,
                        color = Slate400
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Role: ${user?.roles?.firstOrNull() ?: "USER"}",
                        fontSize = 11.sp,
                        color = CyberEmerald,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Settings Items List
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCardBorder.copy(alpha = 0.35f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Column {
                SettingsRow(
                    icon = Icons.Default.Lock,
                    title = "Account Security",
                    onClick = { /* Security settings */ }
                )
                Divider(color = Slate800)
                SettingsRow(
                    icon = Icons.Default.Notifications,
                    title = "Notifications",
                    onClick = { /* Notification prefs */ }
                )
                Divider(color = Slate800)
                SettingsRow(
                    icon = Icons.Default.Security,
                    title = "Privacy & Data",
                    onClick = { /* Privacy */ }
                )
                Divider(color = Slate800)
                SettingsRow(
                    icon = Icons.Default.Dns,
                    title = "Server Endpoint Configuration",
                    subtitle = currentBaseUrl,
                    onClick = { showEndpointDialog = true }
                )
                Divider(color = Slate800)
                SettingsRow(
                    icon = Icons.Default.Settings,
                    title = "App Preferences",
                    onClick = { /* Prefs */ }
                )
                Divider(color = Slate800)
                SettingsRow(
                    icon = Icons.Default.Info,
                    title = "About App",
                    subtitle = "v1.0.0 (Production)",
                    onClick = { showAboutDialog = true }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Red Logout Button (Matching Showcase Screen 14)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCrimson.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                .clickable { showLogoutConfirmation = true },
            colors = CardDefaults.cardColors(containerColor = CyberCrimson.copy(alpha = 0.1f))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Logout,
                    contentDescription = "Logout",
                    tint = CyberCrimson,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Text(
                    text = "Logout",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyberCrimson
                )
            }
        }
    }

    // Endpoint Configuration Dialog
    if (showEndpointDialog) {
        var tempUrl by remember { mutableStateOf(currentBaseUrl) }

        AlertDialog(
            onDismissRequest = { showEndpointDialog = false },
            title = {
                Text("Backend Server Endpoint", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Set the NestJS Backend URL. Use http://10.0.2.2:4000/api/v1/ for Emulator, or your PC's LAN IP for physical device.",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                    OutlinedTextField(
                        value = tempUrl,
                        onValueChange = { tempUrl = it },
                        label = { Text("Base URL", fontSize = 12.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        ApiClient.updateBaseUrl(tempUrl.trim())
                        currentBaseUrl = TokenManager.getBaseUrl()
                        showEndpointDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text("Save & Apply", color = TextWhite)
                }
            },
            dismissButton = {
                TextButton(onClick = { showEndpointDialog = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = CyberDarkCard
        )
    }

    // About Dialog
    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title = {
                Text("SIS Cyber Fortress", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Version 1.0.0 (Native Android)", fontSize = 13.sp, color = CyberAccentCyan)
                    Text("12-in-1 Unified Enterprise Cybersecurity Ecosystem", fontSize = 12.sp, color = TextWhite)
                    Text("Powered by Kotlin, Jetpack Compose, NestJS, and PostgreSQL.", fontSize = 12.sp, color = Slate400)
                }
            },
            confirmButton = {
                Button(
                    onClick = { showAboutDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text("OK", color = TextWhite)
                }
            },
            containerColor = CyberDarkCard
        )
    }

    // Logout Confirmation Dialog
    if (showLogoutConfirmation) {
        AlertDialog(
            onDismissRequest = { showLogoutConfirmation = false },
            title = {
                Text("Confirm Logout", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Text("Are you sure you want to end your secure session?", fontSize = 13.sp, color = Slate400)
            },
            confirmButton = {
                Button(
                    onClick = {
                        TokenManager.clear()
                        showLogoutConfirmation = false
                        onLogout()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCrimson)
                ) {
                    Text("Logout", color = TextWhite)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutConfirmation = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = CyberDarkCard
        )
    }
}

@Composable
fun SettingsRow(
    icon: ImageVector,
    title: String,
    subtitle: String? = null,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = CyberAccentCyan,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(14.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 14.sp,
                color = TextWhite,
                fontWeight = FontWeight.Medium
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = Slate400,
                    maxLines = 1
                )
            }
        }
        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Slate500,
            modifier = Modifier.size(18.dp)
        )
    }
}
