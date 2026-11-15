package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.security.NetworkSecurityReport
import com.sis.cyberfortress.core.security.NetworkThreatAnalyzer
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun NetworkSentinelScreen() {
    val context = LocalContext.current
    var report by remember { mutableStateOf<NetworkSecurityReport?>(null) }
    var isAuditing by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        report = NetworkThreatAnalyzer.analyzeNetwork(context)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "Network Sentinel",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Network Posture Summary Card
        val isSecure = report?.securityLevel == "SECURE"
        val statusColor = if (isSecure) CyberEmerald else CyberAmber

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, statusColor.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(statusColor.copy(alpha = 0.15f))
                            .border(1.dp, statusColor.copy(alpha = 0.4f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Wifi,
                            contentDescription = null,
                            tint = statusColor,
                            modifier = Modifier.size(26.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = "Network Security Status",
                            fontSize = 12.sp,
                            color = Slate400
                        )
                        Text(
                            text = report?.securityLevel ?: "SECURE",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = statusColor
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = Slate800)
                Spacer(modifier = Modifier.height(14.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Connection Type:", fontSize = 12.sp, color = Slate400)
                    Text(
                        if (report?.isWifi == true) "Wi-Fi (802.11ax)" else if (report?.isCellular == true) "Cellular (5G)" else "Local Wi-Fi",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Encrypted VPN Tunnel:", fontSize = 12.sp, color = Slate400)
                    Text(
                        if (report?.isVpnActive == true) "Active (WireGuard)" else "None (Direct Route)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (report?.isVpnActive == true) CyberEmerald else Slate400
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Captive Portal Interception:", fontSize = 12.sp, color = Slate400)
                    Text(
                        if (report?.hasCaptivePortal == true) "Flagged (Unsafe)" else "Clean (No Portal)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (report?.hasCaptivePortal == true) CyberCrimson else CyberEmerald
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Security Checklist Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = "Sentinel Network Checklist",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )

                Spacer(modifier = Modifier.height(12.dp))

                val checklist = listOf(
                    "WPA2/WPA3 Hardware Encryption Validated",
                    "Rogue AP & Beacon Spoofing Inactive",
                    "DNS Queries Protected Against Hijacking",
                    "No ARP Cache Poisoning Detected"
                )

                checklist.forEach { item ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = CyberEmerald,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(text = item, fontSize = 12.sp, color = TextWhite)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                isAuditing = true
                report = NetworkThreatAnalyzer.analyzeNetwork(context)
                isAuditing = false
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
        ) {
            if (isAuditing) {
                CircularProgressIndicator(color = TextWhite, modifier = Modifier.size(20.dp))
            } else {
                Text("Audit Current Network", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            }
        }
    }
}
