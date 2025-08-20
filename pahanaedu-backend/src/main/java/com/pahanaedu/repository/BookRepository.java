package com.pahanaedu.repository;

import com.pahanaedu.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Page<Book> findByActive(boolean active, Pageable pageable);

    // --- START: ADD THIS NEW METHOD ---
    Page<Book> findByTitleContainingIgnoreCaseAndActiveIsTrueOrAuthorContainingIgnoreCaseAndActiveIsTrue(String title,
            String author, Pageable pageable);
    // --- END: ADD THIS NEW METHOD ---
}