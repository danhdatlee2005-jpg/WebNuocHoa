package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.*;
import com.ecommerce.auth.entity.PasswordResetToken;
import com.ecommerce.auth.entity.RefreshToken;
import com.ecommerce.auth.entity.UserAuth;
import com.ecommerce.auth.event.AuthEventPublisher;
import com.ecommerce.auth.repository.PasswordResetTokenRepository;
import com.ecommerce.auth.repository.RefreshTokenRepository;
import com.ecommerce.auth.repository.UserAuthRepository;
import com.ecommerce.common.enums.Role;
import com.ecommerce.common.event.PasswordResetRequestedEvent;
import com.ecommerce.common.event.UserRegisteredEvent;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserAuthRepository userAuthRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthEventPublisher authEventPublisher;

    // F01: Đăng ký tài khoản
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userAuthRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("EMAIL_ALREADY_EXISTS");
        }

        if (userAuthRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("PHONE_ALREADY_EXISTS");
        }

        UserAuth user = UserAuth.builder()
                .email(request.getEmail().toLowerCase().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .fullName(request.getFullName().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .active(true)
                .blocked(false)
                .build();

        UserAuth savedUser = userAuthRepository.save(user);

        // Publish event to broker
        UserRegisteredEvent event = UserRegisteredEvent.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .phoneNumber(savedUser.getPhoneNumber())
                .role(savedUser.getRole().name())
                .eventType("UserRegistered")
                .build();
        authEventPublisher.publishUserRegistered(event);

        return generateAuthResponse(savedUser);
    }

    // F02: Đăng nhập
    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserAuth user = userAuthRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.isBlocked()) {
            throw new UnauthorizedException("ACCOUNT_BLOCKED");
        }

        if (!user.isActive()) {
            throw new UnauthorizedException("ACCOUNT_INACTIVE");
        }

        return generateAuthResponse(user);
    }

    // F03: Refresh Token
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("REFRESH_TOKEN_INVALID"));

        if (refreshToken.isRevoked() || refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("REFRESH_TOKEN_EXPIRED_OR_REVOKED");
        }

        UserAuth user = userAuthRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isBlocked() || !user.isActive()) {
            throw new UnauthorizedException("ACCOUNT_DISABLED");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationSeconds())
                .build();
    }

    // F04: Đăng xuất
    @Transactional
    public void logout(String refreshTokenStr) {
        if (refreshTokenStr != null) {
            refreshTokenRepository.findByToken(refreshTokenStr).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
    }

    // F05: Quên mật khẩu & Gửi mail
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userAuthRepository.findByEmail(request.getEmail().toLowerCase().trim()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .userId(user.getId())
                    .token(token)
                    .expiryDate(LocalDateTime.now().plusHours(2))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);

            PasswordResetRequestedEvent event = PasswordResetRequestedEvent.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .resetToken(token)
                    .eventType("PasswordResetRequested")
                    .build();
            authEventPublisher.publishPasswordResetRequested(event);
        });
    }

    // F05: Đặt lại mật khẩu
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(request.getToken())
                .orElseThrow(() -> new BadRequestException("INVALID_OR_EXPIRED_RESET_TOKEN"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("RESET_TOKEN_EXPIRED");
        }

        UserAuth user = userAuthRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userAuthRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Revoke all existing refresh tokens for security
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    private AuthResponse generateAuthResponse(UserAuth user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshTokenStr)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationSeconds())
                .build();
    }
}
