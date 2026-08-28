package com.ecommerce.common.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

public final class SecurityContextUtil {
    private SecurityContextUtil() {}

    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_ROLE = "X-User-Role";
    public static final String HEADER_USER_EMAIL = "X-User-Email";

    public static Long getUserId(HttpServletRequest request, JwtTokenProvider jwtTokenProvider) {
        String headerUserId = request.getHeader(HEADER_USER_ID);
        if (StringUtils.hasText(headerUserId)) {
            try {
                return Long.parseLong(headerUserId);
            } catch (NumberFormatException ignored) {}
        }

        // Fallback to Bearer token if direct service call
        String bearerToken = getJwtFromRequest(request);
        if (StringUtils.hasText(bearerToken) && jwtTokenProvider != null && jwtTokenProvider.validateToken(bearerToken)) {
            return jwtTokenProvider.getUserIdFromToken(bearerToken);
        }

        return null;
    }

    public static String getUserRole(HttpServletRequest request, JwtTokenProvider jwtTokenProvider) {
        String headerRole = request.getHeader(HEADER_USER_ROLE);
        if (StringUtils.hasText(headerRole)) {
            return headerRole;
        }

        String bearerToken = getJwtFromRequest(request);
        if (StringUtils.hasText(bearerToken) && jwtTokenProvider != null && jwtTokenProvider.validateToken(bearerToken)) {
            return jwtTokenProvider.getRoleFromToken(bearerToken);
        }

        return null;
    }

    public static String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
