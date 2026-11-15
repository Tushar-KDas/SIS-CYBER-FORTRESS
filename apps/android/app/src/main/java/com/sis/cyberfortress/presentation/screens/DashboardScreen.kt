package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.network.CyberRepository
import com.sis.cyberfortress.core.network.SecurityAlertDto
import com.sis.cyberfortress.core.network.SocOverviewDto
import com.sis.cyberfortress.presentation.components.QuickStatCard
import com.sis.cyberfortress.presentation.components.SecurityOverviewChart
import com.sis.cyberfortress.presentation.components.SecurityScoreGauge
import com.sis.cyberfortress.presentation.components.SeverityBadge
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun DashboardScreen(
    onNavigateToDevices: () -> Unit,
    onNavigateToAlerts: () -> Unit,
    onNavigateToIncidents: () -> Unit,
    onNavigateToModules: () -> Unit,
    onNavigateToVault: () -> Unit,
    onNavigateToPhishing: () -> Unit
) {
    var socOverview by remember { mutableStateOf<SocOverviewDto?>(null) }
    var recentAlerts by remember { mutableStateOf<List<SecurityAlertDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        val overview = CyberRepository.getSocOverview()
        socOverview = overview
        recentAlerts = overview.recentAlerts
        isLoading = false
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Security Score Gauge Card
        item {
            SecurityScoreGauge(score = 98)
        }

        // 2. 4 Quick Stat Cards (Devices, Alerts, Incidents, Modules)
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickStatCard(
                        title = "Devices",
                        value = "3",
                        icon = Icons.Default.Laptop,
                        iconColor = CyberAccentBlue,
                        onClick = onNavigateToDevices,
                        modifier = Modifier.weight(1f)
                    )
                    QuickStatCard(
                        title = "Alerts",
                        value = "${socOverview?.metrics?.totalAlerts ?: 2}",
                        icon = Icons.Default.Shield,
                        iconColor = CyberCrimson,
                        onClick = onNavigateToAlerts,
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickStatCard(
                        title = "Incidents",
                        value = "${socOverview?.metrics?.openIncidents ?: 0}",
                        icon = Icons.Default.Warning,
                        iconColor = CyberAmber,
                        onClick = onNavigateToIncidents,
                        modifier = Modifier.weight(1f)
                    )
                    QuickStatCard(
                        title = "Modules",
                        value = "12",
                        icon = Icons.Default.GridView,
                        iconColor = CyberAccentCyan,
                        onClick = onNavigateToModules,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // 3. Security Overview 7-Day Trend Spline Chart
        item {
            SecurityOverviewChart()
        }

        // 4. Quick Action Shortcuts (Vault & Phishing Scanner)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onNavigateToPhishing,
                    modifier = Modifier.weight(1f).height(46.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberDarkCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberAccentCyan.copy(alpha = 0.5f))
                ) {
                    Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = CyberAccentCyan, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Scan URL", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = onNavigateToVault,
                    modifier = Modifier.weight(1f).height(46.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberDarkCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberAccentBlue.copy(alpha = 0.5f))
                ) {
                    Icon(imageVector = Icons.Default.Key, contentDescription = null, tint = CyberAccentBlue, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Open Vault", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // 5. Recent Security Alerts Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.NotificationsActive,
                        contentDescription = null,
                        tint = CyberCrimson,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Recent Security Alerts",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                }
                Text(
                    text = "View All →",
                    fontSize = 12.sp,
                    color = CyberAccentCyan,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.clickable { onNavigateToAlerts() }
                )
            }
        }

        // 6. Alert Cards
        items(recentAlerts.take(3)) { alert ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CyberCardBorder.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                    .clickable { onNavigateToAlerts() },
                colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(
                                when (alert.severity.uppercase()) {
                                    "CRITICAL" -> CyberCrimson.copy(alpha = 0.2f)
                                    "HIGH" -> CyberAmber.copy(alpha = 0.2f)
                                    else -> CyberAccentBlue.copy(alpha = 0.2f)
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when (alert.severity.uppercase()) {
                                "CRITICAL" -> Icons.Default.Dangerous
                                "HIGH" -> Icons.Default.Warning
                                else -> Icons.Default.Info
                            },
                            contentDescription = null,
                            tint = when (alert.severity.uppercase()) {
                                "CRITICAL" -> CyberCrimson
                                "HIGH" -> CyberAmber
                                else -> CyberAccentBlue
                            },
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            SeverityBadge(severity = alert.severity)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = alert.createdAt,
                                fontSize = 11.sp,
                                color = Slate500
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = alert.title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextWhite
                        )
                        if (alert.description != null) {
                            Text(
                                text = alert.description,
                                fontSize = 11.sp,
                                color = Slate400,
                                maxLines = 1
                            )
                        }
                    }
                }
            }
        }
    }
}
