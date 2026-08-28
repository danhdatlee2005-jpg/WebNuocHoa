package com.ecommerce.user.config;

import com.ecommerce.common.enums.Role;
import com.ecommerce.user.entity.Address;
import com.ecommerce.user.entity.UserProfile;
import com.ecommerce.user.repository.AddressRepository;
import com.ecommerce.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserDataInitializer implements CommandLineRunner {

    private final UserProfileRepository userProfileRepository;
    private final AddressRepository addressRepository;

    @Override
    public void run(String... args) {
        if (!userProfileRepository.existsById(1L)) {
            UserProfile admin = UserProfile.builder()
                    .id(1L)
                    .email("admin@perfume.com")
                    .fullName("System Administrator")
                    .phoneNumber("0901234567")
                    .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                    .role(Role.ADMIN)
                    .blocked(false)
                    .build();
            userProfileRepository.save(admin);
        }

        if (!userProfileRepository.existsById(2L)) {
            UserProfile customer = UserProfile.builder()
                    .id(2L)
                    .email("customer@perfume.com")
                    .fullName("Nguyen Van A")
                    .phoneNumber("0987654321")
                    .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                    .role(Role.CUSTOMER)
                    .blocked(false)
                    .build();
            userProfileRepository.save(customer);

            Address address = Address.builder()
                    .userId(2L)
                    .recipientName("Nguyen Van A")
                    .phoneNumber("0987654321")
                    .province("Hồ Chí Minh")
                    .district("Quận 1")
                    .ward("Phường Bến Nghé")
                    .detailAddress("123 Lê Duẩn, Tòa nhà Diamond")
                    .isDefault(true)
                    .build();
            addressRepository.save(address);
        }
    }
}
