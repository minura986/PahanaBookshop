package com.pahanaedu.repository;

import com.pahanaedu.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByCategory(String category);

    List<Book> findByActive(boolean active); // New method
}