package com.pahanaedu.controller;

import com.pahanaedu.model.Book;
import com.pahanaedu.repository.BookRepository;
import com.pahanaedu.security.services.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookRepository.findByActive(true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.filter(Book::isActive)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestPart("book") Book book, @RequestPart("image") MultipartFile image)
            throws IOException {
        String imageUrl = imageUploadService.uploadImage(image);
        book.setImageUrl(imageUrl);
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestPart("book") Book bookDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(bookDetails.getTitle());
                    book.setAuthor(bookDetails.getAuthor());
                    book.setDescription(bookDetails.getDescription());
                    book.setPrice(bookDetails.getPrice());
                    book.setStock(bookDetails.getStock());
                    book.setCategory(bookDetails.getCategory());
                    book.setSubCategory(bookDetails.getSubCategory());

                    if (image != null && !image.isEmpty()) {
                        try {
                            String imageUrl = imageUploadService.uploadImage(image);
                            book.setImageUrl(imageUrl);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload image", e);
                        }
                    }

                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBookStatus(@PathVariable String id, @RequestBody Map<String, Boolean> status) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setActive(status.get("active"));
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}