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
import com.sis.cyberfortress.core.network.VaultItemDto
import com.sis.cyberfortress.presentation.theme.*
import kotlinx.coroutines.launch

@Composable
fun VaultScreen() {
    var selectedCategory by remember { mutableStateOf("PASSWORDS") }
    var searchQuery by remember { mutableStateOf("") }
    var vaultItems by remember { mutableStateOf<List<VaultItemDto>>(emptyList()) }
    var showAddDialog by remember { mutableStateOf(false) }
    var selectedItemDetail by remember { mutableStateOf<VaultItemDto?>(null) }

    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        vaultItems = CyberRepository.getVaultItems()
    }

    val categories = listOf("Passwords", "Notes", "Files")

    val filteredItems = remember(vaultItems, selectedCategory, searchQuery) {
        vaultItems.filter { item ->
            val matchCategory = when (selectedCategory) {
                "Passwords" -> item.category == "PASSWORD" || item.category == "CREDENTIAL"
                "Notes" -> item.category == "SECURE_NOTE"
                else -> true
            }
            val matchSearch = searchQuery.isBlank() ||
                item.title.contains(searchQuery, ignoreCase = true) ||
                (item.decryptedSecret?.contains(searchQuery, ignoreCase = true) == true)
            matchCategory && matchSearch
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Vault Guardian",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(CyberDarkCard)
                        .border(1.dp, CyberCardBorder.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "🔒 Zero-Knowledge",
                        fontSize = 11.sp,
                        color = CyberAccentCyan,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Category Tabs [Passwords | Notes | Files]
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                categories.forEach { cat ->
                    val isSelected = selectedCategory == cat
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) CyberAccentBlue else CyberDarkCard)
                            .border(1.dp, if (isSelected) CyberAccentCyan else CyberCardBorder, RoundedCornerShape(10.dp))
                            .clickable { selectedCategory = cat }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = cat,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) TextWhite else Slate400
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Search Vault Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search vault...", color = Slate400, fontSize = 13.sp) },
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
                items(filteredItems) { item ->
                    VaultItemCard(
                        item = item,
                        onClick = { selectedItemDetail = item }
                    )
                }
            }
        }

        // Floating Action Button to Add Encrypted Item
        FloatingActionButton(
            onClick = { showAddDialog = true },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 16.dp),
            containerColor = CyberAccentBlue,
            contentColor = TextWhite
        ) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Add Item")
        }
    }

    // Add Vault Item Dialog (Zero-Knowledge)
    if (showAddDialog) {
        var title by remember { mutableStateOf("") }
        var secret by remember { mutableStateOf("") }
        var category by remember { mutableStateOf("PASSWORD") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = {
                Text(text = "Add Encrypted Item", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Encrypted on-device using AES-256-GCM before dispatch.",
                        fontSize = 11.sp,
                        color = CyberAccentCyan
                    )
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Title (e.g. ProtonMail)", fontSize = 12.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = secret,
                        onValueChange = { secret = it },
                        label = { Text("Secret / Password / Note", fontSize = 12.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (title.isNotBlank() && secret.isNotBlank()) {
                            coroutineScope.launch {
                                CyberRepository.addVaultItem(title.trim(), category, secret.trim())
                                vaultItems = CyberRepository.getVaultItems()
                                showAddDialog = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
                ) {
                    Text("Encrypt & Save", color = TextWhite)
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = CyberDarkCard
        )
    }

    // Detail Decrypted Secret Dialog
    if (selectedItemDetail != null) {
        val item = selectedItemDetail!!
        AlertDialog(
            onDismissRequest = { selectedItemDetail = null },
            title = {
                Text(text = item.title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextWhite)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(text = "Category: ${item.category}", fontSize = 12.sp, color = Slate400)
                    Divider(color = Slate800)
                    Text(
                        text = "Decrypted Plaintext:",
                        fontSize = 11.sp,
                        color = CyberEmerald,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = item.decryptedSecret ?: "Protected by Master Key",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextWhite
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "AES-256 Auth Tag: ${item.authTag.take(16)}...", fontSize = 10.sp, color = Slate500)
                }
            },
            confirmButton = {
                Button(
                    onClick = { selectedItemDetail = null },
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
fun VaultItemCard(
    item: VaultItemDto,
    onClick: () -> Unit
) {
    val (icon, color) = when (item.category) {
        "PASSWORD" -> Pair(Icons.Default.Password, CyberAccentCyan)
        "CREDENTIAL" -> Pair(Icons.Default.CreditCard, CyberAmber)
        else -> Pair(Icons.Default.Description, CyberAccentBlue)
    }

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
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f))
                    .border(1.dp, color.copy(alpha = 0.4f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = item.decryptedSecret ?: "••••••••••••",
                    fontSize = 12.sp,
                    color = Slate400,
                    maxLines = 1
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(CyberEmerald.copy(alpha = 0.15f))
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
