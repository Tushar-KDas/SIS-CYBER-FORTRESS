package com.sis.cyberfortress.presentation.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.R
import com.sis.cyberfortress.presentation.theme.*
import kotlinx.coroutines.delay

@Composable
fun MfaVerifyScreen(
    userEmail: String,
    onVerifySuccess: () -> Unit
) {
    var otpDigits by remember { mutableStateOf(listOf("1", "2", "3", "4", "5", "6")) }
    var countdown by remember { mutableStateOf(45) }
    var isLoading by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        while (countdown > 0) {
            delay(1000)
            countdown--
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberObsidian)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.app_logo),
                contentDescription = null,
                modifier = Modifier.size(68.dp)
            )

            Spacer(modifier = Modifier.height(18.dp))

            Text(
                text = "Two-Factor Authentication",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = TextWhite
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Enter the 6-digit code from your authenticator app",
                fontSize = 13.sp,
                color = Slate400,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            // 6 OTP Digit Boxes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                otpDigits.forEachIndexed { index, digit ->
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .background(CyberDarkCard, RoundedCornerShape(8.dp))
                            .border(1.5.dp, CyberAccentCyan, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = digit,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Or use backup code",
                fontSize = 12.sp,
                color = CyberAccentCyan,
                modifier = Modifier.clickable { /* Backup code */ }
            )

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                onClick = {
                    isLoading = true
                    onVerifySuccess()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyberAccentBlue)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = TextWhite, modifier = Modifier.size(20.dp))
                } else {
                    Text("Verify", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextWhite)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = if (countdown > 0) "Resend Code (00:${if (countdown < 10) "0$countdown" else countdown})" else "Resend Code Now",
                fontSize = 12.sp,
                color = if (countdown > 0) Slate500 else CyberAccentCyan,
                modifier = Modifier.clickable(enabled = countdown == 0) { countdown = 45 }
            )
        }
    }
}
