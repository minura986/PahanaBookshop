// Pahana/pahanaedu-backend/src/main/java/com/pahanaedu/controller/UserController.java
package com.pahanaedu.controller;

import com.pahanaedu.model.Order;
import com.pahanaedu.model.User;
import com.pahanaedu.repository.OrderRepository;
import com.pahanaedu.repository.UserRepository;
import com.pahanaedu.security.services.UserDetailsImpl;
import com.pahanaedu.security.services.ImageUploadService; // Import ImageUploadService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import MultipartFile

import java.io.IOException; // Import IOException
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ImageUploadService imageUploadService; // Inject ImageUploadService

    private UserDetailsImpl getCurrentUserDetails() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> getUserProfile() {
        String userId = getCurrentUserDetails().getId();
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(@RequestPart("user") User userDetails, // Changed to RequestPart
            @RequestPart(value = "image", required = false) MultipartFile image) { // Added MultipartFile
        String userId = getCurrentUserDetails().getId();
        return userRepository.findById(userId)
                .map(user -> {
                    // Check if new username is taken by another user
                    if (!user.getUsername().equals(userDetails.getUsername())
                            && userRepository.existsByUsername(userDetails.getUsername())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
                    }
                    // Check if new email is taken by another user
                    if (!user.getEmail().equals(userDetails.getEmail())
                            && userRepository.existsByEmail(userDetails.getEmail())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
                    }
                    user.setUsername(userDetails.getUsername());
                    user.setFirstName(userDetails.getFirstName());
                    user.setLastName(userDetails.getLastName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    user.setDefaultAddressLine1(userDetails.getDefaultAddressLine1());
                    user.setDefaultAddressLine2(userDetails.getDefaultAddressLine2());
                    user.setDefaultCity(userDetails.getDefaultCity());
                    user.setDefaultPostalCode(userDetails.getDefaultPostalCode());
                    user.setDefaultCountry(userDetails.getDefaultCountry());

                    // Handle profile image update
                    if (image != null && !image.isEmpty()) {
                        try {
                            String imageUrl = imageUploadService.uploadImage(image);
                            user.setProfileImageUrl(imageUrl);
                        } catch (IOException e) {
                            return ResponseEntity.status(500).body(Map.of("message", "Failed to upload image."));
                        }
                    } else if (userDetails.getProfileImageUrl() != null && userDetails.getProfileImageUrl().isEmpty()) {
                        // Allows clearing the image if an empty string is sent and no new image is
                        // uploaded
                        user.setProfileImageUrl(null);
                    }

                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getCurrentUserOrderHistory() {
        String userId = getCurrentUserDetails().getId();
        return ResponseEntity.ok(orderRepository.findByUserId(userId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}