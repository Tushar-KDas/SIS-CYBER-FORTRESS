package com.sis.cyberfortress.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.sis.cyberfortress.R
import com.sis.cyberfortress.core.storage.TokenManager
import com.sis.cyberfortress.presentation.components.CyberBottomBar
import com.sis.cyberfortress.presentation.components.CyberTopBar
import com.sis.cyberfortress.presentation.navigation.Screen
import com.sis.cyberfortress.presentation.screens.*
import com.sis.cyberfortress.presentation.theme.*
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CyberFortressTheme {
                MainAppHost()
            }
        }
    }
}

@Composable
fun MainAppHost() {
    val navController = rememberNavController()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val coroutineScope = rememberCoroutineScope()

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val isAuthScreen = currentRoute in listOf(
        Screen.Splash.route,
        Screen.Login.route,
        Screen.Register.route,
        Screen.MfaVerify.route
    )

    ModalNavigationDrawer(
        drawerState = drawerState,
        gesturesEnabled = !isAuthScreen,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = CyberDeepNavy,
                drawerContentColor = TextWhite,
                modifier = Modifier.width(300.dp)
            ) {
                // Drawer Header (Matching Showcase Screen 15)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(CyberDarkCard)
                        .padding(24.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.app_logo),
                        contentDescription = "Logo",
                        modifier = Modifier.size(56.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "SIS Cyber Fortress",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextWhite
                    )
                    Text(
                        text = "v1.0.0",
                        fontSize = 12.sp,
                        color = CyberAccentCyan
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                DrawerMenuItem(icon = Icons.Default.Home, label = "Dashboard") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Dashboard.route) { popUpTo(Screen.Dashboard.route) { inclusive = true } }
                }
                DrawerMenuItem(icon = Icons.Default.GridView, label = "Security Modules") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Modules.route)
                }
                DrawerMenuItem(icon = Icons.Default.Notifications, label = "Alerts") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Alerts.route)
                }
                DrawerMenuItem(icon = Icons.Default.Warning, label = "Incidents") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Incidents.route)
                }
                DrawerMenuItem(icon = Icons.Default.Devices, label = "My Devices") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Devices.route)
                }
                DrawerMenuItem(icon = Icons.Default.Key, label = "Vault Guardian") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Vault.route)
                }
                DrawerMenuItem(icon = Icons.Default.Search, label = "Phishing Shield") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.PhishingScan.route)
                }
                DrawerMenuItem(icon = Icons.Default.Wifi, label = "Network Sentinel") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.NetworkSentinel.route)
                }
                DrawerMenuItem(icon = Icons.Default.Analytics, label = "Reports & Analytics") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Reports.route)
                }
                DrawerMenuItem(icon = Icons.Default.Settings, label = "Settings") {
                    coroutineScope.launch { drawerState.close() }
                    navController.navigate(Screen.Settings.route)
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                if (!isAuthScreen) {
                    val user = TokenManager.getUser()
                    CyberTopBar(
                        userName = user?.fullName ?: "John Doe",
                        onMenuClick = {
                            coroutineScope.launch { drawerState.open() }
                        },
                        onNotificationsClick = {
                            navController.navigate(Screen.Alerts.route)
                        }
                    )
                }
            },
            bottomBar = {
                if (!isAuthScreen) {
                    CyberBottomBar(
                        currentRoute = currentRoute ?: "dashboard",
                        onNavigate = { route ->
                            navController.navigate(route) {
                                popUpTo(Screen.Dashboard.route) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            },
            containerColor = CyberObsidian
        ) { paddingValues ->
            NavHost(
                navController = navController,
                startDestination = Screen.Splash.route,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                composable(Screen.Splash.route) {
                    SplashScreen(
                        onNavigateNext = { hasToken ->
                            if (hasToken) {
                                navController.navigate(Screen.Dashboard.route) {
                                    popUpTo(Screen.Splash.route) { inclusive = true }
                                }
                            } else {
                                navController.navigate(Screen.Login.route) {
                                    popUpTo(Screen.Splash.route) { inclusive = true }
                                }
                            }
                        }
                    )
                }

                composable(Screen.Login.route) {
                    LoginScreen(
                        onLoginSuccess = {
                            navController.navigate(Screen.Dashboard.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        },
                        onNavigateToRegister = {
                            navController.navigate(Screen.Register.route)
                        },
                        onNavigateToMfa = {
                            navController.navigate(Screen.MfaVerify.route)
                        }
                    )
                }

                composable(Screen.Register.route) {
                    RegisterScreen(
                        onRegisterSuccess = {
                            navController.navigate(Screen.Dashboard.route) {
                                popUpTo(Screen.Register.route) { inclusive = true }
                            }
                        },
                        onNavigateToLogin = {
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Register.route) { inclusive = true }
                            }
                        }
                    )
                }

                composable(Screen.MfaVerify.route) {
                    MfaVerifyScreen(
                        userEmail = TokenManager.getUser()?.email ?: "user@fortress.cyber",
                        onVerifySuccess = {
                            navController.navigate(Screen.Dashboard.route) {
                                popUpTo(Screen.MfaVerify.route) { inclusive = true }
                            }
                        }
                    )
                }

                composable(Screen.Dashboard.route) {
                    DashboardScreen(
                        onNavigateToDevices = { navController.navigate(Screen.Devices.route) },
                        onNavigateToAlerts = { navController.navigate(Screen.Alerts.route) },
                        onNavigateToIncidents = { navController.navigate(Screen.Incidents.route) },
                        onNavigateToModules = { navController.navigate(Screen.Modules.route) },
                        onNavigateToVault = { navController.navigate(Screen.Vault.route) },
                        onNavigateToPhishing = { navController.navigate(Screen.PhishingScan.route) }
                    )
                }

                composable(Screen.Modules.route) {
                    ModulesCatalogScreen(
                        onSelectModule = { moduleKey ->
                            navController.navigate(Screen.ModuleDetail.createRoute(moduleKey))
                        }
                    )
                }

                composable(
                    route = Screen.ModuleDetail.route,
                    arguments = listOf(navArgument("moduleKey") { type = NavType.StringType })
                ) { backStackEntry ->
                    val moduleKey = backStackEntry.arguments?.getString("moduleKey") ?: "identity-guardian"
                    ModuleDetailScreen(
                        moduleKey = moduleKey,
                        onBack = { navController.popBackStack() },
                        onLaunchModule = { key ->
                            when (key) {
                                "vault-guardian" -> navController.navigate(Screen.Vault.route)
                                "phishing-shield" -> navController.navigate(Screen.PhishingScan.route)
                                "endpoint-guardian" -> navController.navigate(Screen.Devices.route)
                                "network-sentinel" -> navController.navigate(Screen.NetworkSentinel.route)
                                "cyber-soc" -> navController.navigate(Screen.Incidents.route)
                                else -> navController.navigate(Screen.Alerts.route)
                            }
                        }
                    )
                }

                composable(Screen.Alerts.route) {
                    AlertsScreen()
                }

                composable(Screen.Incidents.route) {
                    IncidentsScreen()
                }

                composable(Screen.Devices.route) {
                    DevicesScreen()
                }

                composable(Screen.Vault.route) {
                    VaultScreen()
                }

                composable(Screen.PhishingScan.route) {
                    PhishingScanScreen()
                }

                composable(Screen.NetworkSentinel.route) {
                    NetworkSentinelScreen()
                }

                composable(Screen.Reports.route) {
                    ReportsScreen()
                }

                composable(Screen.Settings.route) {
                    SettingsScreen(
                        onLogout = {
                            navController.navigate(Screen.Login.route) {
                                popUpTo(0) { inclusive = true }
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun DrawerMenuItem(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 20.dp, vertical = 13.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = CyberAccentCyan,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Text(
            text = label,
            fontSize = 14.sp,
            color = TextWhite,
            fontWeight = FontWeight.Medium
        )
    }
}
