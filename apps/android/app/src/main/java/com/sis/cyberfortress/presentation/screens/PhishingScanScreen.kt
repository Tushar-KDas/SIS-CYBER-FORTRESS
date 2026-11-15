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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.network.CyberRepository
import com.sis.cyberfortress.core.network.PhishingScanResponse
import com.sis.cyberfortress.presentation.theme.*
import kotlinx.coroutines.launch

@Composable
fun PhishingScanScreen() {
    var urlToScan by remember { mutableStateOf("https://example.com") }
    var scanResult by remember { mutableStateOf<PhishingScanResponse?>(null) }
    var isScanning by remember { mutableStateOf(false) }
    var showReportDialog by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    // Default initial scan to match showcase Screen 12
    LaunchedEffect(Unit) {
        scanResult = CyberRepository.scanUrl("https://example.com")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Phishing Shield",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = TextWhite
            )

            IconButton(onClick = { showReportDialog = true }) {
                Icon(imageVector = Icons.Default.ReportProblem, contentDescription = "Report", tint = CyberAmber)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = "Enter URL to scan...",
            fontSize = 12.sp,
            color = Slate400
        )

        Spacer(modifier = Modifier.height(6.dp))

        // URL Input
        OutlinedTextField(
            value = urlToScan,
            onValueChange = { urlToScan = it },
            placeholder = { Text("https://example.com", color = Slate500, fontSize = 13.sp) },
            leadingIcon = {
                Icon(imageVector = Icons.Default.Language, contentDescription = null, tint = CyberAccentCyan)
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyberAccentCyan,
                unfocusedBorderColor = CyberCardBorder,
                focusedTextColor = TextWhite,
                unfocusedTextColor = TextWhite,
                focusedContainerColor = CyberDarkCard,
                unfocusedContainerColor = CyberDarkCard
            )
        )

        Spacer(modifier = Modifier.height(14.dp))

        Button(
            onClick = {
                if (urlToScan.isNotBlank()) {
                    isScanning = true
                    coroutineScope.launch {
                        scanResult = CyberRepository.scanUrl(urlToScan.trim())
                        isScanning = false
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue),
            enabled = !isScanning
        ) {
            if (isScanning) {
                CircularProgressIndicator(color = TextWhite, modifier = Modifier.size(20.dp))
            } else {
                Text("Scan URL", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Scan Result Card (Matching Showcase Screen 12)
        if (scanResult != null) {
            val res = scanResult!!
            val isSafe = res.isSafe
            val statusColor = if (isSafe) CyberEmerald else CyberCrimson

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
                                .size(50.dp)
                                .clip(CircleShape)
                                .background(statusColor.copy(alpha = 0.15f))
                                .border(1.dp, statusColor.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isSafe) Icons.Default.Shield else Icons.Default.Dangerous,
                                contentDescription = null,
                                tint = statusColor,
                                modifier = Modifier.size(28.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column {
                            Text(
                                text = if (isSafe) "Safe" else "Malicious Risk Detected",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = statusColor
                            )
                            Text(
                                text = if (isSafe)
                                    "This URL appears safe based on available data."
                                else
                                    "Phishing indicators detected. Do NOT enter credentials.",
                                fontSize = 12.sp,
                                color = Slate400
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                    Divider(color = Slate800)
                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Scan Details",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Reputation:", fontSize = 12.sp, color = Slate400)
                        Text(res.reputation, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Risk Level:", fontSize = 12.sp, color = Slate400)
                        Text(
                            text = res.riskLevel,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = statusColor
                        )
                    }

                    if (res.indicators.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Security Heuristics:", fontSize = 12.sp, color = Slate400)
                        Spacer(modifier = Modifier.height(4.dp))
                        res.indicators.forEach { ind ->
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 2.dp)) {
                                Icon(
                                    imageVector = if (isSafe) Icons.Default.Check else Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = statusColor,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(ind, fontSize = 11.sp, color = TextWhite)
                            }
                        }
                    }
                }
            }
        }
    }

    // Submit Threat Report Dialog
    if (showReportDialog) {
        var reportUrl by remember { mutableStateOf(urlToScan) }
        var comment by remember { mutableStateOf("") }
        var reportSent by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showReportDialog = false },
            title = {
                Text(text = "Submit Threat Report", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Report suspicious domain or phishing email to enterprise Cyber SOC.",
                        fontSize = 12.sp,
                        color = Slate400
                    )
                    OutlinedTextField(
                        value = reportUrl,
                        onValueChange = { reportUrl = it },
                        label = { Text("Target URL", fontSize = 12.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = comment,
                        onValueChange = { comment = it },
                        label = { Text("Details / Context", fontSize = 12.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (reportSent) {
                        Text("✓ Incident report submitted to SOC triage desk.", color = CyberEmerald, fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        reportSent = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text(if (reportSent) "Done" else "Submit Report", color = TextWhite)
                }
            },
            dismissButton = {
                TextButton(onClick = { showReportDialog = false }) {
                    Text("Close", color = Slate400)
                }
            },
            containerColor = CyberDarkCard
        )
    }
}
