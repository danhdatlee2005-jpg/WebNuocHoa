package com.ecommerce.user.service;

import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.user.dto.AddressDto;
import com.ecommerce.user.dto.AddressRequest;
import com.ecommerce.user.entity.Address;
import com.ecommerce.user.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressDto> getAddresses(Long userId) {
        return addressRepository.findAllByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // F08: Thêm địa chỉ
    @Transactional
    public AddressDto addAddress(Long userId, AddressRequest request) {
        List<Address> existingAddresses = addressRepository.findAllByUserId(userId);
        boolean shouldBeDefault = request.isDefault() || existingAddresses.isEmpty();

        if (shouldBeDefault) {
            addressRepository.resetDefaultAddressForUser(userId);
        }

        Address address = Address.builder()
                .userId(userId)
                .recipientName(request.getRecipientName().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .province(request.getProvince().trim())
                .district(request.getDistrict().trim())
                .ward(request.getWard().trim())
                .detailAddress(request.getDetailAddress().trim())
                .isDefault(shouldBeDefault)
                .build();

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    // F09: Sửa địa chỉ
    @Transactional
    public AddressDto updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own address");
        }

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.resetDefaultAddressForUser(userId);
            address.setDefault(true);
        }

        address.setRecipientName(request.getRecipientName().trim());
        address.setPhoneNumber(request.getPhoneNumber().trim());
        address.setProvince(request.getProvince().trim());
        address.setDistrict(request.getDistrict().trim());
        address.setWard(request.getWard().trim());
        address.setDetailAddress(request.getDetailAddress().trim());

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    // F10: Xóa địa chỉ
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own address");
        }

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        // Nếu địa chỉ bị xóa là mặc định, gán địa chỉ đầu tiên còn lại làm mặc định
        if (wasDefault) {
            List<Address> remaining = addressRepository.findAllByUserId(userId);
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setDefault(true);
                addressRepository.save(first);
            }
        }
    }

    // F11: Đặt địa chỉ mặc định
    @Transactional
    public AddressDto setDefaultAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only update your own address");
        }

        addressRepository.resetDefaultAddressForUser(userId);
        address.setDefault(true);
        Address saved = addressRepository.save(address);

        return mapToDto(saved);
    }

    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .userId(address.getUserId())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }
}
