package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.sis.cyberfortress.core.network.CyberRepository
import com.sis.cyberfortress.core.network.DeviceDto
import com.sis.cyberfortress.presentation.theme.*
import kotlinx.coroutines.launch

@Composable
fun DevicesScreen() {
    var devices by remember { mutableStateOf<List<DeviceDto>>(emptyList()) }
    var isRegistering by remember { mutableStateOf(false) }
    var snackbarMessage by remember { mutableStateOf<String?>(null) }

    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        devices = CyberRepository.getDevices()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "My Devices",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = TextWhite
            )

            Button(
                onClick = {
                    isRegistering = true
                    coroutineScope.launch {
                        val enrolled = CyberRepository.registerCurrentDevice()
                        devices = CyberRepository.getDevices()
                        isRegistering = false
                        snackbarMessage = "Successfully enrolled ${enrolled.name}"
                    }
                },
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                enabled = !isRegistering
            ) {
                if (isRegistering) {
                    CircularProgressIndicator(color = TextWhite, modifier = Modifier.size(16.dp))
                } else {
                    Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("+ Register Device", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        if (snackbarMessage != null) {
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "✓ $snackbarMessage",
                color = CyberEmerald,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(devices) { device ->
                DeviceCard(device = device)
            }
        }
    }
}

@Composable
fun DeviceCard(device: DeviceDto) {
    val (icon, color) = when (device.platform.uppercase()) {
        "ANDROID" -> Pair(Icons.Default.PhoneAndroid, CyberEmerald)
        "WINDOWS" -> Pair(Icons.Default.Laptop, CyberAccentCyan)
        "IOS", "MACOS" -> Pair(Icons.Default.PhoneIphone, CyberAccentBlue)
        else -> Pair(Icons.Default.Devices, CyberInfo)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, CyberCardBorder.copy(alpha = 0.35f), RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Row(
            modifier = Modifier.padding(18.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f))
                    .border(1.dp, color.copy(alpha = 0.4f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = device.name,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "${device.osVersion}  •  ${device.ipAddress ?: "192.168.1.1"}",
                    fontSize = 12.sp,
                    color = Slate400
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Last Seen: ${device.lastSeenAt}",
                    fontSize = 11.sp,
                    color = Slate500
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(CyberEmerald.copy(alpha = 0.15f))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = device.status,
                    fontSize = 11.sp,
                    color = CyberEmerald,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
