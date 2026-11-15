package com.sis.cyberfortress.presentation.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.presentation.theme.*

// -------------------------------------------------------------
// 1. CIRCULAR SECURITY SCORE GAUGE (Matches Showcase Screen 5)
// -------------------------------------------------------------
@Composable
fun SecurityScoreGauge(
    score: Int = 98,
    modifier: Modifier = Modifier
) {
    val animatedProgress by animateFloatAsState(
        targetValue = score / 100f,
        animationSpec = tween(durationMillis = 1200),
        label = "scoreProgress"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, CyberCardBorder.copy(alpha = 0.5f), RoundedCornerShape(18.dp)),
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left: Circular Progress Ring
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.size(90.dp)
            ) {
                Canvas(modifier = Modifier.size(90.dp)) {
                    val strokeWidth = 8.dp.toPx()
                    // Track circle
                    drawArc(
                        color = Slate800,
                        startAngle = -90f,
                        sweepAngle = 360f,
                        useCenter = false,
                        style = Stroke(width = strokeWidth)
                    )
                    // Progress arc
                    drawArc(
                        brush = Brush.sweepGradient(
                            listOf(CyberAccentCyan, CyberEmerald, CyberAccentCyan)
                        ),
                        startAngle = -90f,
                        sweepAngle = 360f * animatedProgress,
                        useCenter = false,
                        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                    )
                }
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = CyberEmerald,
                    modifier = Modifier.size(36.dp)
                )
            }

            // Right: Text Details
            Column(
                modifier = Modifier.weight(1f).padding(start = 18.dp),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Security Score",
                    fontSize = 13.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "$score%",
                    fontSize = 34.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = TextWhite,
                    fontFamily = FontFamily.SansSerif
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = CyberEmerald,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Excellent Security",
                        fontSize = 13.sp,
                        color = CyberEmerald,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

// -------------------------------------------------------------
// 2. QUICK STAT CARD (Devices, Alerts, Incidents, Modules)
// -------------------------------------------------------------
@Composable
fun QuickStatCard(
    title: String,
    value: String,
    icon: ImageVector,
    iconColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .border(1.dp, CyberCardBorder.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(iconColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(20.dp)
                )
            }
            Text(
                text = title,
                fontSize = 12.sp,
                color = Slate400,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = value,
                fontSize = 20.sp,
                color = TextWhite,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// -------------------------------------------------------------
// 3. 7-DAY SECURITY OVERVIEW SPLINE CHART (Canvas implementation)
// -------------------------------------------------------------
@Composable
fun SecurityOverviewChart(
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, CyberCardBorder.copy(alpha = 0.5f), RoundedCornerShape(18.dp)),
        colors = CardDefaults.cardColors(containerColor = CyberDarkCard)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Security Overview",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
                Text(
                    text = "Last 7 Days >",
                    fontSize = 12.sp,
                    color = CyberAccentCyan,
                    fontWeight = FontWeight.Medium
                )
            }
            Spacer(modifier = Modifier.height(16.dp))

            // Canvas Line Chart
            val dataPoints = listOf(35f, 50f, 40f, 75f, 60f, 95f, 65f)
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
            ) {
                val width = size.width
                val height = size.height
                val stepX = width / (dataPoints.size - 1)
                val maxVal = 100f

                // Draw smooth gradient path
                val points = dataPoints.mapIndexed { i, v ->
                    Offset(i * stepX, height - (v / maxVal * height * 0.85f))
                }

                for (i in 0 until points.size - 1) {
                    drawLine(
                        color = CyberAccentCyan,
                        start = points[i],
                        end = points[i + 1],
                        strokeWidth = 3.dp.toPx(),
                        cap = StrokeCap.Round
                    )
                }

                points.forEach { pt ->
                    drawCircle(
                        color = CyberAccentCyan,
                        radius = 4.dp.toPx(),
                        center = pt
                    )
                    drawCircle(
                        color = CyberObsidian,
                        radius = 2.dp.toPx(),
                        center = pt
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))

            // Days Labels
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                listOf("Mon", "Wed", "Wed", "The", "Fri", "Sat", "Sun").forEach { day ->
                    Text(text = day, fontSize = 11.sp, color = Slate500)
                }
            }
        }
    }
}

// -------------------------------------------------------------
// 4. SEVERITY BADGE / PILL
// -------------------------------------------------------------
@Composable
fun SeverityBadge(
    severity: String,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor) = when (severity.uppercase()) {
        "CRITICAL" -> Pair(CyberCrimson.copy(alpha = 0.2f), CyberCrimson)
        "HIGH", "WARNING" -> Pair(CyberAmber.copy(alpha = 0.2f), CyberAmber)
        "LOW", "SUCCESS" -> Pair(CyberEmerald.copy(alpha = 0.2f), CyberEmerald)
        else -> Pair(CyberInfo.copy(alpha = 0.2f), CyberInfo)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = severity.uppercase(),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}

// -------------------------------------------------------------
// 5. TOP APP BAR WITH AVATAR, ONLINE BADGE & NOTIFICATION BELL
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CyberTopBar(
    userName: String = "John Doe",
    onMenuClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    TopAppBar(
        title = {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Welcome Back,",
                        fontSize = 11.sp,
                        color = Slate400
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(CyberEmerald.copy(alpha = 0.15f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "● Online",
                            fontSize = 9.sp,
                            color = CyberEmerald,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Text(
                    text = "$userName 👋",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
            }
        },
        navigationIcon = {
            IconButton(onClick = onMenuClick) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "Menu",
                    tint = TextWhite
                )
            }
        },
        actions = {
            IconButton(onClick = onNotificationsClick) {
                BadgedBox(
                    badge = {
                        Badge(
                            containerColor = CyberCrimson,
                            contentColor = TextWhite
                        ) {
                            Text("5", fontSize = 9.sp)
                        }
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = TextWhite
                    )
                }
            }
            Spacer(modifier = Modifier.width(4.dp))
            // User Avatar
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(CyberAccentCyan.copy(alpha = 0.2f))
                    .border(1.5.dp, CyberAccentCyan, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = CyberAccentCyan,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = CyberObsidian
        )
    )
}

// -------------------------------------------------------------
// 6. BOTTOM NAVIGATION BAR (Home, Modules, Alerts, More)
// -------------------------------------------------------------
@Composable
fun CyberBottomBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    NavigationBar(
        containerColor = BottomBarBackground,
        tonalElevation = 8.dp
    ) {
        val items = listOf(
            Triple("Home", "dashboard", Icons.Default.Home),
            Triple("Modules", "modules", Icons.Default.GridView),
            Triple("Alerts", "alerts", Icons.Default.Notifications),
            Triple("More", "settings", Icons.Default.MoreHoriz)
        )

        items.forEach { (label, route, icon) ->
            val isSelected = currentRoute == route
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(route) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        tint = if (isSelected) BottomBarSelected else BottomBarUnselected
                    )
                },
                label = {
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        color = if (isSelected) BottomBarSelected else BottomBarUnselected,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color.Transparent
                )
            )
        }
    }
}
