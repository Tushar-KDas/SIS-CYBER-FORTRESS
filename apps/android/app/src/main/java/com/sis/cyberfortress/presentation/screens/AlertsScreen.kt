package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.network.CyberRepository
import com.sis.cyberfortress.core.network.SecurityAlertDto
import com.sis.cyberfortress.presentation.components.SeverityBadge
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun AlertsScreen() {
    var selectedFilter by remember { mutableStateOf("ALL") }
    var alerts by remember { mutableStateOf<List<SecurityAlertDto>>(emptyList()) }
    var selectedAlertForDialog by remember { mutableStateOf<SecurityAlertDto?>(null) }

    LaunchedEffect(selectedFilter) {
        alerts = CyberRepository.getAlerts(if (selectedFilter == "ALL") null else selectedFilter)
    }

    val filterChips = listOf(
        Pair("ALL", "All (5)"),
        Pair("CRITICAL", "Critical (1)"),
        Pair("HIGH", "Warning (2)"),
        Pair("INFORMATIONAL", "Info")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
    ) {
        Text(
            text = "Security Alerts",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Filter Chips Row
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(filterChips) { (key, label) ->
                val isSelected = selectedFilter == key
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) CyberAccentBlue else CyberDarkCard)
                        .border(1.dp, if (isSelected) CyberAccentCyan else CyberCardBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = key }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = label,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextWhite else Slate400
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(alerts) { alert ->
                AlertItemCard(
                    alert = alert,
                    onClick = { selectedAlertForDialog = alert }
                )
            }
        }
    }

    // Detail Alert Modal
    if (selectedAlertForDialog != null) {
        val alert = selectedAlertForDialog!!
        AlertDialog(
            onDismissRequest = { selectedAlertForDialog = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SeverityBadge(severity = alert.severity)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "Security Incident Notice", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(text = alert.title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextWhite)
                    Text(text = alert.description ?: "Anomaly flagged by module pipeline.", fontSize = 12.sp, color = Slate400)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Source IP: ${alert.sourceIp ?: "Local System"}", fontSize = 11.sp, color = CyberAccentCyan)
                    Text(text = "Module: ${alert.moduleKey}", fontSize = 11.sp, color = Slate400)
                    Text(text = "Timestamp: ${alert.createdAt}", fontSize = 11.sp, color = Slate500)
                }
            },
            confirmButton = {
                Button(
                    onClick = { selectedAlertForDialog = null },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text("Acknowledge", color = TextWhite)
                }
            },
            containerColor = CyberDarkCard
        )
    }
}

@Composable
fun AlertItemCard(
    alert: SecurityAlertDto,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, CyberCardBorder.copy(alpha = 0.35f), RoundedCornerShape(14.dp))
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(
                        when (alert.severity.uppercase()) {
                            "CRITICAL" -> CyberCrimson.copy(alpha = 0.2f)
                            "HIGH", "WARNING" -> CyberAmber.copy(alpha = 0.2f)
                            "LOW", "SUCCESS" -> CyberEmerald.copy(alpha = 0.2f)
                            else -> CyberInfo.copy(alpha = 0.2f)
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when (alert.severity.uppercase()) {
                        "CRITICAL" -> Icons.Default.Dangerous
                        "HIGH", "WARNING" -> Icons.Default.Warning
                        "LOW", "SUCCESS" -> Icons.Default.CheckCircle
                        else -> Icons.Default.Info
                    },
                    contentDescription = null,
                    tint = when (alert.severity.uppercase()) {
                        "CRITICAL" -> CyberCrimson
                        "HIGH", "WARNING" -> CyberAmber
                        "LOW", "SUCCESS" -> CyberEmerald
                        else -> CyberInfo
                    },
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

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
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextWhite
                )
                if (alert.description != null) {
                    Text(
                        text = alert.description,
                        fontSize = 12.sp,
                        color = Slate400,
                        maxLines = 1
                    )
                }
            }
        }
    }
}
