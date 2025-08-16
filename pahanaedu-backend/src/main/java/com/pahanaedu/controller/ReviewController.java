// Pahana/pahanaedu-backend/src/main/java/com/pahanaedu/controller/ReviewController.java
package com.pahanaedu.controller;

import com.pahanaedu.model.Review;
import com.pahanaedu.repository.ReviewRepository;
import com.pahanaedu.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (reviewRepository.findByBookIdAndUserId(review.getBookId(), userDetails.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("You have already reviewed this book.");
        }

        review.setUserId(userDetails.getId());
        review.setUsername(userDetails.getUsername());
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody Review reviewDetails) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        return reviewRepository.findById(id)
                .map(review -> {
                    if (!review.getUserId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body("You are not authorized to update this review.");
                    }
                    review.setRating(reviewDetails.getRating());
                    review.setComment(reviewDetails.getComment());
                    Review updatedReview = reviewRepository.save(review);
                    return ResponseEntity.ok(updatedReview);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> getReviewsByBookId(@PathVariable String bookId) {
        return ResponseEntity.ok(reviewRepository.findByBookId(bookId));
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Review>> getReviewsByUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(reviewRepository.findByUserId(userDetails.getId()));
    }
}