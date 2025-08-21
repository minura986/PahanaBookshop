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

    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(Pageable pageable) {
        return ResponseEntity.ok(bookRepository.findByActive(true, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.filter(Book::isActive)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- UPDATED createBook Method ---
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("cost") double cost,
            @RequestParam("stock") int stock,
            @RequestParam("category") String category,
            @RequestParam("subCategory") String subCategory,
            @RequestParam("active") boolean active,
            @RequestParam("image") MultipartFile image)
            throws IOException {

        Book newBook = new Book();
        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setDescription(description);
        newBook.setPrice(price);
        newBook.setCost(cost);
        newBook.setStock(stock);
        newBook.setCategory(category);
        newBook.setSubCategory(subCategory);
        newBook.setActive(active);

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageUploadService.uploadImage(image);
            newBook.setImageUrl(imageUrl);
        }

        Book savedBook = bookRepository.save(newBook);
        return ResponseEntity.ok(savedBook);
    }

    // --- UPDATED updateBook Method ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("cost") double cost,
            @RequestParam("stock") int stock,
            @RequestParam("category") String category,
            @RequestParam("subCategory") String subCategory,
            @RequestParam("active") boolean active,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        return bookRepository.findById(id).map(bookToUpdate -> {
            bookToUpdate.setTitle(title);
            bookToUpdate.setAuthor(author);
            bookToUpdate.setDescription(description);
            bookToUpdate.setPrice(price);
            bookToUpdate.setCost(cost);
            bookToUpdate.setStock(stock);
            bookToUpdate.setCategory(category);
            bookToUpdate.setSubCategory(subCategory);
            bookToUpdate.setActive(active);

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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Book>> searchBooks(@RequestParam("query") String query, Pageable pageable) {
        Page<Book> books = bookRepository
                .findByTitleContainingIgnoreCaseAndActiveIsTrueOrAuthorContainingIgnoreCaseAndActiveIsTrue(query, query,
                        pageable);
        return ResponseEntity.ok(books);
    }
}