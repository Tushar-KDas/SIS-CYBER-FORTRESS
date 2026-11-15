package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
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
import com.sis.cyberfortress.core.network.IncidentDto
import com.sis.cyberfortress.presentation.components.SeverityBadge
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun IncidentsScreen() {
    var selectedTab by remember { mutableStateOf("ACTIVE") }
    var incidents by remember { mutableStateOf<List<IncidentDto>>(emptyList()) }
    var selectedIncidentForDialog by remember { mutableStateOf<IncidentDto?>(null) }

    LaunchedEffect(selectedTab) {
        incidents = CyberRepository.getIncidents(selectedTab)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
    ) {
        Text(
            text = "Incidents",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Tabs [Active (1) | Resolved]
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(CyberDarkCard)
                .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                .padding(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (selectedTab == "ACTIVE") CyberAccentBlue else Color.Transparent)
                    .clickable { selectedTab = "ACTIVE" }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Active (1)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (selectedTab == "ACTIVE") TextWhite else Slate400
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (selectedTab == "RESOLVED") CyberAccentBlue else Color.Transparent)
                    .clickable { selectedTab = "RESOLVED" }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Resolved",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (selectedTab == "RESOLVED") TextWhite else Slate400
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(incidents) { incident ->
                IncidentCard(
                    incident = incident,
                    onViewDetails = { selectedIncidentForDialog = incident }
                )
            }
        }
    }

    if (selectedIncidentForDialog != null) {
        val inc = selectedIncidentForDialog!!
        AlertDialog(
            onDismissRequest = { selectedIncidentForDialog = null },
            title = {
                Text(text = inc.incidentNumber, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = CyberAccentCyan)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(text = inc.title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                    Text(text = inc.summary, fontSize = 12.sp, color = Slate400)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Priority: ${inc.priority}", fontSize = 12.sp, color = CyberCrimson, fontWeight = FontWeight.Bold)
                    Text(text = "Assigned: ${inc.assignedToName ?: "Security Operations"}", fontSize = 12.sp, color = TextWhite)
                    Text(text = "Timestamp: ${inc.createdAt}", fontSize = 11.sp, color = Slate500)
                }
            },
            confirmButton = {
                Button(
                    onClick = { selectedIncidentForDialog = null },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text("Close", color = TextWhite)
                }
            },
            containerColor = CyberDarkCard
        )
    }
}

@Composable
fun IncidentCard(
    incident: IncidentDto,
    onViewDetails: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Text(
                text = incident.incidentNumber,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Slate400
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = incident.title,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextWhite
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                SeverityBadge(severity = incident.priority)
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "👤 Assigned: ${incident.assignedToName ?: "Security Team"}",
                    fontSize = 12.sp,
                    color = Slate400
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "🕒 ${incident.createdAt}",
                fontSize = 11.sp,
                color = Slate500
            )

            Spacer(modifier = Modifier.height(14.dp))

            Button(
                onClick = onViewDetails,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(42.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyberCardBorder.copy(alpha = 0.5f))
            ) {
                Text(
                    text = "View Details",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextWhite
                )
            }
        }
    }
}
