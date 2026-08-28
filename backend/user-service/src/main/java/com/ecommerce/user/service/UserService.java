package com.ecommerce.user.service;

import com.ecommerce.common.event.UserUpdatedEvent;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.user.dto.UpdateProfileRequest;
import com.ecommerce.user.dto.UserProfileDto;
import com.ecommerce.user.dto.UserStatusRequest;
import com.ecommerce.user.entity.UserProfile;
import com.ecommerce.user.event.UserEventPublisher;
import com.ecommerce.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final UserEventPublisher userEventPublisher;

    // F06: Xem hồ sơ cá nhân
    @Transactional(readOnly = true)
    public UserProfileDto getProfile(Long userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        return mapToDto(profile);
    }

    // F07: Cập nhật hồ sơ
    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        profile.setFullName(request.getFullName().trim());
        profile.setPhoneNumber(request.getPhoneNumber().trim());
        if (request.getAvatar() != null) {
            profile.setAvatar(request.getAvatar());
        }

        UserProfile saved = userProfileRepository.save(profile);

        // Publish UserUpdated
        UserUpdatedEvent event = UserUpdatedEvent.builder()
                .userId(saved.getId())
                .fullName(saved.getFullName())
                .phoneNumber(saved.getPhoneNumber())
                .avatar(saved.getAvatar())
                .eventType("UserUpdated")
                .build();
        userEventPublisher.publishUserUpdated(event);

        return mapToDto(saved);
    }

    // F57: Admin xem danh sách & tìm kiếm
    @Transactional(readOnly = true)
    public Page<UserProfileDto> getUsers(String query, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            return userProfileRepository.searchUsers(query.trim(), pageable).map(this::mapToDto);
        }
        return userProfileRepository.findAll(pageable).map(this::mapToDto);
    }

    // F57: Admin cập nhật trạng thái khóa/mở khóa
    @Transactional
    public UserProfileDto updateUserStatus(Long userId, UserStatusRequest request) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        profile.setBlocked(request.isBlocked());
        UserProfile saved = userProfileRepository.save(profile);

        if (request.isBlocked()) {
            userEventPublisher.publishUserBlocked(userId, request.getReason());
        } else {
            userEventPublisher.publishUserUnblocked(userId);
        }

        return mapToDto(saved);
    }

    private UserProfileDto mapToDto(UserProfile profile) {
        return UserProfileDto.builder()
                .id(profile.getId())
                .email(profile.getEmail())
                .fullName(profile.getFullName())
                .phoneNumber(profile.getPhoneNumber())
                .avatar(profile.getAvatar())
                .role(profile.getRole())
                .blocked(profile.isBlocked())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
