package com.pahanaedu.controller;

import com.pahanaedu.model.Book;
import com.pahanaedu.repository.BookRepository;
import com.pahanaedu.security.services.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    /* Gets a paginated list of all active books for public viewing. */
    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(Pageable pageable) {
        return ResponseEntity.ok(bookRepository.findByActive(true, pageable));
    }

    /* Gets a single active book by its ID. */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.filter(Book::isActive)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /* Creates a new book. This is an admin-only endpoint. */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestPart("book") Book bookDetails,
            @RequestPart("image") MultipartFile image)
            throws IOException {
        Book newBook = new Book();

        newBook.setTitle(bookDetails.getTitle());
        newBook.setAuthor(bookDetails.getAuthor());
        newBook.setDescription(bookDetails.getDescription());
        newBook.setPrice(bookDetails.getPrice());
        newBook.setCost(bookDetails.getCost());
        newBook.setStock(bookDetails.getStock());
        newBook.setCategory(bookDetails.getCategory());
        newBook.setSubCategory(bookDetails.getSubCategory());
        newBook.setActive(bookDetails.isActive());

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageUploadService.uploadImage(image);
            newBook.setImageUrl(imageUrl);
        }

        Book savedBook = bookRepository.save(newBook);
        return ResponseEntity.ok(savedBook);
    }

    /* Updates an existing book. This is an admin-only endpoint. */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestPart("book") Book bookDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return bookRepository.findById(id).map(bookToUpdate -> {
            bookToUpdate.setTitle(bookDetails.getTitle());
            bookToUpdate.setAuthor(bookDetails.getAuthor());
            bookToUpdate.setDescription(bookDetails.getDescription());
            bookToUpdate.setPrice(bookDetails.getPrice());
            bookToUpdate.setCost(bookDetails.getCost());
            bookToUpdate.setStock(bookDetails.getStock());
            bookToUpdate.setCategory(bookDetails.getCategory());
            bookToUpdate.setSubCategory(bookDetails.getSubCategory());
            bookToUpdate.setActive(bookDetails.isActive());

            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = imageUploadService.uploadImage(image);
                    bookToUpdate.setImageUrl(imageUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image during update", e);
                }
            }

            return ResponseEntity.ok(bookRepository.save(bookToUpdate));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /* Updates the active/inactive status of a book. Admin-only. */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBookStatus(@PathVariable String id, @RequestBody Map<String, Boolean> status) {
        return bookRepository.findById(id)
                .map(book -> {
                    if (status.containsKey("active")) {
                        book.setActive(status.get("active"));
                    }
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* Deletes a book permanently. Admin-only. */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- START: ADD THIS NEW ENDPOINT ---
    /**
     * Searches for active books by title or author. This is a public endpoint.
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Book>> searchBooks(@RequestParam("query") String query, Pageable pageable) {
        Page<Book> books = bookRepository
                .findByTitleContainingIgnoreCaseAndActiveIsTrueOrAuthorContainingIgnoreCaseAndActiveIsTrue(query, query,
                        pageable);
        return ResponseEntity.ok(books);
    }
    // --- END: ADD THIS NEW ENDPOINT ---
}