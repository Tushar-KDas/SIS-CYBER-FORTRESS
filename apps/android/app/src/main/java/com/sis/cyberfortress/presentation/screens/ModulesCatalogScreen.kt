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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.network.CyberRepository
import com.sis.cyberfortress.core.network.SecurityModuleDto
import com.sis.cyberfortress.presentation.theme.*

@Composable
fun ModulesCatalogScreen(
    onSelectModule: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    val allModules = remember { CyberRepository.getModules() }

    val filteredModules = remember(searchQuery) {
        if (searchQuery.isBlank()) {
            allModules
        } else {
            allModules.filter {
                it.name.contains(searchQuery, ignoreCase = true) ||
                it.description.contains(searchQuery, ignoreCase = true) ||
                it.tagline.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
    ) {
        Text(
            text = "Security Modules",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = TextWhite
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search modules...", color = Slate400, fontSize = 13.sp) },
            leadingIcon = {
                Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = Slate400)
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

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(filteredModules) { module ->
                ModuleListItemCard(
                    module = module,
                    onClick = { onSelectModule(module.key) }
                )
            }
        }
    }
}

@Composable
fun ModuleListItemCard(
    module: SecurityModuleDto,
    onClick: () -> Unit
) {
    val (icon, color) = getModuleVisual(module.key)

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
                    .size(44.dp)
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

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = module.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
                Text(
                    text = module.tagline,
                    fontSize = 12.sp,
                    color = Slate400
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(CyberEmerald.copy(alpha = 0.15f))
                    .border(1.dp, CyberEmerald.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(
                    text = "Active",
                    fontSize = 11.sp,
                    color = CyberEmerald,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

fun getModuleVisual(key: String): Pair<ImageVector, Color> {
    return when (key) {
        "identity-guardian" -> Pair(Icons.Default.VerifiedUser, CyberEmerald)
        "phishing-shield" -> Pair(Icons.Default.MailOutline, CyberAccentCyan)
        "endpoint-guardian" -> Pair(Icons.Default.Laptop, CyberAccentBlue)
        "network-sentinel" -> Pair(Icons.Default.Wifi, CyberAccentCyan)
        "vault-guardian" -> Pair(Icons.Default.Key, CyberAmber)
        "ransomware-guardian" -> Pair(Icons.Default.Shield, CyberCrimson)
        "webshield" -> Pair(Icons.Default.Language, CyberAccentCyan)
        "digital-forensics" -> Pair(Icons.Default.Search, CyberInfo)
        "access-guardian" -> Pair(Icons.Default.Lock, CyberEmerald)
        "threat-intelligence" -> Pair(Icons.Default.Radar, CyberAccentCyan)
        "cloud-backup" -> Pair(Icons.Default.CloudUpload, CyberAccentBlue)
        "cyber-soc" -> Pair(Icons.Default.HeadsetMic, CyberCrimson)
        else -> Pair(Icons.Default.Security, CyberAccentCyan)
    }
}
