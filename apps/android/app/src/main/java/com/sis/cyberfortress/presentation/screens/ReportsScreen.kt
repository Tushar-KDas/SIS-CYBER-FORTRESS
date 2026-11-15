package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun ReportsScreen() {
    var selectedRange by remember { mutableStateOf("7D") }
    val ranges = listOf("7D", "30D", "90D", "1Y")

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
                text = "Reports & Analytics",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = TextWhite
            )

            IconButton(onClick = { /* Export */ }) {
                Icon(imageVector = Icons.Default.FileDownload, contentDescription = "Export", tint = CyberAccentCyan)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Time Range Filter Tabs [7D | 30D | 90D | 1Y]
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ranges.forEach { range ->
                val isSelected = selectedRange == range
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) CyberAccentBlue else CyberDarkCard)
                        .border(1.dp, if (isSelected) CyberAccentCyan else CyberCardBorder, RoundedCornerShape(8.dp))
                        .clickable { selectedRange = range }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = range,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextWhite else Slate400
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Security Alerts Card with Bar Chart (Matching Showcase Screen 13)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = "Security Alerts",
                    fontSize = 13.sp,
                    color = Slate400
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "245",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "↑ 12%",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberEmerald
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Bar Chart Canvas
                val barHeights = listOf(0.3f, 0.45f, 0.25f, 0.6f, 0.5f, 0.75f, 0.4f, 0.85f, 0.65f, 0.95f, 0.7f, 0.8f)
                Canvas(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                ) {
                    val width = size.width
                    val height = size.height
                    val barWidth = width / (barHeights.size * 1.8f)
                    val spacing = (width - (barWidth * barHeights.size)) / (barHeights.size - 1)

                    barHeights.forEachIndexed { i, factor ->
                        val barHeight = height * factor
                        drawRoundRect(
                            color = CyberAccentBlue,
                            topLeft = Offset(i * (barWidth + spacing), height - barHeight),
                            size = Size(barWidth, barHeight),
                            cornerRadius = androidx.compose.ui.geometry.CornerRadius(4.dp.toPx(), 4.dp.toPx())
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Incidents Donut / Radial Chart Card (Matching Showcase Screen 13)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = "Incidents",
                    fontSize = 13.sp,
                    color = Slate400
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "12",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "↑ 8%",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyberEmerald
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Donut Chart Canvas
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.size(110.dp)) {
                        val stroke = 14.dp.toPx()
                        // 4 severity segments
                        drawArc(color = CyberCrimson, startAngle = 0f, sweepAngle = 90f, useCenter = false, style = Stroke(stroke))
                        drawArc(color = CyberAmber, startAngle = 90f, sweepAngle = 110f, useCenter = false, style = Stroke(stroke))
                        drawArc(color = CyberAccentCyan, startAngle = 200f, sweepAngle = 100f, useCenter = false, style = Stroke(stroke))
                        drawArc(color = CyberEmerald, startAngle = 300f, sweepAngle = 60f, useCenter = false, style = Stroke(stroke))
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Legend
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    LegendItem("Critical", CyberCrimson)
                    LegendItem("High", CyberAmber)
                    LegendItem("Medium", CyberAccentCyan)
                    LegendItem("Low", CyberEmerald)
                }
            }
        }
    }
}

@Composable
fun LegendItem(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(color)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(text = label, fontSize = 11.sp, color = Slate400)
    }
}
