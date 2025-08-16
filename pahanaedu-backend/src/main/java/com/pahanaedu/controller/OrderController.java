// Pahana/pahanaedu-backend/src/main/java/com/pahanaedu/controller/OrderController.java
package com.pahanaedu.controller;

import com.pahanaedu.model.Order;
import com.pahanaedu.repository.OrderRepository;
import com.pahanaedu.repository.UserRepository;
import com.pahanaedu.repository.ReviewRepository; // Import ReviewRepository
import com.pahanaedu.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository; // Inject ReviewRepository

    private UserDetailsImpl getCurrentUserDetails() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = orderRepository.save(order);

        if (savedOrder.getUserId() != null && !savedOrder.getUserId().isEmpty()) {
            userRepository.findById(savedOrder.getUserId()).ifPresent(user -> {
                user.setHasPlacedOrder(true);
                userRepository.save(user);
            });
        }

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/guest/{id}")
    public ResponseEntity<Order> getGuestOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return orderRepository.findById(id)
                .map(o -> {
                    if (payload.containsKey("status")) {
                        o.setStatus(payload.get("status"));
                    }
                    if (payload.containsKey("returnAddress")) {
                        o.setReturnAddress(payload.get("returnAddress"));
                    }
                    return ResponseEntity.ok(orderRepository.save(o));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> requestCancellation(@PathVariable String id) {
        String userId = getCurrentUserDetails().getId();
        return orderRepository.findById(id)
                .map(order -> {
                    if (!order.getUserId().equals(userId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("You are not authorized to modify this order.");
                    }
                    if ("Pending".equals(order.getStatus())) {
                        order.setStatus("Cancellation Requested");
                        orderRepository.save(order);
                        return ResponseEntity
                                .ok("Cancellation requested successfully. An admin will review your request.");
                    }
                    if ("Shipped".equals(order.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("This order has already been shipped and cannot be returned or refunded.");
                    }
                    if ("Delivered".equals(order.getStatus())) {
                        // Check if the user has reviewed any book in this order
                        boolean hasReviewed = order.getItems().stream()
                                .anyMatch(item -> reviewRepository.findByBookIdAndUserId(item.getBookId(), userId)
                                        .isPresent());

                        if (hasReviewed) {
                            return ResponseEntity.badRequest()
                                    .body("Cannot request a return. You have already reviewed a book from this order.");
                        }

                        order.setStatus("Return Requested");
                        orderRepository.save(order);
                        return ResponseEntity.ok("Return requested successfully");
                    }
                    return ResponseEntity.badRequest()
                            .body("This order cannot be cancelled or returned at this stage.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}